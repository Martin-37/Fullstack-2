// Usuarios de prueba (solo para desarrollo, no es seguridad real)
export const USUARIOS = [
  { correo: "admin@playroute.com", contrasena: "admin123", rol: "admin" },
  { correo: "user@playroute.com", contrasena: "user123", rol: "user" },
];

// Qué puede hacer cada tipo de usuario
const PERMISOS = {
  invitado: ["ver"],
  user: ["ver"],
  admin: ["ver", "crear", "editar", "eliminar"],
};

// Busca en los usuarios de prueba y también en la cuenta creada en Registro
export function buscarUsuario(correo, contrasena) {
  const c = correo.trim().toLowerCase();
  const p = contrasena.trim();

  const fijo = USUARIOS.find((u) => u.correo === c && u.contrasena === p);
  if (fijo) return fijo;

  const registrado = JSON.parse(localStorage.getItem("usuarioRegistrado"));
  if (
    registrado &&
    registrado.correo.toLowerCase() === c &&
    registrado.contrasena === p
  ) {
    return { correo: registrado.correo, rol: "user" };
  }
  return null;
}

export function obtenerRol() {
  if (localStorage.getItem("sesionActiva") !== "true") return "invitado";
  return localStorage.getItem("rol") || "user";
}

export const puede = (accion) => PERMISOS[obtenerRol()].includes(accion);

export function cerrarSesion() {
  ["sesionActiva", "usuario", "rol"].forEach((k) => localStorage.removeItem(k));
}
