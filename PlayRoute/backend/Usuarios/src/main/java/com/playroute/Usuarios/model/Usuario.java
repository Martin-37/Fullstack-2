package com.playroute.Usuarios.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @Column(nullable = false, length = 100)
  public String nombre;

  @Column(nullable = false, unique = true)
  public String correo;

  @Column(nullable = false)
  public String contrasenaHash;

  @Column(nullable = false)
  public String rol = "MIEMBRO";

  public boolean activo = true;

  public Usuario() {}
}
