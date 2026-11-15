package com.playroute.catalogo.config;
import com.playroute.common.security.SecuritySupport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
public class SecurityConfig {
    @Bean
    JwtDecoder decoder(@Value("${app.jwks}") String jwks, @Value("${app.issuer}") String issuer) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri(jwks).build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuer));
        return decoder;
    }
    @Bean
    SecurityFilterChain security(HttpSecurity http) throws Exception {
        SecuritySupport.base(http);
        http.authorizeHttpRequests(a -> a
            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/actuator/health").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/juegos", "/api/juegos/**", "/api/v1/juegos", "/api/v1/juegos/**").permitAll()
            .requestMatchers("/api/juegos", "/api/juegos/**", "/api/v1/juegos", "/api/v1/juegos/**").hasRole("ADMIN")
            .anyRequest().denyAll());
        return http.build();
    }
}
