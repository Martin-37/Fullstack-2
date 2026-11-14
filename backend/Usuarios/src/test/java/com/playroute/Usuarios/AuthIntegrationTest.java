package com.playroute.Usuarios;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.playroute.Usuarios.repository.UsuarioRepository;

@org.springframework.test.context.ActiveProfiles("h2")
@SpringBootTest(
    properties = {
      "spring.datasource.url=jdbc:h2:mem:auth-test",
      "app.keys-directory=./target/test-keys"
    })
@AutoConfigureMockMvc
class AuthIntegrationTest {
  @Autowired MockMvc mvc;
  @Autowired UsuarioRepository users;

  @Test
  void loginCorrectoEmiteJwtYCookieHttpOnly() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .header("X-Requested-With", "GameTech")
                .contentType("application/json")
                .content("{\"usuario\":\"admin\",\"contrasena\":\"Admin1234!\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").isNotEmpty())
        .andExpect(jsonPath("$.usuario.rol").value("ADMIN"))
        .andExpect(cookie().httpOnly("gt_refresh", true));
  }

  @Test
  void loginIncorrectoDevuelve401() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .header("X-Requested-With", "GameTech")
                .contentType("application/json")
                .content("{\"usuario\":\"admin\",\"contrasena\":\"incorrecta\"}"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void refreshSinCookieDevuelve401() throws Exception {
    mvc.perform(post("/api/auth/refresh").header("X-Requested-With", "GameTech"))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void sesionRechazaOrigenAjeno() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .header("X-Requested-With", "GameTech")
                .header("Origin", "https://otro.example")
                .contentType("application/json")
                .content("{\"usuario\":\"admin\",\"contrasena\":\"Admin1234!\"}"))
        .andExpect(status().isForbidden());
  }

  @Test
  void registroNoPermiteElegirRol() throws Exception {
    mvc.perform(
            post("/api/auth/registro")
                .contentType("application/json")
                .content(
                    "{\"usuario\":\"nuevo-test\",\"nombre\":\"Nuevo"
                        + " Usuario\",\"email\":\"nuevo@test.cl\",\"contrasena\":\"Cliente1234!\",\"rol\":\"ADMIN\"}"))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.rol").value("CLIENTE"));
  }

  @Test
  void passwordNoSeGuardaEnTextoPlano() {
    assertTrue(users.findByUsuario("admin").orElseThrow().contraseña.startsWith("$2"));
  }

  @Test
  void usuariosSinTokenDevuelve401() throws Exception {
    mvc.perform(get("/api/usuarios")).andExpect(status().isUnauthorized());
  }

  @Test
  void loginDesdeSwaggerDelGateway() throws Exception {
    mvc.perform(
            post("/api/auth/login")
                .header("X-Requested-With", "GameTech")
                .header("Origin", "http://localhost:8080")
                .contentType("application/json")
                .content("{\"usuario\":\"admin\",\"contrasena\":\"Admin1234!\"}"))
        .andExpect(status().isOk());
  }

  @Autowired com.fasterxml.jackson.databind.ObjectMapper json;

  @Test
  @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
  void crudUsuariosRecorreControllerServiceRepositoryYJpa() throws Exception {
    String username = "crud-" + java.util.UUID.randomUUID().toString().substring(0, 8);
    String created =
        mvc.perform(
                post("/api/usuarios")
                    .contentType("application/json")
                    .content(
                        "{\"usuario\":\""
                            + username
                            + "\",\"nombre\":\"Alumno Prueba\",\"email\":\""
                            + username
                            + "@test.cl\",\"contrasena\":\"Alumno12345!\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.passwordHash").doesNotExist())
            .andReturn()
            .getResponse()
            .getContentAsString();
    long id = json.readTree(created).get("id").asLong();
    mvc.perform(get("/api/usuarios/" + id))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.usuario").value(username));
    mvc.perform(
            put("/api/usuarios/" + id)
                .contentType("application/json")
                .content(
                    "{\"nombre\":\"Alumno Editado\",\"email\":\""
                        + username
                        + "@test.cl\",\"rol\":\"CLIENTE\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.nombre").value("Alumno Editado"));
    mvc.perform(
            delete("/api/usuarios/" + id)
                .with(
                    org.springframework.security.test.web.servlet.request
                        .SecurityMockMvcRequestPostProcessors.jwt()
                        .jwt(j -> j.subject("1"))
                        .authorities(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_ADMIN"))))
        .andExpect(status().isNoContent());
    mvc.perform(get("/api/usuarios/" + id))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.mensaje").value("Usuario no encontrado."));
    assertFalse(users.findById(id).orElseThrow().activo);
  }

  @Test
  @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
  void adviceConvierteUsuarioInexistenteEn404() throws Exception {
    mvc.perform(get("/api/usuarios/9999999"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.status").value(404));
  }

  @Test
  @org.springframework.security.test.context.support.WithMockUser(roles = "ADMIN")
  void noSePuedeDegradarAlUltimoAdministrador() throws Exception {
    long id = users.findByUsuario("admin").orElseThrow().id;
    mvc.perform(
            put("/api/usuarios/" + id)
                .contentType("application/json")
                .content(
                    "{\"nombre\":\"Administrador\",\"email\":\"admin@gametech.local\",\"rol\":\"CLIENTE\"}"))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.status").value(409));
    assertEquals("ADMIN", users.findById(id).orElseThrow().rol);
  }

  @Test
  void noSePuedeDesactivarLaPropiaCuenta() throws Exception {
    long id = users.findByUsuario("admin").orElseThrow().id;
    mvc.perform(
            delete("/api/usuarios/" + id)
                .with(
                    org.springframework.security.test.web.servlet.request
                        .SecurityMockMvcRequestPostProcessors.jwt()
                        .jwt(j -> j.subject(Long.toString(id)))
                        .authorities(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_ADMIN"))))
        .andExpect(status().isConflict());
    assertTrue(users.findById(id).orElseThrow().activo);
  }
}
