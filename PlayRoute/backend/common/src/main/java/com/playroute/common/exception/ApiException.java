package com.playroute.common.exception;

/** Error de negocio con el código HTTP que se debe devolver. */
public class ApiException extends RuntimeException {
  private final int status;

  public ApiException(int status, String message) {
    super(message);
    this.status = status;
  }

  public int getStatus() {
    return status;
  }
}
