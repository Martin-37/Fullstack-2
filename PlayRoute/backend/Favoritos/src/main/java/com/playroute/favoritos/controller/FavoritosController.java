package com.playroute.favoritos.controller;
import com.playroute.favoritos.service.FavoritosService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping({"/api/favoritos", "/api/v1/favoritos"})
public class FavoritosController {
    private final FavoritosService service;
    public FavoritosController(FavoritosService service) { this.service=service; }
    @GetMapping public List<Long> listar(@AuthenticationPrincipal Jwt jwt) {
        return service.listar(Long.valueOf(jwt.getSubject()));
    }
    @PostMapping("/{juegoId}") @ResponseStatus(HttpStatus.CREATED)
    public void agregar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long juegoId) {
        service.agregar(Long.valueOf(jwt.getSubject()), juegoId);
    }
    @DeleteMapping("/{juegoId}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void quitar(@AuthenticationPrincipal Jwt jwt, @PathVariable Long juegoId) {
        service.quitar(Long.valueOf(jwt.getSubject()), juegoId);
    }
}
