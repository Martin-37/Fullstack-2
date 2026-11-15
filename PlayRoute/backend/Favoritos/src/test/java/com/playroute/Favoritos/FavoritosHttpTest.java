package com.playroute.favoritos;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Nadie puede leer ni editar favoritos si no presenta token JWT. */
@SpringBootTest(properties="spring.datasource.url=jdbc:h2:mem:favoritos_test;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class FavoritosHttpTest {
    @Autowired MockMvc mvc;
    @Test void lecturaRequiereLogin() throws Exception {
        mvc.perform(get("/api/v1/favoritos")).andExpect(status().isUnauthorized());
    }
    @Test void escrituraRequiereLogin() throws Exception {
        mvc.perform(post("/api/v1/favoritos/1")).andExpect(status().isUnauthorized());
    }
}
