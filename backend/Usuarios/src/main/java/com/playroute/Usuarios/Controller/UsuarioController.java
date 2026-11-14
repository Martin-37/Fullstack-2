package com.playroute.Usuarios.Controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.playroute.Usuarios.DTO.*;
import com.playroute.Usuarios.service.UsuariosService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuariosService service;

  public UsuarioController(UsuariosService service) {
    this.service = service;
  }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public UsuarioResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse crear(@Valid @RequestBody RegistroRequest request) {
        return service.crear(request);
    }

    @PutMapping("/{id}")
    public UsuarioResponse editar(
            @PathVariable Long id, @Valid @RequestBody UsuarioUpdateRequest request) {
        return service.editar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        service.eliminar(id, jwt.getSubject());
    }

}
