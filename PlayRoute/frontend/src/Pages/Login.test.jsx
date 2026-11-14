import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { instalarApiMock } from '../test/apiMock.js';
import Login from './Login.jsx';
beforeEach(() => instalarApiMock());
function renderLogin() { return render(<MemoryRouter initialEntries={['/login']}><Routes>
<Route path='/login' element={<Login />} />
<Route path='/' element={<h1>Página de inicio</h1>} />
</Routes></MemoryRouter>); }
async function escribir(correo, clave) {
  const u = userEvent.setup();
  await u.type(screen.getByLabelText('Correo electrónico'), correo);
  await u.type(screen.getByLabelText('Contraseña'), clave);
  await u.click(screen.getByRole('button',{name:'Iniciar sesión'}));
}
describe('inicio de sesión', () => {
  it('el administrador obtiene rol ADMIN del backend', async () => {
    renderLogin(); await escribir('admin@playroute.com','Admin1234!');
    await screen.findByRole('heading',{name:'Página de inicio'});
    expect(localStorage.getItem('rol')).toBe('admin');
  });
  it('las contraseñas no se validan en localStorage', async () => {
    renderLogin(); await escribir('user@playroute.com','clave-mala');
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument();
    expect(localStorage.getItem('sesionActiva')).toBeNull();
  });
  it('entrar como invitado no requiere API', async () => {
    renderLogin();
    await userEvent.setup().click(screen.getByRole('button',{name:'Continuar como invitado'}));
    await screen.findByRole('heading',{name:'Página de inicio'});
    expect(localStorage.getItem('sesionActiva')).toBeNull();
  });
});
