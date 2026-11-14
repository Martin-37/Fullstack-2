package com.playroute.Usuarios.DTO;

import java.util.*;
import jakarta.validation.*;
import jakarta.validation.constraints.*;
public record LoginRequest(@NotBlank String usuario,@NotBlank String contraseña){

}