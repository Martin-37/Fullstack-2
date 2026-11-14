import { vi } from 'vitest';
import { juegos as originales } from '../Data/Juegos.js';

export function instalarApiMock() {
  let juegos = structuredClone(originales);
  let favoritos = [];
  const responder = (dato, status = 200) => ({
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => null },
    json: async () => dato,
    text: async () => status === 204 ? '' : JSON.stringify(dato),
  });
  const fetchMock = vi.fn(async (url, opciones = {}) => {
    const ruta = new URL(url, 'http://localhost').pathname;
    const metodo = opciones.method || 'GET';
    const body = opciones.body ? JSON.parse(opciones.body) : {};
    if (ruta === '/api/juegos' && metodo === 'GET') return responder(juegos);
    if (ruta === '/api/juegos' && metodo === 'POST') {
      const nuevo = { ...body, id: Math.max(...juegos.map(j => j.id), 0) + 1 };
      juegos.push(nuevo); return responder(nuevo, 201);
    }
    if (ruta.startsWith('/api/juegos/')) {
      const id = Number(ruta.split('/').at(-1));
      if (metodo === 'PUT') {
        const juego = { ...body, id };
        juegos = juegos.map(j => j.id === id ? juego : j);
        return responder(juego);
      }
      if (metodo === 'DELETE') {
        juegos = juegos.filter(j => j.id !== id);
        return responder(null, 204);
      }
      return responder(juegos.find(j => j.id === id));
    }
    if (ruta === '/api/favoritos' && metodo === 'GET') return responder(favoritos);
    if (ruta.startsWith('/api/favoritos/')) {
      const id = Number(ruta.split('/').at(-1));
      if (metodo === 'POST' && !favoritos.includes(id)) favoritos.push(id);
      if (metodo === 'DELETE') favoritos = favoritos.filter(n => n !== id);
      return responder(null, metodo === 'DELETE' ? 204 : 201);
    }
    if (ruta === '/api/auth/login') {
      if (body.correo === 'admin@playroute.com' && body.contrasena === 'Admin1234!') {
        return responder({ accessToken: 'token-prueba', usuario: { id: 1, correo: body.correo, rol: 'ADMIN' }});
      }
      if (body.correo === 'user@playroute.com' && body.contrasena === 'Cliente1234!') {
        return responder({ accessToken: 'token-prueba', usuario: { id: 2, correo: body.correo, rol: 'MIEMBRO' }});
      }
      return responder({ message: 'Correo o contraseña incorrectos.' }, 401);
    }
    if (ruta === '/api/auth/registro') return responder({id: 3, ...body, contrasena: undefined}, 201);
    if (ruta === '/api/auth/logout') return responder(null, 204);
    if (ruta === '/api/auth/refresh') return responder({ accessToken: 'token-prueba' });
    return responder({message: `Ruta no simulada: ${ruta}`}, 404);
  });
  vi.stubGlobal('fetch', fetchMock);
  return { fetchMock, getJuegos: () => juegos, getFavoritos: () => favoritos };
}
