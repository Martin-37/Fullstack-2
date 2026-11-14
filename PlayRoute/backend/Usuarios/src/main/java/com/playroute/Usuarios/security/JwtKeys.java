package com.playroute.Usuarios.security;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Component;

/** Genera (la primera vez) y carga el par de llaves RSA con que se firman los tokens. */
@Component
public class JwtKeys {

  private final com.nimbusds.jose.jwk.RSAKey rsa;

  public JwtKeys(@Value("${app.keys-directory}") String dir) throws Exception {
    Path p = Path.of(dir);
    Files.createDirectories(p);
    Path privateFile = p.resolve("private.pk8");
    Path publicFile = p.resolve("public.der");
    if (!Files.exists(privateFile)) {
      KeyPairGenerator g = KeyPairGenerator.getInstance("RSA");
      g.initialize(2048);
      KeyPair pair = g.generateKeyPair();
      Files.write(privateFile, pair.getPrivate().getEncoded());
      Files.write(publicFile, pair.getPublic().getEncoded());
      try {
        Files.setPosixFilePermissions(
            privateFile, java.nio.file.attribute.PosixFilePermissions.fromString("rw-------"));
      } catch (UnsupportedOperationException ignored) {
        // Windows no usa permisos POSIX
      }
    }
    KeyFactory f = KeyFactory.getInstance("RSA");
    RSAPrivateKey priv =
        (RSAPrivateKey) f.generatePrivate(new PKCS8EncodedKeySpec(Files.readAllBytes(privateFile)));
    RSAPublicKey pub =
        (RSAPublicKey) f.generatePublic(new X509EncodedKeySpec(Files.readAllBytes(publicFile)));
    String kid =
        Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(MessageDigest.getInstance("SHA-256").digest(pub.getEncoded()));
    rsa = new com.nimbusds.jose.jwk.RSAKey.Builder(pub).privateKey(priv).keyID(kid).build();
  }

  public JwtEncoder encoder() {
    return new NimbusJwtEncoder(new ImmutableJWKSet<SecurityContext>(new JWKSet(rsa)));
  }

  public JwtDecoder decoder(String issuer) throws Exception {
    NimbusJwtDecoder d = NimbusJwtDecoder.withPublicKey(rsa.toRSAPublicKey()).build();
    d.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuer));
    return d;
  }

  public Map<String, Object> publicJwks() {
    return new JWKSet(rsa.toPublicJWK()).toJSONObject();
  }
}
