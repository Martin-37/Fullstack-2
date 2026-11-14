package com.playroute.gateway.Config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;

@Configuration
public class RoutesConfig {
    @Bean
    RouteLocator routes(
        RouteLocatorBuilder b,
        @Value("${app.usuarios-url")String users,
        @Value("${app.administrador-url}") String admin,
        @Value("${app.favoritos-url}") String orders) {
            return b.routes()
            .route("usuarios",r -> r.path("/api/auth/**", "/api/usuarios/**").uri(users))
            .route("administrador", r -> r.path("/api/administrador/**").uri(admin))
            .route("favoritos", r -> r.path("/api/favoritos/**").uri(orders))
            .route(
                "docs-usuarios",
                r-> r.path("/openapi/usuarios").filters(f -> f.setPath("/v3/api-docs")).uri(users))
                .route(
                    "docs-administrador",
                r-> r.path("/openapi/administrador").filters(f -> f.setPath("/v3/api-docs")).uri(users))
                .route(
                    "docs-favoritos",
                r-> r.path("/openapi/favoritos").filters(f -> f.setPath("/v3/api-docs")).uri(users))
                .build();

    }
    @Bean
    CorsWebFilter cors(@Value("${app.allowed-origins}")String origins){
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(Arrays.asList(origins.split(",")));
         c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
          c.setAllowedHeaders(
        List.of("Content-Type", "Authorization", "Idempotency-Key", "X-Requested-With"));
    c.setAllowCredentials(true);
    org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source =
        new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", c);
    return new CorsWebFilter(source);
  }
    
    

}
