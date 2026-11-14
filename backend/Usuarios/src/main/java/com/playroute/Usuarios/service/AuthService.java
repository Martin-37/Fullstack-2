package com.playroute.Usuarios.service;

import com.playroute.Usuarios.DTO.*;
import com.playroute.Usuarios.model.*;
import com.playroute.Usuarios.repository.*;
import com.playroute.Usuarios.security.JwtKeys;
import com.playroute.common.Exception.ApiException;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.*;
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
      UsuarioRepository u,
      RefreshRepository s,
      BCryptPasswordEncoder p,
      JwtKeys keys,
      @Value("${app.issuer}") String issuer,
      @Value("${app.access-seconds}") long seconds) {
    users = u;
    sessions = s;
    passwords = p;
    encoder = keys.encoder();
    this.issuer = issuer;
    this.seconds = seconds;
  }

  public static UsuarioResponse vista(Usuario u) {
    return new UsuarioResponse(u.id, u.usuario, u.nombre, u.correo, u.rol);
  }

  public Usuario usuario(Long id) {
    return users
        .findById(id)
        .filter(u -> u.activo)
        .orElseThrow(() -> new ApiException(401, "La cuenta no está activa."));
  }

  @Transactional
  public AuthResultado login(String user, String pass) {
    Usuario u =
        users
            .findByUsuario(user.trim().toLowerCase(Locale.ROOT))
            .filter(x -> x.activo && passwords.matches(pass, x.contraseña))
            .orElseThrow(() -> new ApiException(401, "Usuario o contraseña incorrectos."));
    return emitir(u);
  }

  @Transactional
  public AuthResultado refresh(String token) {
    RefreshSession s =
        sessions
            .bloquear(hash(token))
            .filter(x -> x.expiratesIn.isAfter(Instant.now()))
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

  private AuthResultado emitir(Usuario u) {
    Instant now = Instant.now();
    JwtClaimsSet claims =
        JwtClaimsSet.builder()
            .issuer(issuer)
            .subject(u.id.toString())
            .audience(List.of("gametech-api"))
            .issuedAt(now)
            .expiresAt(now.plusSeconds(seconds))
            .claim("roles", List.of(u.rol))
            .claim("usuario", u.usuario)
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
    return new AuthResultado(new SessionResponse(access, seconds, vista(u)), refresh);
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

  @Transactional
  public UsuarioResponse registrar(String user, String nombre, String email, String pass) {
    String username = user.trim().toLowerCase(Locale.ROOT),
        mail = email.trim().toLowerCase(Locale.ROOT);
    if (users.existsByUsuario(username) || users.existsByCorreo(mail))
      throw new ApiException(409, "El usuario o correo ya está registrado.");
    Usuario u = new Usuario();
    u.usuario = username;
    u.nombre = nombre.trim();
    u.correo = mail;
    u.contraseña = passwords.encode(pass);
    return vista(users.save(u));
  }
}
