package com.playroute.common.security;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

/**
 * Configuración de seguridad común a todos los servicios: API sin sesión,
 * autenticación con JWT y roles tomados del claim "roles" (ADMIN -> ROLE_ADMIN).
 */
public final class SecuritySupport {
  private SecuritySupport() {}

  public static void base(HttpSecurity h) throws Exception {
    h.csrf(AbstractHttpConfigurer::disable)
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(convertidor())));
  }

  private static JwtAuthenticationConverter convertidor() {
    JwtGrantedAuthoritiesConverter roles = new JwtGrantedAuthoritiesConverter();
    roles.setAuthoritiesClaimName("roles");
    roles.setAuthorityPrefix("ROLE_");
    JwtAuthenticationConverter c = new JwtAuthenticationConverter();
    c.setJwtGrantedAuthoritiesConverter(roles);
    return c;
  }
}
