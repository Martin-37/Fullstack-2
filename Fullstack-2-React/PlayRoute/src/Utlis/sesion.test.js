import { describe, expect, it } from 'vitest';
import { buscarUsuario, obtenerRol, puede, cerrarSesion } from './sesion.js';
import { iniciarSesionComo } from '../test/ayudas.js';

describe('buscarUsuario', () => {
  it('reconoce al administrador con sus credenciales', () => {
    expect(buscarUsuario('admin@playroute.com', 'admin123')?.rol).toBe('admin');
  });

  it('ignora mayúsculas y espacios en el correo', () => {
    expect(buscarUsuario('  ADMIN@PlayRoute.com ', 'admin123')?.rol).toBe(
      'admin',
    );
  });

  it('devuelve null si la contraseña es incorrecta', () => {
    expect(buscarUsuario('admin@playroute.com', 'otra-clave')).toBeNull();
  });

  it('acepta una cuenta creada en Registro y la trata como usuario normal', () => {
    localStorage.setItem(
      'usuarioRegistrado',
      JSON.stringify({
        nombre: 'Ana',
        correo: 'ana@correo.com',
        contrasena: 'secreta123',
      }),
    );
    expect(buscarUsuario('ana@correo.com', 'secreta123')).toEqual({
      correo: 'ana@correo.com',
      rol: 'user',
    });
  });
});

describe('obtenerRol', () => {
  it('es invitado cuando no hay sesión', () => {
    expect(obtenerRol()).toBe('invitado');
  });

  it('es invitado si la sesión está inactiva, aunque quede un rol guardado', () => {
    localStorage.setItem('sesionActiva', 'false');
    localStorage.setItem('rol', 'admin');
    expect(obtenerRol()).toBe('invitado');
  });

  it('devuelve el rol guardado cuando hay sesión activa', () => {
    iniciarSesionComo('admin');
    expect(obtenerRol()).toBe('admin');
  });
});

describe('permisos por tipo de usuario', () => {
  it.each([
    ['invitado', 'ver', true],
    ['invitado', 'crear', false],
    ['user', 'ver', true],
    ['user', 'editar', false],
    ['user', 'eliminar', false],
    ['admin', 'ver', true],
    ['admin', 'crear', true],
    ['admin', 'editar', true],
    ['admin', 'eliminar', true],
  ])('%s puede %s: %s', (rol, accion, esperado) => {
    iniciarSesionComo(rol);
    expect(puede(accion)).toBe(esperado);
  });
});

describe('cerrarSesion', () => {
  it('borra la sesión y el usuario vuelve a ser invitado', () => {
    iniciarSesionComo('admin');
    localStorage.setItem('usuario', 'admin@playroute.com');
    cerrarSesion();
    expect(localStorage.getItem('sesionActiva')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
    expect(obtenerRol()).toBe('invitado');
  });
});