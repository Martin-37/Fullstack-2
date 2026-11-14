package com.playroute.Usuarios.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.playroute.Usuarios.DTO.RegistroRequest;
import com.playroute.Usuarios.DTO.UsuarioResponse;
import com.playroute.Usuarios.DTO.UsuarioUpdateRequest;
import com.playroute.Usuarios.model.Usuario;
import com.playroute.Usuarios.repository.RefreshRepository;
import com.playroute.Usuarios.repository.UsuarioRepository;
import com.playroute.common.Exception.ApiException;

@Service
public class UsuariosService {
  private final UsuarioRepository repo;
  private final RefreshRepository refresh;
  private final AuthService auth;

  public UsuariosService(UsuarioRepository r, RefreshRepository f, AuthService a) {
    repo = r;
    refresh = f;
    auth = a;
  }

  public List<UsuarioResponse> listar() {
    return repo.findAll().stream().filter(u -> u.activo).map(AuthService::vista).toList();
  }

  public UsuarioResponse obtener(Long id) {
    return AuthService.vista(buscar(id));
  }

  public UsuarioResponse crear(RegistroRequest r) {
    return auth.registrar(r.usuario(), r.nombre(), r.correo(), r.contraseña());
  }

  @Transactional
  public UsuarioResponse editar(Long id, UsuarioUpdateRequest e) {
    Usuario u = buscar(id);
    if (u.rol.equals("ADMIN")
        && !e.rol().equals("ADMIN")
        && repo.countByRolAndActivoTrue("ADMIN") <= 1)
      throw new ApiException(409, "Debe existir al menos un administrador.");
    u.nombre = e.nombre().trim();
    u.correo = e.correo().trim().toLowerCase(Locale.ROOT);
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