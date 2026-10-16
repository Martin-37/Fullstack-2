// Deja la sesión guardada como lo hace Login.jsx.
// rol: 'invitado' | 'user' | 'admin'
export function iniciarSesionComo(rol) {
  if (rol === 'invitado') {
    localStorage.setItem('sesionActiva', 'false');
    localStorage.removeItem('rol');
    return;
  }
  localStorage.setItem('sesionActiva', 'true');
  localStorage.setItem('rol', rol);
}