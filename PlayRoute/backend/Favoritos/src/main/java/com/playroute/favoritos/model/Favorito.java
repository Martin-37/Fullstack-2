package com.playroute.favoritos.model;
import jakarta.persistence.*;
@Entity
@Table(name="favoritos", uniqueConstraints=@UniqueConstraint(columnNames={"usuario_id","juego_id"}))
public class Favorito {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
    @Column(name="usuario_id", nullable=false) public Long usuarioId;
    @Column(name="juego_id", nullable=false) public Long juegoId;
    public Favorito() {}
    public Favorito(Long usuarioId, Long juegoId) { this.usuarioId=usuarioId; this.juegoId=juegoId; }
}
