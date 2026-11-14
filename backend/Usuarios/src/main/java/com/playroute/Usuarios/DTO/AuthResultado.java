package com.playroute.Usuarios.DTO;

import jakarta.validation.constraints.*;
public record AuthResultado(SessionResponse session, String refresh) {}
