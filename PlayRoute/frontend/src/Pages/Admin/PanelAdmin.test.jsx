import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App.jsx';
import { JuegosProvider } from '../../Context/JuegosContext.jsx';
import { iniciarSesionComo } from '../../test/ayudas.js';
import { instalarApiMock } from '../../test/apiMock.js';

let mock;
beforeEach(() => { mock = instalarApiMock(); });
const abrirAdmin = () => render(<MemoryRouter initialEntries={['/admin']}><JuegosProvider><App /></JuegosProvider></MemoryRouter>);

describe('Panel de administración de PlayRoute', () => {
  it('el usuario normal no puede entrar al panel', () => {
    iniciarSesionComo('user');
    abrirAdmin();
    expect(screen.queryByRole('heading', { name: 'Panel de administración' })).not.toBeInTheDocument();
  });
  it('un usuario ADMIN ve el panel y el catálogo', async () => {
    iniciarSesionComo('admin');
    abrirAdmin();
    expect(await screen.findByRole('heading', { name: 'Panel de administración' })).toBeInTheDocument();
    expect(screen.getByText('Resumen general')).toBeInTheDocument();
    expect(screen.queryByText('Categorías disponibles')).not.toBeInTheDocument();
    expect(screen.queryByText('Microservicios del proyecto')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ver todos/ })).toBeInTheDocument();
  });
  it('el administrador puede crear videojuegos desde su panel', async () => {
    iniciarSesionComo('admin');
    abrirAdmin();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /Agregar videojuego/ }));
    await user.type(screen.getByLabelText('Nombre'), 'Hades');
    await user.type(screen.getByLabelText('Descripción'), 'Roguelike de acción');
    await user.type(screen.getByLabelText('Categorías'), 'Acción');
    await user.type(screen.getByLabelText('URL de la imagen'), 'https://example.com/hades.jpg');
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(await screen.findByText(/Se agregó «Hades»/)).toBeInTheDocument();
    expect(mock.getJuegos()).toHaveLength(16);
  });
});
