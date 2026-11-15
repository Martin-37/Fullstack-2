import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { JuegosProvider, useJuegos } from './JuegosContext.jsx';
import { iniciarSesionComo } from '../test/ayudas.js';
import { instalarApiMock } from '../test/apiMock.js';
const wrapper = ({ children }) => <JuegosProvider>{children}</JuegosProvider>;
const nuevoJuego = { nombre: 'Hades', min_desc: 'Roguelike', categoria: 'Acción', imagen: 'https://example.com/hades.jpg' };
let mock;
beforeEach(() => { mock = instalarApiMock(); });
describe('API de catálogo desde el contexto', () => {
  it('obtiene los juegos del servidor', async () => {
    const { result } = renderHook(() => useJuegos(), { wrapper });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    expect(result.current.juegos).toHaveLength(15);
    expect(mock.fetchMock).toHaveBeenCalledWith('/api/juegos', expect.any(Object));
  });
  it('crea y actualiza juegos mediante la API', async () => {
    iniciarSesionComo('admin');
    const { result } = renderHook(() => useJuegos(), { wrapper });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    await act(async () => { await result.current.agregarJuego(nuevoJuego); });
    expect(result.current.juegos).toHaveLength(16);
    await act(async () => { await result.current.editarJuego(1, {...nuevoJuego, nombre:'Overwatch 2'}); });
    expect(result.current.juegos.find(j => j.id === 1).nombre).toBe('Overwatch 2');
    await act(async () => { await result.current.eliminarJuego(1); });
    expect(result.current.juegos).toHaveLength(15);
  });
  it('guarda favoritos por API para el usuario activo', async () => {
    iniciarSesionComo('user');
    const { result } = renderHook(() => useJuegos(), { wrapper });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    await act(async () => { await result.current.cambiarFavorito(1); });
    expect(result.current.favoritosIds).toContain(1);
    expect(mock.getFavoritos()).toContain(1);
  });
});
