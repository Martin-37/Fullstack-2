package com.playroute.catalogo.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
public record JuegoResponse(Long id, String nombre,
    @JsonProperty("min_desc") String descripcion, String categoria, String imagen) {}
