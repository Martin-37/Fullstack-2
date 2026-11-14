import { describe, it, expect } from 'vitest';
import { guardarSesion, obtenerRol, puede, cerrarSesion } from './sesion.js';

describe('sesión integrada con backend', () => {
  it('el invitado solo puede ver juegos', () => {
    expect(obtenerRol()).toBe('invitado');
    expect(puede('crear')).toBe(false);
    expect(puede('ver')).toBe(true);
  });
  it('conserva el rol de administrador y el token en la sesión del navegador', () => {
    guardarSesion({ accessToken: 'token', usuario: { id: 1, correo: 'admin@playroute.com', rol: 'ADMIN' } });
    expect(obtenerRol()).toBe('admin');
    expect(puede('eliminar')).toBe(true);
    expect(sessionStorage.getItem('playrouteToken')).toBe('token');
  });
  it('cierra la sesión limpiando los datos locales', () => {
    guardarSesion({ accessToken: 'token', usuario: { id: 2, correo: 'user@playroute.com', rol: 'MIEMBRO' }});
    cerrarSesion();
    expect(obtenerRol()).toBe('invitado');
    expect(sessionStorage.getItem('playrouteToken')).toBeNull();
  });
});
