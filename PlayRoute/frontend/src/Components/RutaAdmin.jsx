import { Navigate } from "react-router-dom";
import { obtenerRol } from "../Utlis/sesion";

/** Protección de interfaz: Spring Security sigue autorizando cada endpoint. */
export default function RutaAdmin({ children }) {
  const rol = obtenerRol();
  if (rol === "invitado") return <Navigate to="/login" replace />;
  if (rol !== "admin") return <Navigate to="/" replace />;
  return children;
}
