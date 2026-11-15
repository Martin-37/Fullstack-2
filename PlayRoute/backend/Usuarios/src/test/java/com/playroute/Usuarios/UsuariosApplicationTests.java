package com.playroute.Usuarios;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Pruebas HTTP reales de PlayRoute. Sustituye las pruebas copiadas de GameTech. */
@ActiveProfiles("h2")
@SpringBootTest(properties={
  "spring.datasource.url=jdbc:h2:mem:usuarios_test;DB_CLOSE_DELAY=-1",
  "app.keys-directory=./target/test-keys",
  "app.admin-password=Admin1234!",
  "app.miembro-password=Cliente1234!"
})
@AutoConfigureMockMvc
class UsuariosApplicationTests {
  @Autowired MockMvc mvc;

  @Test void loginAdminEntregaJwt() throws Exception {
    mvc.perform(post("/api/v1/auth/login")
        .header("X-Requested-With", "PlayRoute")
        .contentType("application/json")
        .content("{\"correo\":\"admin@playroute.com\",\"contrasena\":\"Admin1234!\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken").isNotEmpty())
        .andExpect(jsonPath("$.usuario.rol").value("ADMIN"))
        .andExpect(cookie().httpOnly("pr_refresh", true));
  }

  @Test void accesoPrivadoSinTokenDa401() throws Exception {
    mvc.perform(get("/api/v1/usuarios")).andExpect(status().isUnauthorized());
  }

  @Test void loginIncorrectoDa401() throws Exception {
    mvc.perform(post("/api/v1/auth/login")
        .header("X-Requested-With", "PlayRoute")
        .contentType("application/json")
        .content("{\"correo\":\"admin@playroute.com\",\"contrasena\":\"incorrecta\"}"))
        .andExpect(status().isUnauthorized());
  }
}
