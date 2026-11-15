package com.playroute.common.exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

/** Manejadores de errores compartidos. Cada servicio la extiende en su GlobalExceptionHandler. */
public class ApiErrors {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<Map<String, Object>> manejarApi(ApiException e) {
    return respuesta(e.getStatus(), e.getMessage(), null);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, Object>> manejarValidacion(MethodArgumentNotValidException e) {
    Map<String, String> campos = new LinkedHashMap<>();
    e.getBindingResult()
        .getFieldErrors()
        .forEach(f -> campos.putIfAbsent(f.getField(), f.getDefaultMessage()));
    return respuesta(400, "Datos inválidos.", campos);
  }

  @ExceptionHandler(HttpMessageNotReadableException.class)
  public ResponseEntity<Map<String, Object>> manejarJson(HttpMessageNotReadableException e) {
    return respuesta(400, "El cuerpo de la petición no es válido.", null);
  }

  private ResponseEntity<Map<String, Object>> respuesta(
      int status, String mensaje, Map<String, String> campos) {
    Map<String, Object> cuerpo = new LinkedHashMap<>();
    cuerpo.put("timestamp", Instant.now().toString());
    cuerpo.put("status", status);
    cuerpo.put("error", HttpStatus.valueOf(status).getReasonPhrase());
    cuerpo.put("message", mensaje);
    if (campos != null) cuerpo.put("campos", campos);
    return ResponseEntity.status(status).body(cuerpo);
  }
}
