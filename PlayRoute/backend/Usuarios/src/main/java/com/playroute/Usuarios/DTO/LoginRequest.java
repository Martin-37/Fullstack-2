package com.playroute.Usuarios.DTO;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String correo, @NotBlank String contrasena) {}
