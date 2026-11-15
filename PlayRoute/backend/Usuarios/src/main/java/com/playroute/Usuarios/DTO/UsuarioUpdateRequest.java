package com.playroute.Usuarios.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UsuarioUpdateRequest(
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email String correo,
    @NotBlank @Pattern(regexp = "ADMIN|MIEMBRO") String rol) {}
