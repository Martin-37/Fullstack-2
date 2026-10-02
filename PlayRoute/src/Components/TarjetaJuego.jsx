import { useState } from "react";

function TarjetaJuego({ juego }) {

    const [favorito, setFavorito] = useState(() => {

        const favoritos =
            JSON.parse(localStorage.getItem("favoritos")) || [];

        return favoritos.includes(juego.id);
    });

    function cambiarFavorito() {

        let favoritos =
            JSON.parse(localStorage.getItem("favoritos")) || [];

        if (favoritos.includes(juego.id)) {

            favoritos = favoritos.filter(
                (id) => id !== juego.id
            );

            setFavorito(false);

        } else {

            favoritos.push(juego.id);

            setFavorito(true);
        }

        localStorage.setItem(
            "favoritos",
            JSON.stringify(favoritos)
        );
    }

    return (
        <div className="tarjeta-juego">

            <article className="card h-100 shadow-sm">

                <div className="contenedor-imagen">

                    <img
                        src={juego.imagen}
                        className="card-img-top imagen-juego"
                        alt={juego.nombre}
                    />

                    <button
                        className={`btn-favorito ${
                            favorito ? "activo" : ""
                        }`}
                        onClick={cambiarFavorito}
                        type="button"
                    >
                        ♥
                    </button>

                </div>

                <div className="card-body d-flex flex-column">

                    <span className="badge text-bg-light align-self-start mb-2">
                        {juego.categoria}
                    </span>

                    <h2 className="h5">
                        {juego.nombre}
                    </h2>

                    <p className="card-text">
                        {juego.min_desc}
                    </p>

                </div>

            </article>

        </div>
    );
}

export default TarjetaJuego;