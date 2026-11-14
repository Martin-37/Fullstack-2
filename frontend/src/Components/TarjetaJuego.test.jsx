import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarjetaJuego from './TarjetaJuego.jsx';
import { JuegosProvider } from '../Context/JuegosContext.jsx';
import { iniciarSesionComo } from '../test/ayudas.js';

// Es el mismo juego con id 1 de Data/Juegos.js (Overwatch)
const juego = {
  id: 1,
  nombre: 'Overwatch',
  min_desc: 'FPS de accion, 5 contra 5 competitivo, con habilidades',
  categoria: 'Acción, HeroShooter',
  imagen: 'https://example.com/overwatch.jpg',
};

function renderTarjeta(props = {}) {
  return render(
    <JuegosProvider>
      <TarjetaJuego juego={juego} {...props} />
    </JuegosProvider>,
  );
}

describe('datos de la tarjeta', () => {
  it('muestra nombre, categoría, descripción e imagen', () => {
    renderTarjeta();
    expect(
      screen.getByRole('heading', { name: 'Overwatch' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Acción, HeroShooter')).toBeInTheDocument();
    expect(screen.getByText(juego.min_desc)).toBeInTheDocument();
    expect(screen.getByAltText('Overwatch')).toHaveAttribute(
      'src',
      juego.imagen,
    );
  });
});

describe('favoritos', () => {
  it('al hacer clic en el corazón guarda el id y marca la tarjeta', async () => {
    const user = userEvent.setup();
    renderTarjeta();
    const corazon = screen.getByRole('button', { name: '♥' });

    await user.click(corazon);

    expect(JSON.parse(localStorage.getItem('favoritos'))).toEqual([1]);
    expect(corazon).toHaveClass('activo');
  });

  it('al hacer clic otra vez lo quita y avisa con onQuitarFavorito', async () => {
    const user = userEvent.setup();
    const onQuitarFavorito = vi.fn();
    renderTarjeta({ onQuitarFavorito });
    const corazon = screen.getByRole('button', { name: '♥' });

    await user.click(corazon);
    await user.click(corazon);

    expect(JSON.parse(localStorage.getItem('favoritos'))).toEqual([]);
    expect(corazon).not.toHaveClass('activo');
    expect(onQuitarFavorito).toHaveBeenCalledWith(1);
  });
});

describe('botones según el tipo de usuario', () => {
  it('invitado: no ve Editar ni Eliminar', () => {
    renderTarjeta();
    expect(
      screen.queryByRole('button', { name: 'Editar' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Eliminar' }),
    ).not.toBeInTheDocument();
  });

  it('usuario normal: tampoco ve Editar ni Eliminar', () => {
    iniciarSesionComo('user');
    renderTarjeta();
    expect(
      screen.queryByRole('button', { name: 'Editar' }),
    ).not.toBeInTheDocument();
  });

  it('administrador: ve Editar y Eliminar', () => {
    iniciarSesionComo('admin');
    renderTarjeta();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Eliminar' }),
    ).toBeInTheDocument();
  });
});

describe('acciones del administrador', () => {
  it('Editar abre el formulario con los datos y guarda el cambio', async () => {
    iniciarSesionComo('admin');
    const user = userEvent.setup();
    renderTarjeta();

    await user.click(screen.getByRole('button', { name: 'Editar' }));
    const nombre = screen.getByLabelText('Nombre');
    expect(nombre).toHaveValue('Overwatch');
    await user.clear(nombre);
    await user.type(nombre, 'Overwatch 2');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => {
      const guardados = JSON.parse(localStorage.getItem('juegos'));
      expect(guardados.find((j) => j.id === 1).nombre).toBe('Overwatch 2');
    });
    expect(
      screen.queryByRole('heading', { name: 'Editar juego' }),
    ).not.toBeInTheDocument();
  });

  it('Eliminar borra el juego cuando se confirma', async () => {
    iniciarSesionComo('admin');
    const user = userEvent.setup();
    // Mock: simulamos que la persona presiona "Aceptar" en el confirm()
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderTarjeta();

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      const guardados = JSON.parse(localStorage.getItem('juegos'));
      expect(guardados.some((j) => j.id === 1)).toBe(false);
    });
  });

  it('Eliminar no borra nada si se cancela la confirmación', async () => {
    iniciarSesionComo('admin');
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderTarjeta();

    await user.click(screen.getByRole('button', { name: 'Eliminar' }));

    const guardados = JSON.parse(localStorage.getItem('juegos'));
    expect(guardados.some((j) => j.id === 1)).toBe(true);
  });
});