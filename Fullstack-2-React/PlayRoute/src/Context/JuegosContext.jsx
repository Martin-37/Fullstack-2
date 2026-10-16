import { createContext, useContext, useEffect, useState } from "react";
import { juegos as juegosIniciales } from "../Data/Juegos";

const JuegosContext = createContext(null);

export function JuegosProvider({ children }) {
  const [juegos, setJuegos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("juegos")) || juegosIniciales;
    } catch {
      return juegosIniciales;
    }
  });

  // Guarda los cambios para que no se pierdan al recargar
  useEffect(() => {
    localStorage.setItem("juegos", JSON.stringify(juegos));
  }, [juegos]);

  const agregarJuego = (datos) =>
    setJuegos((prev) => [...prev, { ...datos, id: Date.now() }]);

  const editarJuego = (id, datos) =>
    setJuegos((prev) => prev.map((j) => (j.id === id ? { ...j, ...datos } : j)));

  const eliminarJuego = (id) =>
    setJuegos((prev) => prev.filter((j) => j.id !== id));

  return (
    <JuegosContext.Provider
      value={{ juegos, agregarJuego, editarJuego, eliminarJuego }}
    >
      {children}
    </JuegosContext.Provider>
  );
}

export const useJuegos = () => useContext(JuegosContext);
