package com.playroute.Usuarios.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.playroute.Usuarios.model.*;
import com.playroute.Usuarios.repository.*;

@Configuration
public class Seed{
 @Bean 
  CommandLineRunner cargarDatos(
      UsuarioRepository r,
      BCryptPasswordEncoder encoder,
      @Value("${app.admin-password}") String admin,
      @Value("${app.cliente-password}") String cliente) {
    return args -> {
      for (String name : new String[] {"admin", "cliente"}) {
        if (!r.existsByUsuario(name)) {
          Usuario u = new Usuario();
          u.usuario = name;
          u.nombre = name.equals("admin") ? "Administrador GameTech" : "Cliente GameTech";
          u.correo = name + "@gametech.local";
          u.rol = name.equals("admin") ? "ADMIN" : "CLIENTE";
          u.contraseña = encoder.encode(name.equals("admin") ? admin : cliente);
          r.save(u);
        }
      }
    };
  }





 

}