package com.playroute.catalogo.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
public record JuegoRequest(
    @NotBlank @Size(max=150) String nombre,
    @NotBlank @Size(max=1500) @JsonProperty("min_desc") String descripcion,
    @NotBlank @Size(max=300) String categoria,
    @NotBlank @Size(max=4096) String imagen) {}
