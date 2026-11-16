import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import { JuegosProvider } from '../Context/JuegosContext.jsx';
import { iniciarSesionComo } from '../test/ayudas.js';
import { instalarApiMock } from '../test/apiMock.js';

let mock;
beforeEach(() => { mock = instalarApiMock(); });
const abrir = () => render(<MemoryRouter initialEntries={['/perfil']}><JuegosProvider><App/></JuegosProvider></MemoryRouter>);

describe('Perfil personal de PlayRoute', () => {
  it('redirige a login cuando el visitante no tiene una sesión', async () => {
    iniciarSesionComo('invitado');
    abrir();
    expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
  });
  it('muestra datos de la cuenta autenticada y favoritos reales', async () => {
    iniciarSesionComo('user');
    mock.setFavoritos([1]);
    abrir();
    expect(await screen.findByText('Usuario de prueba')).toBeInTheDocument();
    expect(screen.getByText('user@playroute.com')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mis videojuegos favoritos' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
  it('permite retirar un juego de favoritos desde la página de perfil', async () => {
    iniciarSesionComo('user');
    mock.setFavoritos([1]);
    abrir();
    const usuario = userEvent.setup();
    await usuario.click(await screen.findByRole('button', { name: 'Quitar de favoritos' }));
    expect(await screen.findByText('Todavía no tienes videojuegos favoritos.')).toBeInTheDocument();
    expect(mock.getFavoritos()).toHaveLength(0);
  });
});
