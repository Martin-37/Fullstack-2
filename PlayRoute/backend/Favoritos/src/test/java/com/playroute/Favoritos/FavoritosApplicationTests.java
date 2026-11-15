package com.playroute.favoritos;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("h2")
@SpringBootTest(properties="spring.datasource.url=jdbc:h2:mem:favoritos_context;DB_CLOSE_DELAY=-1")
class FavoritosApplicationTests {
  @Test void contextLoads() {}
}
