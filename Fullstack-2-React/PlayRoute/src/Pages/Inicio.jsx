import { useState } from "react";
import TarjetaJuego from "../Components/TarjetaJuego";
import FormularioJuego from "../Components/FormularioJuego";
import { useJuegos } from "../Context/JuegosContext";
import { puede } from "../Utlis/sesion";

function Inicio({ juegosMostrados }) {

    const { agregarJuego } = useJuegos();
    const [agregando, setAgregando] = useState(false);

    return (

        <main>

            <section className="hero py-5">

                <div className="container text-center">

                    <h1 className="display-4 fw-bold">
                        VIDEOJUEGOS
                    <p className="lead">
                        Todo lo que necesitas para llevar tu
                        experiencia gamer al siguiente nivel.
                    </p>
                    </h1>

                </div>

            </section>

            <div className="container">

                <div className="row justify-content-center">

                    <div
                        className="col-lg-8 text-center bienvenida"
                        style={{ marginTop: "50px" }}
                    >

                        <h2>
                            Bienvenido a PlayRoute
                        </h2>

                        <p>
                            Somos una página dedicada a la guía en videojuegos
                            para que tu experiencia no sea tan desagradable
                            al iniciar un juego nuevo.
                        </p>

                    </div>

                </div>

                {/* Título y cantidad */}

                <div className="encabezado-juegos">

                    <h1 id="juegos" className="titulo-juegos mb-0">
                        Juegos
                    </h1>

                    <div className="d-flex align-items-center gap-2">

                        <span className="badge text-bg-primary">
                            {juegosMostrados.length} juegos
                        </span>

                        {/* Solo el administrador */}
                        {puede("crear") && (
                            <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => setAgregando(true)}
                            >
                                Agregar juego
                            </button>
                        )}

                    </div>

                </div>

                {/* Juegos */}

                <div className="contenedor-juegos">

                    {juegosMostrados.map((juego) => (

                        <TarjetaJuego
                            key={juego.id}
                            juego={juego}
                        />

                    ))}

                </div>

            </div>

            {agregando && (
                <FormularioJuego
                    onGuardar={agregarJuego}
                    onCerrar={() => setAgregando(false)}
                />
            )}

        </main>
    );
}

export default Inicio;
