package com.playroute.Usuarios.DTO;
public record SessionResponse(String tokenAcess, long expiratesIn, UsuarioResponse usuario) {}

