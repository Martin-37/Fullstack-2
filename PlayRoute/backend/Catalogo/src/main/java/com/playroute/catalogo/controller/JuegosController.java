package com.playroute.catalogo.controller;
import com.playroute.catalogo.dto.*;
import com.playroute.catalogo.service.JuegoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping({"/api/juegos", "/api/v1/juegos"})
public class JuegosController {
    private final JuegoService service;
    public JuegosController(JuegoService service) { this.service = service; }
    @GetMapping public List<JuegoResponse> listar(
        @RequestParam(required=false) String categoria, @RequestParam(required=false) String q) {
        return service.listar(categoria, q);
    }
    @GetMapping("/{id}") public JuegoResponse obtener(@PathVariable Long id) { return service.obtener(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public JuegoResponse crear(@Valid @RequestBody JuegoRequest r) { return service.crear(r); }
    @PutMapping("/{id}")
    public JuegoResponse editar(@PathVariable Long id, @Valid @RequestBody JuegoRequest r) {
        return service.editar(id, r);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}
