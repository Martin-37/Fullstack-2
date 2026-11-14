package com.playroute.Usuarios.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.playroute.Usuarios.model.*;

import jakarta.persistence.LockModeType;
public interface RefreshRepository extends JpaRepository<RefreshSession, String>{
 @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select s from RefreshSession s where s.tokenHash=:hash")
  Optional<RefreshSession> bloquear(String hash);

  void deleteByUsuarioId(Long usuarioId);
}