package com.playroute.favoritos.repository;
import com.playroute.favoritos.model.Favorito;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findAllByUsuarioIdOrderByIdAsc(Long usuarioId);
    Optional<Favorito> findByUsuarioIdAndJuegoId(Long usuarioId, Long juegoId);
}
