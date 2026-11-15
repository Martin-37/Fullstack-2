package com.playroute.favoritos.service;
import com.playroute.favoritos.model.Favorito;
import com.playroute.favoritos.repository.FavoritoRepository;
import com.playroute.common.exception.ApiException;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.*;
@Service
public class FavoritosService {
    private final FavoritoRepository repo;
    private final RestClient catalogo;
    public FavoritosService(FavoritoRepository repo, @Value("${app.catalogo-url}") String url) {
        this.repo = repo;
        this.catalogo = RestClient.create(url);
    }
    public List<Long> listar(Long usuarioId) {
        return repo.findAllByUsuarioIdOrderByIdAsc(usuarioId).stream().map(f -> f.juegoId).toList();
    }
    @Transactional
    public void agregar(Long usuarioId, Long juegoId) {
        if (juegoId == null || juegoId <= 0) throw new ApiException(400, "ID de juego inválido.");
        if (repo.findByUsuarioIdAndJuegoId(usuarioId, juegoId).isPresent()) return;
        try {
            catalogo.get().uri("/api/juegos/{id}", juegoId).retrieve().toBodilessEntity();
        } catch (HttpClientErrorException.NotFound e) {
            throw new ApiException(404, "No existe el videojuego indicado.");
        } catch (RestClientException e) {
            throw new ApiException(503, "No se pudo consultar el catálogo de videojuegos.");
        }
        repo.save(new Favorito(usuarioId, juegoId));
    }
    @Transactional
    public void quitar(Long usuarioId, Long juegoId) {
        repo.findByUsuarioIdAndJuegoId(usuarioId, juegoId).ifPresent(repo::delete);
    }
}
