package com.playroute.catalogo.exception;
import com.playroute.common.exception.ApiErrors;
import org.springframework.web.bind.annotation.RestControllerAdvice;
@RestControllerAdvice
public class GlobalExceptionHandler extends ApiErrors {}
