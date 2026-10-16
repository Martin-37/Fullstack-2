
import { useState } from "react";

import { juegos } from "../Data/Juegos";
import TarjetaJuego from "../Components/TarjetaJuego";

function Favoritos(
    {juegos}
) {

    const favoritosGuardados = JSON.parse(
    localStorage.getItem("favoritos") || "[]"
);

const juegosFavoritos = juegos.filter((juego) =>
    favoritosGuardados.some(
        (id) => String(id) === String(juego.id)
    )
);

 

    function quitarFavorito(id) {

        setJuegosFavoritos((juegosActuales) =>
            juegosActuales.filter((juego) => juego.id !== id)
        );
    }

    return (
        <main>

            <h1 className="titulo-favoritos">
                Mis favoritos
            </h1>

            <div className="encabezado-juegos">

                <h1 className="titulo-juegos mb-0">
                    Juegos
                </h1>

                <span className="badge text-bg-primary">
                    {juegosFavoritos.length} juegos
                </span>

            </div>

            {juegosFavoritos.length === 0 ? (

                <div className="text-center py-5">

                    <i
                        className="bi bi-heart"
                        style={{ fontSize: "2.5rem" }}
                    ></i>

                    <p className="mt-3">
                        Todavía no agregaste juegos a favoritos.
                    </p>

                    <a
                        href="/"
                        className="btn btn-outline-primary btn-sm"
                    >
                        Explorar juegos
                    </a>

                </div>

            ) : (

                <div className="contenedor-juegos">

                    {juegosFavoritos.map((juego) => (

                        <TarjetaJuego
                            key={juego.id}
                            juego={juego}
                            onQuitarFavorito={quitarFavorito}
                        />

                    ))}

                </div>

            )}

        </main>
    );
}

export default Favoritos;

