import { useState } from "react";

import { useJuegos } from "../Context/JuegosContext";
import TarjetaJuego from "../Components/TarjetaJuego";

function Favoritos() {

    const { juegos } = useJuegos();

    // Guardamos solo los ids; la lista se calcula con los juegos actuales
    const [ids, setIds] = useState(
        () => JSON.parse(localStorage.getItem("favoritos")) || []
    );

    const juegosFavoritos = juegos.filter((juego) => ids.includes(juego.id));

    function quitarFavorito(id) {
        setIds((actuales) => actuales.filter((i) => i !== id));
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
