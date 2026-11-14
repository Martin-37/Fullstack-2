package com.playroute.Usuarios.service;

import com.playroute.Usuarios.DTO.RegistroRequest;
import com.playroute.Usuarios.DTO.UsuarioResponse;
import com.playroute.Usuarios.DTO.UsuarioUpdateRequest;
import com.playroute.Usuarios.model.Usuario;
import com.playroute.Usuarios.repository.RefreshRepository;
import com.playroute.Usuarios.repository.UsuarioRepository;
import com.playroute.common.exception.ApiException;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Operaciones de administración sobre usuarios (listar, crear, editar, desactivar). */
@Service
public class UsuariosService {

  private final UsuarioRepository repo;
  private final RefreshRepository refresh;
  private final AuthService auth;

  public UsuariosService(UsuarioRepository repo, RefreshRepository refresh, AuthService auth) {
    this.repo = repo;
    this.refresh = refresh;
    this.auth = auth;
  }

  public List<UsuarioResponse> listar() {
    return repo.findAll().stream().filter(u -> u.activo).map(AuthService::vista).toList();
  }

  public UsuarioResponse obtener(Long id) {
    return AuthService.vista(buscar(id));
  }

  public UsuarioResponse crear(RegistroRequest r) {
    return auth.registrar(r.nombre(), r.correo(), r.contrasena());
  }

  @Transactional
  public UsuarioResponse editar(Long id, UsuarioUpdateRequest e) {
    Usuario u = buscar(id);
    String correo = e.correo().trim().toLowerCase(Locale.ROOT);
    if (u.rol.equals("ADMIN")
        && !e.rol().equals("ADMIN")
        && repo.countByRolAndActivoTrue("ADMIN") <= 1)
      throw new ApiException(409, "Debe existir al menos un administrador.");
    if (!u.correo.equals(correo) && repo.existsByCorreo(correo))
      throw new ApiException(409, "Ese correo ya está registrado.");
    u.nombre = e.nombre().trim();
    u.correo = correo;
    u.rol = e.rol();
    refresh.deleteByUsuarioId(id);
    return AuthService.vista(repo.save(u));
  }

  @Transactional
  public void eliminar(Long id, String actorId) {
    Usuario u = buscar(id);
    if (id.toString().equals(actorId))
      throw new ApiException(409, "No puedes desactivar tu propia cuenta.");
    if (u.rol.equals("ADMIN") && repo.countByRolAndActivoTrue("ADMIN") <= 1)
      throw new ApiException(409, "No puedes eliminar el último administrador.");
    u.activo = false;
    refresh.deleteByUsuarioId(id);
    repo.save(u);
  }

  private Usuario buscar(Long id) {
    return repo.findById(id)
        .filter(u -> u.activo)
        .orElseThrow(() -> new ApiException(404, "Usuario no encontrado."));
  }
}
