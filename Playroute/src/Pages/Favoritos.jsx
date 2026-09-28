import { juegos } from "../Data/Juegos";
import TarjetaJuego from "../Components/TarjetaJuego";

function Favoritos() {

    const favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    const juegosFavoritos = juegos.filter((juego) =>
        favoritos.includes(juego.id)
    );

    return (
        <main>

            <h1 className = "titulo-favoritos">Mis favoritos</h1>
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
                        />
                    ))}

                </div>

            )}

        </main>
    );
}

export default Favoritos;