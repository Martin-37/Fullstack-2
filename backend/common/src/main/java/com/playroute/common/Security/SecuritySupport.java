package com.playroute.common.Security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

public class SecuritySupport {
public static JwtDecoder decoder(String jwks, String issuer){
    NimbusJwtDecoder d = NimbusJwtDecoder.withJwkSetUri(jwks).build();
    d.setJwtValidator(
        new DelegatingOAuth2TokenValidator<>(
            JwtValidators.createDefaultWithIssuer(issuer),
            jwt -> 
                jwt.getAudience().contains("playroute-api")
                ? OAuth2TokenValidatorResult.success()
                : OAuth2TokenValidatorResult.failure(
                    new OAuth2Error("invalid_token", "Audiencia incorrexta", null)
                )));
    
    return d;

}
 public static JwtAuthenticationConverter converter() {
    JwtGrantedAuthoritiesConverter a = new JwtGrantedAuthoritiesConverter();
    a.setAuthoritiesClaimName("roles");
    a.setAuthorityPrefix("ROLE_");
    JwtAuthenticationConverter c = new JwtAuthenticationConverter();
    c.setJwtGrantedAuthoritiesConverter(a);
    return c;
  }

  public static void base(HttpSecurity h) throws Exception {
    h.csrf(c -> c.disable())
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .oauth2ResourceServer(
            o ->
                o.jwt(j -> j.jwtAuthenticationConverter(converter()))
                    .authenticationEntryPoint(
                        (req, res, e) -> {
                          res.setStatus(401);
                          res.setContentType("application/json");
                          res.setCharacterEncoding("UTF-8");
                          res.getWriter()
                              .write(
                                  "{\"status\":401,\"mensaje\":\"Debes iniciar sesión o renovar tu"
                                      + " sesión.\"}");
                        }))
        .exceptionHandling(
            e ->
                e.accessDeniedHandler(
                    (req, res, ex) -> {
                      res.setStatus(403);
                      res.setContentType("application/json");
                      res.setCharacterEncoding("UTF-8");
                      res.getWriter()
                          .write(
                              "{\"status\":403,\"mensaje\":\"No tienes permisos para esta"
                                  + " acción.\"}");
                    }));
  }
}

