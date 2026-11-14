package com.playroute.common.Exception;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class ApiErrors {
 public record ErrorBody(
      Instant timestamp, int status, String mensaje, Map<String, String> campos) {}

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<ErrorBody> domain(ApiException e) {
    return ResponseEntity.status(e.status)
        .body(new ErrorBody(Instant.now(), e.status, e.getMessage(), Map.of()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorBody> validation(MethodArgumentNotValidException e) {
    Map<String, String> fields = new LinkedHashMap<>();
    e.getBindingResult()
        .getFieldErrors()
        .forEach(f -> fields.putIfAbsent(f.getField(), f.getDefaultMessage()));
    return ResponseEntity.badRequest()
        .body(new ErrorBody(Instant.now(), 400, "Revisa los campos del formulario.", fields));
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ResponseEntity<ErrorBody> duplicate(DataIntegrityViolationException e) {
    return ResponseEntity.status(409)
        .body(
            new ErrorBody(
                Instant.now(), 409, "El registro ya existe o está siendo utilizado.", Map.of()));
  }

  @ExceptionHandler({
    org.springframework.http.converter.HttpMessageNotReadableException.class,
    org.springframework.web.method.annotation.MethodArgumentTypeMismatchException.class,
    org.springframework.web.bind.MissingRequestHeaderException.class
  })
  public ResponseEntity<ErrorBody> bad(Exception e) {
    return ResponseEntity.badRequest()
        .body(new ErrorBody(Instant.now(), 400, "Formato de solicitud inválido.", Map.of()));
  }
}
