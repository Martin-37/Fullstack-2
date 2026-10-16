import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { JuegosProvider } from './Context/JuegosContext.jsx';
import { iniciarSesionComo } from './test/ayudas.js';

// main.jsx no se monta en las pruebas, así que agregamos aquí
// el router y el proveedor de juegos que main.jsx le da a App.
function renderApp(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <JuegosProvider>
        <App />
      </JuegosProvider>
    </MemoryRouter>,
  );
}

describe('navegación y catálogo', () => {
  it('el inicio muestra los 15 juegos del catálogo', () => {
    renderApp();
    expect(screen.getByText('15 juegos')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(15);
  });

  it('el menú Categorías lleva a la página de Terror', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: 'Terror' }));

    expect(
      await screen.findByRole('heading', { name: 'Terror', level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText('2 juegos')).toBeInTheDocument();
  });

  it('el buscador filtra los juegos mostrados en el inicio', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByRole('searchbox'), 'minecraft{enter}');

    expect(await screen.findByText('2 juegos')).toBeInTheDocument();
  });
});

describe('permisos en la interfaz', () => {
  it('el invitado no ve el botón Agregar juego', () => {
    renderApp();
    expect(
      screen.queryByRole('button', { name: 'Agregar juego' }),
    ).not.toBeInTheDocument();
  });

  it('iniciar sesión como admin habilita las opciones de administrador', async () => {
    const user = userEvent.setup();
    renderApp('/login');

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'admin@playroute.com',
    );
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    expect(await screen.findByText('Administrador')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Agregar juego' }),
    ).toBeInTheDocument();
  });

  it('el admin agrega un juego y aparece en la lista', async () => {
    iniciarSesionComo('admin');
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'Agregar juego' }));
    await user.type(screen.getByLabelText('Nombre'), 'Hades');
    await user.type(screen.getByLabelText('Descripción'), 'Roguelike de acción');
    await user.type(screen.getByLabelText('Categorías'), 'Acción');
    await user.type(
      screen.getByLabelText('URL de la imagen'),
      'https://example.com/hades.jpg',
    );
    await user.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(
      await screen.findByRole('heading', { name: 'Hades', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText('16 juegos')).toBeInTheDocument();
  });

  it('el admin elimina un juego y la lista se actualiza', async () => {
    iniciarSesionComo('admin');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]);

    expect(await screen.findByText('14 juegos')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Overwatch' }),
    ).not.toBeInTheDocument();
  });
});