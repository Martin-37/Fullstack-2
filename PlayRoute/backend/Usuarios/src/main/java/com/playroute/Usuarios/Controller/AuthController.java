package com.playroute.Usuarios.Controller;

import com.playroute.Usuarios.DTO.AuthResultado;
import com.playroute.Usuarios.DTO.LoginRequest;
import com.playroute.Usuarios.DTO.RegistroRequest;
import com.playroute.Usuarios.DTO.Session;
import com.playroute.Usuarios.DTO.UsuarioResponse;
import com.playroute.Usuarios.security.JwtKeys;
import com.playroute.Usuarios.service.AuthService;
import com.playroute.common.exception.ApiException;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
public class AuthController {

  private static final String HEADER = "X-Requested-With";
  private static final String VALOR = "PlayRoute";
  private static final String COOKIE = "pr_refresh";

  private final AuthService service;
  private final JwtKeys keys;
  private final boolean secure;
  private final Set<String> origins;

  public AuthController(
      AuthService service,
      JwtKeys keys,
      @Value("${app.cookie-secure}") boolean secure,
      @Value("${app.allowed-origins}") String origins,
      @Value("${app.gateway-url}") String gatewayUrl) {
    this.service = service;
    this.keys = keys;
    this.secure = secure;
    Set<String> allowed = new HashSet<>(Arrays.asList(origins.split(",")));
    allowed.add(gatewayUrl);
    this.origins = Set.copyOf(allowed);
  }

  @Parameter(name = HEADER, in = ParameterIn.HEADER, required = true, schema = @Schema(defaultValue = VALOR))
  @PostMapping("/login")
  public Session login(
      @Valid @RequestBody LoginRequest form, HttpServletRequest req, HttpServletResponse res) {
    browserGuard(req);
    AuthResultado r = service.login(form.correo(), form.contrasena());
    cookie(res, r.refresh(), 604800);
    return r.session();
  }

  @PostMapping("/registro")
  @ResponseStatus(HttpStatus.CREATED)
  public UsuarioResponse registro(@Valid @RequestBody RegistroRequest r) {
    return service.registrar(r.nombre(), r.correo(), r.contrasena());
  }

  @Parameter(name = HEADER, in = ParameterIn.HEADER, required = true, schema = @Schema(defaultValue = VALOR))
  @PostMapping("/refresh")
  public Session refresh(
      @CookieValue(value = COOKIE, required = false) String token,
      HttpServletRequest req,
      HttpServletResponse res) {
    browserGuard(req);
    AuthResultado r = service.refresh(token);
    cookie(res, r.refresh(), 604800);
    return r.session();
  }

  @Parameter(name = HEADER, in = ParameterIn.HEADER, required = true, schema = @Schema(defaultValue = VALOR))
  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(
      @CookieValue(value = COOKIE, required = false) String token,
      HttpServletRequest req,
      HttpServletResponse res) {
    browserGuard(req);
    service.logout(token);
    cookie(res, "", 0);
  }

  @GetMapping("/me")
  public UsuarioResponse me(@AuthenticationPrincipal Jwt jwt) {
    return AuthService.vista(service.usuario(Long.valueOf(jwt.getSubject())));
  }

  @GetMapping("/jwks")
  public Map<String, Object> jwks() {
    return keys.publicJwks();
  }

  private void browserGuard(HttpServletRequest req) {
    String origin = req.getHeader("Origin");
    if (!VALOR.equals(req.getHeader(HEADER)) || (origin != null && !origins.contains(origin)))
      throw new ApiException(403, "Origen o encabezado de sesión no permitido.");
  }

  private void cookie(HttpServletResponse res, String value, long seconds) {
    res.addHeader(
        HttpHeaders.SET_COOKIE,
        ResponseCookie.from(COOKIE, value)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Strict")
            .path("/api")
            .maxAge(seconds)
            .build()
            .toString());
  }
}
