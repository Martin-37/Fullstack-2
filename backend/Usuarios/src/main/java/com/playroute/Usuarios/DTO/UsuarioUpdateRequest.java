package com.playroute.Usuarios.DTO;

import jakarta.validation.constraints.*;


public record UsuarioUpdateRequest(

@NotBlank@Size(max = 100) String nombre,
@NotBlank @Email String correo,
@Pattern(regexp = "ADMIN|MIEMBRO") @NotBlank String rol


){}