import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { juegos as juegosIniciales } from "../Data/Juegos";
import { api } from "../Utlis/api";
import { obtenerRol } from "../Utlis/sesion";

const JuegosContext = createContext(null);

export function JuegosProvider({ children }) {
  // Se mantiene el catálogo original a la vista mientras llega la consulta inicial.
  const [juegos, setJuegos] = useState(juegosIniciales);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const recargarJuegos = useCallback(async () => {
    try {
      const datos = await api("/juegos");
      setJuegos(datos);
      setError("");
    } catch (e) {
      setError(`No se pudo consultar el catálogo: ${e.message}`);
    } finally {
      setCargando(false);
    }
  }, []);

  const recargarFavoritos = useCallback(async () => {
    if (obtenerRol() === "invitado") {
      setFavoritosIds([]);
      return;
    }
    try {
      const ids = await api("/favoritos", { auth: true });
      setFavoritosIds(ids);
    } catch (e) {
      setFavoritosIds([]);
      setError(`No se pudo consultar tus favoritos: ${e.message}`);
    }
  }, []);

  useEffect(() => { recargarJuegos(); }, [recargarJuegos]);
  useEffect(() => {
    recargarFavoritos();
    window.addEventListener("playroute-sesion", recargarFavoritos);
    return () => window.removeEventListener("playroute-sesion", recargarFavoritos);
  }, [recargarFavoritos]);

  const agregarJuego = async (datos) => {
    const creado = await api("/juegos", { method: "POST", body: datos, auth: true });
    setJuegos((prev) => [...prev, creado]);
    return creado;
  };
  const editarJuego = async (id, datos) => {
    const editado = await api(`/juegos/${id}`, { method: "PUT", body: datos, auth: true });
    setJuegos((prev) => prev.map((j) => j.id === id ? editado : j));
    return editado;
  };
  const eliminarJuego = async (id) => {
    await api(`/juegos/${id}`, { method: "DELETE", auth: true });
    setJuegos((prev) => prev.filter((j) => j.id !== id));
    setFavoritosIds((prev) => prev.filter((j) => j !== id));
  };
  const cambiarFavorito = async (id) => {
    if (obtenerRol() === "invitado") throw new Error("Inicia sesión para guardar favoritos.");
    const yaExiste = favoritosIds.includes(id);
    await api(`/favoritos/${id}`, { method: yaExiste ? "DELETE" : "POST", auth: true });
    setFavoritosIds((prev) => yaExiste ? prev.filter((n) => n !== id) : [...prev, id]);
  };

  return (
    <JuegosContext.Provider value={{
      juegos, favoritosIds, agregarJuego, editarJuego, eliminarJuego,
      cambiarFavorito, recargarJuegos, recargarFavoritos, cargando, error
    }}>
      {children}
    </JuegosContext.Provider>
  );
}
export const useJuegos = () => useContext(JuegosContext);
