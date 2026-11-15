/** Roles de la interfaz. La autorización real se verifica en Spring Security. */
const PERMISOS = {
  invitado: ["ver"],
  user: ["ver"],
  admin: ["ver", "crear", "editar", "eliminar"],
};

export function guardarSesion({ accessToken, usuario }) {
  sessionStorage.setItem("playrouteToken", accessToken);
  localStorage.setItem("sesionActiva", "true");
  localStorage.setItem("usuario", usuario.correo);
  localStorage.setItem("usuarioId", String(usuario.id));
  localStorage.setItem("rol", usuario.rol === "ADMIN" ? "admin" : "user");
  window.dispatchEvent(new Event("playroute-sesion"));
}

export function obtenerRol() {
  if (localStorage.getItem("sesionActiva") !== "true") return "invitado";
  const rol = localStorage.getItem("rol");
  return rol === "admin" ? "admin" : "user";
}

export function puede(accion) {
  return (PERMISOS[obtenerRol()] || PERMISOS.invitado).includes(accion);
}

export function cerrarSesion() {
  ["sesionActiva", "usuario", "rol", "usuarioId"].forEach((k) => localStorage.removeItem(k));
  sessionStorage.removeItem("playrouteToken");
  window.dispatchEvent(new Event("playroute-sesion"));
}
