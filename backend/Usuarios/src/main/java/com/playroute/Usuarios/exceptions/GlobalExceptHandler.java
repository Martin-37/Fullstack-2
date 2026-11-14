package com.playroute.Usuarios.exceptions;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.playroute.common.Exception.ApiErrors;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @ControllerAdvice aplica los @ExceptionHandler heredados a todos los controladores.
 */
@ControllerAdvice
@ResponseBody
public class GlobalExceptHandler extends ApiErrors {}
