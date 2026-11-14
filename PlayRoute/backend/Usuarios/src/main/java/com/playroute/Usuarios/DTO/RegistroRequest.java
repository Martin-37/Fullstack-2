package com.playroute.Usuarios.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email String correo,
    @NotBlank @Size(min = 6, max = 72) String contrasena) {}
