package com.playroute.Usuarios.DTO;

public record Session(String accessToken, long expiresIn, UsuarioResponse usuario) {}
