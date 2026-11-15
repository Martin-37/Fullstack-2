package com.playroute.catalogo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Pruebas HTTP: lectura pública y CRUD de escritura protegido por rol. */
@SpringBootTest(properties="spring.datasource.url=jdbc:h2:mem:catalogo_test;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class CatalogoHttpTest {
    @Autowired MockMvc mvc;
    @Test void catalogoPublico() throws Exception {
        mvc.perform(get("/api/v1/juegos")).andExpect(status().isOk())
            .andExpect(jsonPath("$[0].nombre").value("Overwatch"));
    }
    @Test void agregarRequiereJwtAdmin() throws Exception {
        mvc.perform(post("/api/v1/juegos")
                .contentType("application/json")
                .content("{\"nombre\":\"Test\",\"min_desc\":\"Prueba\",\"categoria\":\"Acción\",\"imagen\":\"https://example.com\"}"))
            .andExpect(status().isUnauthorized());
    }
}
