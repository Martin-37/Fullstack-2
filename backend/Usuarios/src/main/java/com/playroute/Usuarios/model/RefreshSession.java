package com.playroute.Usuarios.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "sesiones_refresh")
public class RefreshSession {

   @Id public String refreshToken;

    public Long usuarioId;
    public Instant expiratesIn;

    public RefreshSession() {
    }

    public RefreshSession(String hash, Long user, Instant expiry) {
        refreshToken = hash;
        usuarioId = user;
        expiratesIn = expiry;
    }
}
