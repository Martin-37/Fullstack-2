import { useParams } from "react-router-dom";
import { useJuegos } from "../Context/JuegosContext";
import TarjetaJuego from "../Components/TarjetaJuego";

function Categoria() {

    const { nombre } = useParams();
    const { juegos } = useJuegos();

    const juegosCategoria = juegos.filter((juego) =>
        juego.categoria
            .toLowerCase()
            .includes(nombre.toLowerCase())
    );

    const categoriaMayuscula =
        nombre.charAt(0).toUpperCase() + nombre.slice(1);

    return (
        <main>

            <h1 className="titulo-categoria">
                {categoriaMayuscula}
            </h1>

            <p>
                Explora los juegos de la categoría {categoriaMayuscula}.
            </p>

            <div className="encabezado-juegos">

                <h1 className="titulo-juegos mb-0">
                    Juegos
                </h1>

                <span className="badge text-bg-primary">
                    {juegosCategoria.length} juegos
                </span>

            </div>

            <div className="contenedor-juegos">

                {juegosCategoria.map((juego) => (
                    <TarjetaJuego
                        key={juego.id}
                        juego={juego}
                    />
                ))}

            </div>

        </main>
    );
}

export default Categoria;
