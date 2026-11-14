package com.playroute.Usuarios.DTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistroRequest(

    @NotBlank @Pattern(regexp = "[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{3,30}") String usuario,
    @NotBlank @Size(max = 100) String nombre,
    @NotBlank @Email String correo,
    @NotBlank @Size(min = 6, max = 75) String contraseña
){}