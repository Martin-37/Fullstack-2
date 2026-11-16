import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../Utlis/api";
import { useJuegos } from "../Context/JuegosContext";
import TarjetaJuego from "../Components/TarjetaJuego";
import "./Perfil.css";

/** Consulta solo la cuenta autenticada, nunca los datos de otro usuario por ID. */
export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [error, setError] = useState("");
  const { juegos, favoritosIds, recargarFavoritos } = useJuegos();

  const consultarPerfil = useCallback(async () => {
    setCargandoPerfil(true);
    setError("");
    try {
      const datos = await api("/auth/me", { auth: true });
      setPerfil(datos);
    } catch (e) {
      setPerfil(null);
      setError(e.message || "No se pudo consultar tu perfil.");
    } finally {
      setCargandoPerfil(false);
    }
  }, []);

  useEffect(() => {
    consultarPerfil();
    recargarFavoritos();
  }, [consultarPerfil, recargarFavoritos]);

  const favoritos = useMemo(() => juegos.filter((juego) => favoritosIds.includes(juego.id)), [juegos, favoritosIds]);
  const esAdmin = perfil?.rol === "ADMIN";

  return (
    <main className="perfil-page">
      <div className="perfil-heading">
        <div>
          <span className="perfil-eyebrow"><i className="bi bi-person-circle me-2" />ÁREA PERSONAL · PLAYROUTE</span>
          <h1>Mi perfil</h1>
          <p>Consulta tu información y tus videojuegos favoritos.</p>
        </div>
        <Link to="/" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-arrow-left me-2" />Volver a PlayRoute
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline-danger btn-sm ms-3" onClick={consultarPerfil}>Reintentar</button>
        </div>
      )}

      <div className="perfil-layout">
        <aside className="perfil-sidebar" aria-label="Secciones de mi perfil">
          <div className="perfil-sidebar-title">MI CUENTA</div>
          <a href="#datos" className="perfil-menu-item"><i className="bi bi-person-vcard" /> Mis datos</a>
          <a href="#favoritos-perfil" className="perfil-menu-item"><i className="bi bi-heart" /> Mis favoritos</a>
          <a href="#cuenta" className="perfil-menu-item"><i className="bi bi-gear" /> Mi cuenta</a>
          {esAdmin && (
            <Link to="/admin" className="perfil-menu-item"><i className="bi bi-speedometer2" /> Panel administrador</Link>
          )}
        </aside>

        <div className="perfil-content">
          <section className="perfil-card perfil-identity" id="datos" aria-labelledby="titulo-datos">
            <div className="perfil-avatar" aria-hidden="true"><i className="bi bi-person-fill" /></div>
            <div className="perfil-identity-info">
              <span className="perfil-eyebrow">CUENTA REGISTRADA</span>
              <h2 id="titulo-datos">{cargandoPerfil ? "Cargando perfil…" : perfil?.nombre || "Mi cuenta"}</h2>
              <span className="perfil-role">{esAdmin ? "Administrador" : "Miembro"}</span>
            </div>
          </section>

          <div className="perfil-stats">
            <div className="perfil-stat">
              <div className="perfil-stat-icon"><i className="bi bi-heart-fill" /></div>
              <strong>{favoritosIds.length}</strong>
              <span>Juegos favoritos</span>
            </div>
            <div className="perfil-stat">
              <div className="perfil-stat-icon"><i className="bi bi-person-check-fill" /></div>
              <strong>{esAdmin ? "ADMIN" : "MIEMBRO"}</strong>
              <span>Tipo de cuenta</span>
            </div>
          </div>

          <section className="perfil-card" aria-labelledby="titulo-informacion">
            <div className="perfil-card-heading">
              <h2 id="titulo-informacion">Información personal</h2>
              <span className="perfil-lectura">Solo lectura</span>
            </div>
            {cargandoPerfil ? <p role="status">Cargando datos de tu cuenta…</p> : perfil ? (
              <dl className="perfil-datos">
                <div><dt>Nombre</dt><dd>{perfil.nombre}</dd></div>
                <div><dt>Correo electrónico</dt><dd>{perfil.correo}</dd></div>
                <div><dt>Rol</dt><dd>{esAdmin ? "Administrador" : "Miembro"}</dd></div>
              </dl>
            ) : <p className="perfil-muted">No pudimos cargar los datos. Comprueba tu sesión e inténtalo nuevamente.</p>}
          </section>

          <section className="perfil-card" id="favoritos-perfil" aria-labelledby="titulo-favoritos-perfil">
            <div className="perfil-card-heading">
              <div>
                <h2 id="titulo-favoritos-perfil">Mis videojuegos favoritos</h2>
                <p className="perfil-muted">Tus juegos guardados en PlayRoute.</p>
              </div>
              <span className="badge text-bg-primary">{favoritosIds.length} juegos</span>
            </div>
            {favoritos.length === 0 ? (
              <div className="perfil-vacio">
                <i className="bi bi-heart" aria-hidden="true" />
                <p>Todavía no tienes videojuegos favoritos.</p>
                <Link to="/" className="btn btn-outline-primary btn-sm">Explorar juegos</Link>
              </div>
            ) : (
              <>
                <p className="perfil-muted mb-3">Puedes quitar un videojuego de favoritos presionando el corazón de su tarjeta.</p>
                <div className="perfil-juegos">
                  {favoritos.map((juego) => <TarjetaJuego key={juego.id} juego={juego} />)}
                </div>
              </>
            )}
          </section>

          <section className="perfil-card" id="cuenta" aria-labelledby="titulo-cuenta">
            <h2 id="titulo-cuenta">Mi cuenta</h2>
            <p className="perfil-muted mb-3">Tus datos se consultan de forma segura desde el microservicio de Usuarios.</p>
            <div className="perfil-acciones">
              <Link to="/favoritos" className="btn btn-outline-primary btn-sm"><i className="bi bi-heart me-2" />Ver mis favoritos</Link>
              {esAdmin && <Link to="/admin" className="btn btn-outline-primary btn-sm"><i className="bi bi-speedometer2 me-2" />Panel administrador</Link>}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
