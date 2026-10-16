import { useState } from "react";
import { useJuegos } from "../Context/JuegosContext";
import { puede } from "../Utlis/sesion";
import FormularioJuego from "./FormularioJuego";

function TarjetaJuego({ juego, onQuitarFavorito }) {
    const { editarJuego, eliminarJuego } = useJuegos();
    const [editando, setEditando] = useState(false);

    const [favorito, setFavorito] = useState(() => {
        const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
        return favoritos.includes(juego.id);
    });

    function cambiarFavorito() {
        let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

        if (favoritos.includes(juego.id)) {
            // Quitar de favoritos
            favoritos = favoritos.filter((id) => id !== juego.id);
            setFavorito(false);

            // Actualiza la lista de Favoritos.jsx
            if (onQuitarFavorito) {
                onQuitarFavorito(juego.id);
            }
        } else {
            // Agregar a favoritos
            favoritos.push(juego.id);
            setFavorito(true);
        }

        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }

    function eliminar() {
        if (window.confirm(`¿Eliminar "${juego.nombre}"?`)) {
            eliminarJuego(juego.id);
        }
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
                        className={`btn-favorito ${favorito ? "activo" : ""}`}
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

                    {/* Solo el administrador ve estos botones */}
                    {(puede("editar") || puede("eliminar")) && (
                        <div className="d-flex gap-2 mt-auto">
                            {puede("editar") && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setEditando(true)}
                                >
                                    Editar
                                </button>
                            )}
                            {puede("eliminar") && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={eliminar}
                                >
                                    Eliminar
                                </button>
                            )}
                        </div>
                    )}

                </div>

            </article>

            {editando && (
                <FormularioJuego
                    juego={juego}
                    onGuardar={(datos) => editarJuego(juego.id, datos)}
                    onCerrar={() => setEditando(false)}
                />
            )}

        </div>
    );
}

export default TarjetaJuego;
