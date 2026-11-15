import { useState } from "react";
import { createPortal } from "react-dom";

// juego = undefined -> crear | juego = objeto -> editar
function FormularioJuego({ juego, onGuardar, onCerrar }) {
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: juego?.nombre ?? "",
    min_desc: juego?.min_desc ?? "",
    categoria: juego?.categoria ?? "",
    imagen: juego?.imagen ?? "",
  });

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await onGuardar({
        nombre: form.nombre.trim(),
        min_desc: form.min_desc.trim(),
        categoria: form.categoria.trim(),
        imagen: form.imagen.trim(),
      });
      onCerrar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return createPortal(
    <>
      <div className="modal-backdrop show"></div>
      <div className="modal d-block" tabIndex="-1" onClick={onCerrar}>
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <form className="modal-content" onSubmit={enviar}>
            <div className="modal-header">
              <h2 className="modal-title h5">
                {juego ? "Editar juego" : "Agregar juego"}
              </h2>
              <button type="button" className="btn-close" onClick={onCerrar}></button>
            </div>

            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input id="nombre" name="nombre" className="form-control"
                  value={form.nombre} onChange={cambiar} required />
              </div>
              <div className="mb-3">
                <label htmlFor="min_desc" className="form-label">Descripción</label>
                <textarea id="min_desc" name="min_desc" rows="3" className="form-control"
                  value={form.min_desc} onChange={cambiar} required />
              </div>
              <div className="mb-3">
                <label htmlFor="categoria" className="form-label">Categorías</label>
                <input id="categoria" name="categoria" className="form-control"
                  placeholder="Ej: Acción, Aventura" value={form.categoria}
                  onChange={cambiar} required />
                <div className="form-text">
                  Para que salga en el menú usa: Acción, Aventura, Estrategia, Terror u Otros.
                </div>
              </div>
              <div>
                <label htmlFor="imagen" className="form-label">URL de la imagen</label>
                <input id="imagen" name="imagen" className="form-control"
                  value={form.imagen} onChange={cambiar} required />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className="btn btn-primary">{guardando ? "Guardando..." : "Guardar"}</button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
}

export default FormularioJuego;
