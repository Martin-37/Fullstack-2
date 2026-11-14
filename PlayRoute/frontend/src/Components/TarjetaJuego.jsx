import { useJuegos } from "../Context/JuegosContext";

function TarjetaJuego({ juego }) {
    const { favoritosIds, cambiarFavorito } = useJuegos();
    const favorito = favoritosIds.includes(juego.id);
    async function manejarFavorito() {
      try { await cambiarFavorito(juego.id); }
      catch (e) { window.alert(e.message); }
    }
    return (
        <div className="tarjeta-juego">
            <article className="card h-100 shadow-sm">
                <div className="contenedor-imagen">
                    <img src={juego.imagen} className="card-img-top imagen-juego" alt={juego.nombre} />
                    <button
                        className={`btn-favorito ${favorito ? "activo" : ""}`}
                        onClick={manejarFavorito} type="button"
                        aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >♥</button>
                </div>
                <div className="card-body d-flex flex-column">
                    <span className="badge text-bg-light align-self-start mb-2">{juego.categoria}</span>
                    <h2 className="h5">{juego.nombre}</h2>
                    <p className="card-text">{juego.min_desc}</p>
                </div>
            </article>
        </div>
    );
}
export default TarjetaJuego;
