package com.playroute.Usuarios.Controller;

import com.playroute.Usuarios.DTO.RegistroRequest;
import com.playroute.Usuarios.DTO.UsuarioResponse;
import com.playroute.Usuarios.DTO.UsuarioUpdateRequest;
import com.playroute.Usuarios.service.UsuariosService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Gestión de usuarios. Solo para el administrador (ver SecurityConfig). */
@RestController
@RequestMapping({"/api/usuarios", "/api/v1/usuarios"})
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
