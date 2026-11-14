package com.playroute.Usuarios.Config;

import com.playroute.Usuarios.model.Usuario;
import com.playroute.Usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/** Crea los dos usuarios de prueba la primera vez que arranca el servicio. */
@Configuration
public class Seed {

  @Bean
  CommandLineRunner cargarDatos(
      UsuarioRepository repo,
      BCryptPasswordEncoder encoder,
      @Value("${app.admin-password}") String admin,
      @Value("${app.miembro-password}") String miembro) {
    return args -> {
      crear(repo, encoder, "Administrador PlayRoute", "admin@playroute.com", "ADMIN", admin);
      crear(repo, encoder, "Usuario PlayRoute", "user@playroute.com", "MIEMBRO", miembro);
    };
  }

  private static void crear(
      UsuarioRepository repo,
      BCryptPasswordEncoder encoder,
      String nombre,
      String correo,
      String rol,
      String clave) {
    if (repo.existsByCorreo(correo)) return;
    Usuario u = new Usuario();
    u.nombre = nombre;
    u.correo = correo;
    u.rol = rol;
    u.contrasenaHash = encoder.encode(clave);
    repo.save(u);
  }
}
