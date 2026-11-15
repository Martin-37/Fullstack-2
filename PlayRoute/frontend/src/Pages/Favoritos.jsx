import { Link } from "react-router-dom";
import { useJuegos } from "../Context/JuegosContext";
import { obtenerRol } from "../Utlis/sesion";
import TarjetaJuego from "../Components/TarjetaJuego";

function Favoritos() {
  const { juegos, favoritosIds } = useJuegos();
  const juegosFavoritos = juegos.filter((juego) => favoritosIds.includes(juego.id));
  return (
    <main>
      <h1 className="titulo-favoritos">Mis favoritos</h1>
      <div className="encabezado-juegos">
        <h1 className="titulo-juegos mb-0">Juegos</h1>
        <span className="badge text-bg-primary">{juegosFavoritos.length} juegos</span>
      </div>
      {obtenerRol() === "invitado" ? (
        <div className="text-center py-5">
          <p>Inicia sesión para guardar tus videojuegos favoritos.</p>
          <Link className="btn btn-outline-primary btn-sm" to="/login">Iniciar sesión</Link>
        </div>
      ) : juegosFavoritos.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heart" style={{ fontSize: "2.5rem" }}></i>
          <p className="mt-3">Todavía no agregaste juegos a favoritos.</p>
          <Link to="/" className="btn btn-outline-primary btn-sm">Explorar juegos</Link>
        </div>
      ) : (
        <div className="contenedor-juegos">
          {juegosFavoritos.map((juego) => <TarjetaJuego key={juego.id} juego={juego} />)}
        </div>
      )}
    </main>
  );
}
export default Favoritos;
