package com.playroute.Usuarios.service;

import com.playroute.Usuarios.DTO.AuthResultado;
import com.playroute.Usuarios.DTO.Session;
import com.playroute.Usuarios.DTO.UsuarioResponse;
import com.playroute.Usuarios.model.RefreshSession;
import com.playroute.Usuarios.model.Usuario;
import com.playroute.Usuarios.repository.RefreshRepository;
import com.playroute.Usuarios.repository.UsuarioRepository;
import com.playroute.Usuarios.security.JwtKeys;
import com.playroute.common.exception.ApiException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

  private final UsuarioRepository users;
  private final RefreshRepository sessions;
  private final BCryptPasswordEncoder passwords;
  private final JwtEncoder encoder;
  private final String issuer;
  private final long seconds;

  public AuthService(
      UsuarioRepository users,
      RefreshRepository sessions,
      BCryptPasswordEncoder passwords,
      JwtKeys keys,
      @Value("${app.issuer}") String issuer,
      @Value("${app.access-seconds}") long seconds) {
    this.users = users;
    this.sessions = sessions;
    this.passwords = passwords;
    this.encoder = keys.encoder();
    this.issuer = issuer;
    this.seconds = seconds;
  }

  public static UsuarioResponse vista(Usuario u) {
    return new UsuarioResponse(u.id, u.nombre, u.correo, u.rol);
  }

  public Usuario usuario(Long id) {
    return users
        .findById(id)
        .filter(u -> u.activo)
        .orElseThrow(() -> new ApiException(401, "La cuenta no está activa."));
  }

  @Transactional
  public AuthResultado login(String correo, String pass) {
    Usuario u =
        users
            .findByCorreo(correo.trim().toLowerCase(Locale.ROOT))
            .filter(x -> x.activo && passwords.matches(pass, x.contrasenaHash))
            .orElseThrow(() -> new ApiException(401, "Correo o contraseña incorrectos."));
    return emitir(u);
  }

  @Transactional
  public AuthResultado refresh(String token) {
    RefreshSession s =
        sessions
            .bloquear(hash(token))
            .filter(x -> x.expira.isAfter(Instant.now()))
            .orElseThrow(
                () -> new ApiException(401, "La sesión expiró. Inicia sesión nuevamente."));
    Usuario u = usuario(s.usuarioId);
    sessions.delete(s);
    sessions.flush();
    return emitir(u);
  }

  @Transactional
  public void logout(String token) {
    if (token != null) sessions.deleteById(hash(token));
  }

  @Transactional
  public UsuarioResponse registrar(String nombre, String correo, String pass) {
    String mail = correo.trim().toLowerCase(Locale.ROOT);
    if (users.existsByCorreo(mail))
      throw new ApiException(409, "El correo ya está registrado.");
    Usuario u = new Usuario();
    u.nombre = nombre.trim();
    u.correo = mail;
    u.contrasenaHash = passwords.encode(pass);
    return vista(users.save(u));
  }

  private AuthResultado emitir(Usuario u) {
    Instant now = Instant.now();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer(issuer)
            .subject(u.id.toString())
            .audience(List.of("playroute-api"))
            .issuedAt(now)
            .expiresAt(now.plusSeconds(seconds))
            .claim("roles", List.of(u.rol))
            .claim("correo", u.correo)
            .build();
    String access =
        encoder
            .encode(
                JwtEncoderParameters.from(JwsHeader.with(SignatureAlgorithm.RS256).build(), claims))
            .getTokenValue();
    byte[] bytes = new byte[48];
    new SecureRandom().nextBytes(bytes);
    String refresh = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    sessions.save(new RefreshSession(hash(refresh), u.id, now.plus(Duration.ofDays(7))));
    return new AuthResultado(new Session(access, seconds, vista(u)), refresh);
  }

  static String hash(String value) {
    if (value == null || value.isBlank())
      throw new ApiException(401, "No existe una sesión activa.");
    try {
      return HexFormat.of()
          .formatHex(
              MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
    } catch (NoSuchAlgorithmException e) {
      throw new IllegalStateException(e);
    }
  }
}
