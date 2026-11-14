package com.playroute.catalogo.config;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.playroute.catalogo.dto.JuegoRequest;
import com.playroute.catalogo.model.Juego;
import com.playroute.catalogo.repository.JuegoRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.core.io.ClassPathResource;
@Configuration
public class Seed {
    @Bean CommandLineRunner inicializar(JuegoRepository repo, ObjectMapper mapper) {
        return args -> {
            if (repo.count() != 0) return;
            try (var in = new ClassPathResource("juegos-iniciales.json").getInputStream()) {
                List<JuegoRequest> juegos = mapper.readValue(in,
                    mapper.getTypeFactory().constructCollectionType(List.class, JuegoRequest.class));
                for (JuegoRequest item : juegos) {
                    Juego j = new Juego();
                    j.nombre = item.nombre(); j.descripcion = item.descripcion();
                    j.categoria = item.categoria(); j.imagen = item.imagen();
                    repo.save(j);
                }
            }
        };
    }
}
