import { Navigate } from "react-router-dom";
import { obtenerRol } from "../Utlis/sesion";

/** La sesión permite entrar a la vista. El backend comprueba el JWT de los datos. */
export default function RutaPrivada({ children }) {
  if (obtenerRol() === "invitado") return <Navigate to="/login" replace />;
  return children;
}
