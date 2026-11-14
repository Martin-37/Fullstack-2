package com.playroute.Usuarios.DTO;

public record UsuarioResponse(

    Long id,
    String usuario,
    String nombre,
    String correo,
    String rol

) {}
