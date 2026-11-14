package com.playroute.catalogo.service;
import com.playroute.catalogo.dto.*;
import com.playroute.catalogo.model.Juego;
import com.playroute.catalogo.repository.JuegoRepository;
import com.playroute.common.exception.ApiException;
import java.text.Normalizer;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
public class JuegoService {
    private final JuegoRepository repo;
    public JuegoService(JuegoRepository repo) { this.repo = repo; }
    public List<JuegoResponse> listar(String categoria, String q) {
        String c = normalizar(categoria == null ? "" : categoria);
        String query = normalizar(q == null ? "" : q);
        return repo.findAll().stream()
            .filter(j -> normalizar(j.categoria).contains(c) && normalizar(j.nombre).contains(query))
            .sorted(Comparator.comparing(j -> j.id))
            .map(this::vista).toList();
    }
    public JuegoResponse obtener(Long id) { return vista(buscar(id)); }
    @Transactional
    public JuegoResponse crear(JuegoRequest r) {
        Juego j = new Juego();
        copiar(j, r);
        return vista(repo.save(j));
    }
    @Transactional
    public JuegoResponse editar(Long id, JuegoRequest r) {
        Juego j = buscar(id);
        copiar(j, r);
        return vista(repo.save(j));
    }
    @Transactional
    public void eliminar(Long id) { repo.delete(buscar(id)); }
    private Juego buscar(Long id) {
        return repo.findById(id).orElseThrow(() -> new ApiException(404, "Juego no encontrado."));
    }
    private static void copiar(Juego j, JuegoRequest r) {
        j.nombre = r.nombre().trim(); j.descripcion = r.descripcion().trim();
        j.categoria = r.categoria().trim(); j.imagen = r.imagen().trim();
    }
    private JuegoResponse vista(Juego j) {
        return new JuegoResponse(j.id, j.nombre, j.descripcion, j.categoria, j.imagen);
    }
    private static String normalizar(String s) {
        return Normalizer.normalize(s, Normalizer.Form.NFD)
            .replaceAll("\\p{M}+", "").toLowerCase(Locale.ROOT);
    }
}
