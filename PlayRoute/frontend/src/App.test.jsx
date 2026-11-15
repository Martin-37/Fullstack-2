import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { JuegosProvider } from './Context/JuegosContext.jsx';
import { iniciarSesionComo } from './test/ayudas.js';
import { instalarApiMock } from './test/apiMock.js';
let mock;
beforeEach(() => { mock = instalarApiMock(); });
function renderApp(ruta='/') { return render(<MemoryRouter initialEntries={[ruta]}><JuegosProvider><App/></JuegosProvider></MemoryRouter>); }
describe('PlayRoute integrado', () => {
  it('muestra los videojuegos iniciales', async () => {
    renderApp();
    expect(await screen.findByText('15 juegos')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(15);
  });
  it('filtra desde el buscador', async () => {
    const user = userEvent.setup(); renderApp();
    await user.type(screen.getByRole('searchbox'), 'minecraft{enter}');
    expect(await screen.findByText('2 juegos')).toBeInTheDocument();
  });
  it('permite crear juegos mediante el endpoint de catálogo', async () => {
    iniciarSesionComo('admin'); const user = userEvent.setup(); renderApp();
    await user.click(screen.getByRole('button',{name:'Agregar juego'}));
    await user.type(screen.getByLabelText('Nombre'), 'Hades');
    await user.type(screen.getByLabelText('Descripción'), 'Roguelike de acción');
    await user.type(screen.getByLabelText('Categorías'), 'Acción');
    await user.type(screen.getByLabelText('URL de la imagen'), 'https://example.com/hades.jpg');
    await user.click(screen.getByRole('button',{name:'Guardar'}));
    expect(await screen.findByRole('heading',{name:'Hades',level:2})).toBeInTheDocument();
    expect(mock.getJuegos()).toHaveLength(16);
  });
});
