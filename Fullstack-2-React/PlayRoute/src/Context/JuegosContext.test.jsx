import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { JuegosProvider, useJuegos } from './JuegosContext.jsx';

const wrapper = ({ children }) => <JuegosProvider>{children}</JuegosProvider>;
const nuevoJuego = {
  nombre: 'Hades',
  min_desc: 'Roguelike de acción',
  categoria: 'Acción',
  imagen: 'https://example.com/hades.jpg',
};

describe('CRUD de juegos (contexto)', () => {
  it('carga los 15 juegos iniciales si no hay datos guardados', () => {
    const { result } = renderHook(() => useJuegos(), { wrapper });
    expect(result.current.juegos).toHaveLength(15);
  });

  it('agrega un juego con id generado y lo guarda en localStorage', () => {
    // Mock: fijamos Date.now() para conocer el id que se generará
    vi.spyOn(Date, 'now').mockReturnValue(999);
    const { result } = renderHook(() => useJuegos(), { wrapper });

    act(() => result.current.agregarJuego(nuevoJuego));

    expect(result.current.juegos).toHaveLength(16);
    expect(result.current.juegos.at(-1)).toMatchObject({
      id: 999,
      nombre: 'Hades',
    });
    expect(JSON.parse(localStorage.getItem('juegos'))).toHaveLength(16);
  });

  it('edita solo el juego indicado', () => {
    const { result } = renderHook(() => useJuegos(), { wrapper });

    act(() => result.current.editarJuego(1, { nombre: 'Overwatch 2' }));

    expect(result.current.juegos.find((j) => j.id === 1).nombre).toBe(
      'Overwatch 2',
    );
    expect(result.current.juegos.find((j) => j.id === 2).nombre).toBe(
      'Valorant',
    );
  });

  it('elimina un juego por id', () => {
    const { result } = renderHook(() => useJuegos(), { wrapper });

    act(() => result.current.eliminarJuego(1));

    expect(result.current.juegos).toHaveLength(14);
    expect(result.current.juegos.some((j) => j.id === 1)).toBe(false);
  });

  it('recupera los juegos guardados en una visita anterior', () => {
    localStorage.setItem(
      'juegos',
      JSON.stringify([{ id: 7, ...nuevoJuego }]),
    );
    const { result } = renderHook(() => useJuegos(), { wrapper });
    expect(result.current.juegos).toEqual([{ id: 7, ...nuevoJuego }]);
  });

  it('vuelve a los juegos iniciales si el JSON guardado está corrupto', () => {
    localStorage.setItem('juegos', '{roto');
    const { result } = renderHook(() => useJuegos(), { wrapper });
    expect(result.current.juegos).toHaveLength(15);
  });
});