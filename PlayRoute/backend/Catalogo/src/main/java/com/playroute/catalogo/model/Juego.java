package com.playroute.catalogo.model;
import jakarta.persistence.*;
@Entity
@Table(name="juegos")
public class Juego {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(nullable=false, length=150) public String nombre;
    @Column(name="min_desc", nullable=false, length=1500) public String descripcion;
    @Column(nullable=false, length=300) public String categoria;
    @Column(nullable=false, length=4096) public String imagen;
    public Juego() {}
}
