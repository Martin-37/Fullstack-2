package com.playroute.Usuarios.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "sesiones_refresh")
public class RefreshSession {

  @Id public String tokenHash;
  public Long usuarioId;
  public Instant expira;

  public RefreshSession() {}

  public RefreshSession(String hash, Long usuarioId, Instant expira) {
    this.tokenHash = hash;
    this.usuarioId = usuarioId;
    this.expira = expira;
  }
}
