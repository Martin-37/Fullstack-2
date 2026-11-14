package com.playroute.gateway.config;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.*;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.*;
import org.springframework.web.cors.*;
import org.springframework.web.cors.reactive.*;
@Configuration
public class RoutesConfig {
    @Bean RouteLocator routes(RouteLocatorBuilder b,
        @Value("${app.usuarios-url}") String usuarios,
        @Value("${app.catalogo-url}") String catalogo,
        @Value("${app.favoritos-url}") String favoritos) {
        return b.routes()
            .route("usuarios", r -> r.path("/api/auth/**", "/api/usuarios/**", "/api/v1/auth/**", "/api/v1/usuarios", "/api/v1/usuarios/**").uri(usuarios))
            .route("catalogo", r -> r.path("/api/juegos", "/api/juegos/**", "/api/v1/juegos", "/api/v1/juegos/**").uri(catalogo))
            .route("favoritos", r -> r.path("/api/favoritos", "/api/favoritos/**", "/api/v1/favoritos", "/api/v1/favoritos/**").uri(favoritos))
            .route("doc-usuarios", r -> r.path("/openapi/usuarios").filters(f -> f.setPath("/v3/api-docs")).uri(usuarios))
            .route("doc-catalogo", r -> r.path("/openapi/catalogo").filters(f -> f.setPath("/v3/api-docs")).uri(catalogo))
            .route("doc-favoritos", r -> r.path("/openapi/favoritos").filters(f -> f.setPath("/v3/api-docs")).uri(favoritos))
            .build();
    }
    @Bean CorsWebFilter cors(@Value("${app.allowed-origins}") String origenes) {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(Arrays.asList(origenes.split(",")));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With"));
        c.setAllowCredentials(true);
        org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", c);
        return new CorsWebFilter(source);
    }
}
