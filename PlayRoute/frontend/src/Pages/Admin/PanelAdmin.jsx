import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useJuegos } from "../../Context/JuegosContext";
import FormularioJuego from "../../Components/FormularioJuego";
import "./PanelAdmin.css";

const normalizar = (valor) => String(valor ?? "").toLocaleLowerCase("es").trim();

function extraerCategorias(juegos) {
  return [...new Set(juegos.flatMap((juego) =>
    String(juego.categoria ?? "").split(",").map((c) => c.trim()).filter(Boolean)
  ))].sort((a, b) => a.localeCompare(b, "es"));
}

export default function PanelAdmin() {
  const { juegos, agregarJuego, editarJuego, eliminarJuego, cargando, recargarJuegos } = useJuegos();
  const [seccion, setSeccion] = useState("resumen");
  const [consulta, setConsulta] = useState("");
  const [categoria, setCategoria] = useState("");
  const [formulario, setFormulario] = useState(null); // null | { tipo: 'crear' } | { tipo: 'editar', juego }
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [eliminando, setEliminando] = useState(null);

  const categorias = useMemo(() => extraerCategorias(juegos), [juegos]);
  const juegosFiltrados = useMemo(() => juegos.filter((juego) => {
    const coincideTexto = normalizar(`${juego.nombre} ${juego.min_desc}`).includes(normalizar(consulta));
    const coincideCategoria = !categoria || String(juego.categoria ?? "").split(",")
      .some((c) => normalizar(c) === normalizar(categoria));
    return coincideTexto && coincideCategoria;
  }), [juegos, consulta, categoria]);
  const filas = seccion === "resumen" ? juegos.slice(0, 5) : juegosFiltrados;

  async function guardar(datos) {
    setError("");
    if (formulario?.tipo === "editar") {
      await editarJuego(formulario.juego.id, datos);
      setMensaje(`Se actualizó «${datos.nombre}» correctamente.`);
    } else {
      await agregarJuego(datos);
      setMensaje(`Se agregó «${datos.nombre}» al catálogo.`);
    }
  }

  async function eliminar(juego) {
    if (!window.confirm(`¿Eliminar «${juego.nombre}» del catálogo?`)) return;
    setError("");
    setMensaje("");
    setEliminando(juego.id);
    try {
      await eliminarJuego(juego.id);
      setMensaje(`Se eliminó «${juego.nombre}» correctamente.`);
    } catch (e) {
      setError(e.message || "No se pudo eliminar el juego.");
    } finally {
      setEliminando(null);
    }
  }

  async function actualizar() {
    setError("");
    setMensaje("");
    try {
      await recargarJuegos();
    } catch (e) {
      setError(e.message || "No se pudo actualizar el catálogo.");
    }
  }

  function abrirCategoria(nombre) {
    setCategoria(nombre);
    setSeccion("juegos");
  }

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="admin-eyebrow"><i className="bi bi-shield-lock me-2" />ÁREA PRIVADA · PLAYROUTE</span>
          <h1>Panel de administración</h1>
          <p>Administra los videojuegos sin salir de PlayRoute.</p>
        </div>
        <Link to="/" className="btn btn-outline-primary btn-sm">
          <i className="bi bi-arrow-left me-2" />Volver a la página
        </Link>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar" aria-label="Secciones de administración">
          <div className="admin-sidebar-title">ADMINISTRACIÓN</div>
          <button type="button" className={`admin-menu-item ${seccion === "resumen" ? "activo" : ""}`}
            onClick={() => setSeccion("resumen")}>
            <i className="bi bi-grid-1x2" /> Resumen
          </button>
          <button type="button" className={`admin-menu-item ${seccion === "juegos" ? "activo" : ""}`}
            onClick={() => setSeccion("juegos")}>
            <i className="bi bi-controller" /> Videojuegos
          </button>
          <button type="button" className={`admin-menu-item ${seccion === "categorias" ? "activo" : ""}`}
            onClick={() => setSeccion("categorias")}>
            <i className="bi bi-tags" /> Categorías
          </button>
          <div className="admin-sidebar-note">
            <i className="bi bi-info-circle" />
            <span>Los cambios se guardan mediante la API de Catálogo.</span>
          </div>
        </aside>

        <section className="admin-content">
          {mensaje && <div className="alert alert-success admin-alert" role="status">{mensaje}
            <button type="button" aria-label="Cerrar aviso" className="btn-close" onClick={() => setMensaje("")} />
          </div>}
          {error && <div className="alert alert-danger admin-alert" role="alert">{error}
            <button type="button" aria-label="Cerrar error" className="btn-close" onClick={() => setError("")} />
          </div>}

          {seccion === "resumen" && (
            <>
              <div className="admin-section-title">
                <div><h2>Resumen general</h2><p>Información actual del catálogo de videojuegos.</p></div>
              </div>
              <div className="admin-stat-grid">
                <div className="admin-stat"><span className="admin-stat-icon"><i className="bi bi-controller" /></span>
                  <span className="admin-stat-value">{juegos.length}</span><span className="admin-stat-label">Videojuegos</span></div>
              </div>
              <div className="admin-quick-actions">
                <div><strong>Acciones rápidas</strong><p>Gestiona los juegos y sus categorías en un solo lugar.</p></div>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormulario({ tipo: "crear" })}>
                  <i className="bi bi-plus-lg me-2" />Agregar videojuego
                </button>
              </div>
            </>
          )}

          {seccion === "categorias" && (
            <>
              <div className="admin-section-title">
                <div><h2>Categorías</h2><p>Estas categorías provienen de los videojuegos registrados.</p></div>
              </div>
              <div className="admin-category-grid">
                {categorias.map((nombre) => (
                  <button key={nombre} type="button" className="admin-category" onClick={() => abrirCategoria(nombre)}>
                    <i className="bi bi-tag" /><strong>{nombre}</strong>
                    <span>{juegos.filter(j => String(j.categoria ?? "").split(",").some(c => normalizar(c) === normalizar(nombre))).length} juegos</span>
                    <i className="bi bi-chevron-right" />
                  </button>
                ))}
                {!categorias.length && <p>No se encontraron categorías.</p>}
              </div>
              <p className="admin-help">Para crear o cambiar una categoría, edita el campo Categorías de un videojuego.</p>
            </>
          )}

          {seccion !== "categorias" && (
            <section className="admin-table-card" aria-label="Gestión de videojuegos">
              <div className="admin-table-header">
                <div>
                  <h2>{seccion === "resumen" ? "Vista rápida de videojuegos" : "Gestión de videojuegos"}</h2>
                  <p>{cargando ? "Cargando catálogo..." : `${seccion === "resumen" ? juegos.length : juegosFiltrados.length} videojuego(s) en catálogo`}</p>
                </div>
                <div className="admin-table-actions">
                  {seccion === "resumen" && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSeccion("juegos")}>Ver todos</button>}
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={actualizar}>
                    <i className="bi bi-arrow-clockwise me-1" />Actualizar
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormulario({ tipo: "crear" })}>
                    <i className="bi bi-plus-lg me-1" />Agregar juego
                  </button>
                </div>
              </div>
              {seccion === "juegos" && (
                <div className="admin-filtros">
                  <label className="visually-hidden" htmlFor="admin-buscar">Buscar videojuegos</label>
                  <input id="admin-buscar" type="search" className="form-control form-control-sm" placeholder="Buscar videojuego..."
                    value={consulta} onChange={(e) => setConsulta(e.target.value)} />
                  <label className="visually-hidden" htmlFor="admin-categoria">Filtrar categoría</label>
                  <select id="admin-categoria" className="form-select form-select-sm" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="">Todas las categorías</option>
                    {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              <div className="table-responsive">
                <table className="table admin-juegos-table align-middle mb-0">
                  <thead><tr><th scope="col">Videojuego</th><th scope="col">Categoría</th><th scope="col">Acciones</th></tr></thead>
                  <tbody>
                    {filas.map((juego) => (
                      <tr key={juego.id}>
                        <td><div className="admin-juego-info">
                          <img src={juego.imagen} alt="" loading="lazy" />
                          <div><strong>{juego.nombre}</strong><span>{juego.min_desc}</span></div>
                        </div></td>
                        <td><span className="admin-pill">{juego.categoria}</span></td>
                        <td><div className="admin-row-actions">
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setFormulario({ tipo: "editar", juego })}>
                            <i className="bi bi-pencil-square me-1" />Editar
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm" disabled={eliminando === juego.id} onClick={() => eliminar(juego)}>
                            <i className="bi bi-trash3 me-1" />Eliminar
                          </button>
                        </div></td>
                      </tr>
                    ))}
                    {filas.length === 0 && (
                      <tr><td colSpan="3" className="text-center py-4 text-muted">No hay videojuegos que coincidan con la búsqueda.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      </div>
      {formulario && (
        <FormularioJuego
          key={`${formulario.tipo}-${formulario.juego?.id ?? "nuevo"}`}
          juego={formulario.juego}
          onGuardar={guardar}
          onCerrar={() => setFormulario(null)}
        />
      )}
    </main>
  );
}
