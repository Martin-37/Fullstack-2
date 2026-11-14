import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TarjetaJuego from './TarjetaJuego.jsx';
import { JuegosProvider } from '../Context/JuegosContext.jsx';
import { iniciarSesionComo } from '../test/ayudas.js';
import { instalarApiMock } from '../test/apiMock.js';
const juego = { id:1, nombre:'Overwatch', min_desc:'Juego de disparos', categoria:'Acción', imagen:'https://example.com/img.jpg' };
let mock;
beforeEach(() => { mock = instalarApiMock(); });
function renderTarjeta() { return render(<JuegosProvider><TarjetaJuego juego={juego}/></JuegosProvider>); }
describe('tarjetas del catálogo', () => {
  it('muestra descripción y categoría', () => {
    renderTarjeta();
    expect(screen.getByRole('heading',{name:'Overwatch'})).toBeInTheDocument();
    expect(screen.getByText('Acción')).toBeInTheDocument();
  });
  it('invita a iniciar sesión cuando se hace clic en favoritos sin cuenta', async () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => {});
    renderTarjeta();
    await userEvent.setup().click(screen.getByRole('button',{name:'Agregar a favoritos'}));
    expect(alerta).toHaveBeenCalled();
  });
  it('guarda un favorito en el microservicio', async () => {
    iniciarSesionComo('user'); renderTarjeta();
    await userEvent.setup().click(screen.getByRole('button',{name:'Agregar a favoritos'}));
    await waitFor(() => expect(mock.getFavoritos()).toContain(1));
  });
  it('no muestra controles CRUD en tarjetas, ni siquiera al ADMIN', () => {
    iniciarSesionComo('admin'); renderTarjeta();
    expect(screen.queryByRole('button',{name:'Editar'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'Eliminar'})).not.toBeInTheDocument();
  });
});
