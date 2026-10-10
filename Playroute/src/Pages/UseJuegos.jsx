
import { useState, useEffect } from "react";
import { juegos } from "../Data/Juegos";

function useJuegos() {
    // Cargar los juegos guardados
    const [juegosCatalogo, setJuegosCatalogo] = useState(() => {
        const guardados = localStorage.getItem("juegosPlayRoute");

        return guardados ? JSON.parse(guardados) : juegos;
    });

    // Juegos que se muestran en la página principal
    const [juegosMostrados, setJuegosMostrados] =
        useState(juegosCatalogo);

    // Guardar los cambios del catálogo
    useEffect(() => {
        localStorage.setItem(
            "juegosPlayRoute",
            JSON.stringify(juegosCatalogo)
        );
    }, [juegosCatalogo]);

    // Sincronizar el catálogo mostrado
    useEffect(() => {
        setJuegosMostrados(juegosCatalogo);
    }, [juegosCatalogo]);

    return {
        juegosCatalogo,
        setJuegosCatalogo,
        juegosMostrados,
        setJuegosMostrados
    };
}

export default useJuegos;