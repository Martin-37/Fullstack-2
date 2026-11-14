import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from './Login.jsx';

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<h1>Página de inicio</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function escribir(user, correo, clave) {
  await user.type(screen.getByLabelText('Correo electrónico'), correo);
  await user.type(screen.getByLabelText('Contraseña'), clave);
  await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
}

describe('Login', () => {
  it('el administrador entra, queda guardado su rol y va al inicio', async () => {
    const user = userEvent.setup();
    renderLogin();

    await escribir(user, 'admin@playroute.com', 'admin123');

    expect(
      await screen.findByRole('heading', { name: 'Página de inicio' }),
    ).toBeInTheDocument();
    expect(localStorage.getItem('sesionActiva')).toBe('true');
    expect(localStorage.getItem('rol')).toBe('admin');
  });

  it('el usuario normal entra con rol user', async () => {
    const user = userEvent.setup();
    renderLogin();

    await escribir(user, 'user@playroute.com', 'user123');

    await screen.findByRole('heading', { name: 'Página de inicio' });
    expect(localStorage.getItem('rol')).toBe('user');
  });

  it('muestra un error si las credenciales no existen', async () => {
    const user = userEvent.setup();
    renderLogin();

    await escribir(user, 'user@playroute.com', 'clave-mala');

    expect(
      await screen.findByText('Correo o contraseña incorrectos.'),
    ).toBeInTheDocument();
    expect(localStorage.getItem('sesionActiva')).toBeNull();
  });

  it('no inicia sesión si el correo tiene un formato inválido', async () => {
    const user = userEvent.setup();
    renderLogin();

    await escribir(user, 'correo-malo', '123456');

    expect(localStorage.getItem('sesionActiva')).toBeNull();
    expect(
      screen.getByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument();
  });

  it('"Continuar como invitado" deja la sesión inactiva y va al inicio', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(
      screen.getByRole('button', { name: 'Continuar como invitado' }),
    );

    expect(localStorage.getItem('sesionActiva')).toBe('false');
    expect(
      await screen.findByRole('heading', { name: 'Página de inicio' }),
    ).toBeInTheDocument();
  });

  it('el botón del ojo muestra y oculta la contraseña', async () => {
    const user = userEvent.setup();
    const { container } = renderLogin();
    const campo = screen.getByLabelText('Contraseña');
    expect(campo).toHaveAttribute('type', 'password');

    await user.click(container.querySelector('.toggle-password'));

    expect(campo).toHaveAttribute('type', 'text');
  });
});