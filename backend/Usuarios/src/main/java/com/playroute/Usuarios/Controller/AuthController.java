package com.playroute.Usuarios.Controller;

import jakarta.servlet.http.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.web.exchanges.HttpExchange.Session;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.playroute.Usuarios.DTO.*;
import com.playroute.Usuarios.security.JwtKeys;
import com.playroute.Usuarios.service.AuthService;
import com.playroute.common.Exception.ApiException;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService service;
  private final JwtKeys keys;
  private final boolean secure;
  private final Set<String> origins;

  public AuthController(
      AuthService s,
      JwtKeys k,
      @Value("${app.cookie-secure}") boolean secure,
      @Value("${app.allowed-origins}") String origins,
      @Value("${app.gateway-url}") String gatewayUrl) {
    service = s;
    keys = k;
    this.secure = secure;
    Set<String> allowed = new HashSet<>(Arrays.asList(origins.split(",")));
    allowed.add(gatewayUrl);
    this.origins = Set.copyOf(allowed);
  }

  @io.swagger.v3.oas.annotations.Parameters({
    @io.swagger.v3.oas.annotations.Parameter(
        name = "X-Requested-With",
        in = io.swagger.v3.oas.annotations.enums.ParameterIn.HEADER,
        required = true,
        schema = @io.swagger.v3.oas.annotations.media.Schema(defaultValue = "GameTech"))
  })
  @PostMapping("/login")
  public SessionResponse login(
      @Valid @RequestBody LoginRequest form, HttpServletRequest req, HttpServletResponse res) {
    browserGuard(req);
    AuthResultado r = service.login(form.usuario(), form.contraseña());
    cookie(res, r.refresh(), 604800);
    return r.session();
  }

  @PostMapping("/registro")
  @ResponseStatus(HttpStatus.CREATED)
  public UsuarioResponse registro(@Valid @RequestBody RegistroRequest r) {
    return service.registrar(r.usuario(), r.nombre(), r.correo(), r.contraseña());
  }

  @io.swagger.v3.oas.annotations.Parameters({
    @io.swagger.v3.oas.annotations.Parameter(
        name = "X-Requested-With",
        in = io.swagger.v3.oas.annotations.enums.ParameterIn.HEADER,
        required = true,
        schema = @io.swagger.v3.oas.annotations.media.Schema(defaultValue = "GameTech"))
  })
  @PostMapping("/refresh")
  public SessionResponse refresh(
      @CookieValue(value = "gt_refresh", required = false) String token,
      HttpServletRequest req,
      HttpServletResponse res) {
    browserGuard(req);
    AuthResultado r = service.refresh(token);
    cookie(res, r.refresh(), 604800);
    return r.session();
  }

  @io.swagger.v3.oas.annotations.Parameters({
    @io.swagger.v3.oas.annotations.Parameter(
        name = "X-Requested-With",
        in = io.swagger.v3.oas.annotations.enums.ParameterIn.HEADER,
        required = true,
        schema = @io.swagger.v3.oas.annotations.media.Schema(defaultValue = "GameTech"))
  })
  @PostMapping("/logout")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void logout(
      @CookieValue(value = "gt_refresh", required = false) String token,
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
    if (!"GameTech".equals(req.getHeader("X-Requested-With"))
        || (origin != null && !origins.contains(origin)))
      throw new ApiException(403, "Origen o encabezado de sesión no permitido.");
  }

  private void cookie(HttpServletResponse res, String value, long seconds) {
    res.addHeader(
        HttpHeaders.SET_COOKIE,
        ResponseCookie.from("gt_refresh", value)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Strict")
            .path("/api/auth")
            .maxAge(seconds)
            .build()
            .toString());
  }
}
