
import { useEffect, useState } from "react";
import { juegos } from "../Data/Juegos";

function Editor() {
  const [listaJuegos, setListaJuegos] = useState(() => {
    const guardados = localStorage.getItem("juegosPlayRoute");

    return guardados ? JSON.parse(guardados) : juegos;
  });

  const [juegoEditando, setJuegoEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    min_desc: "",
    categoria: "",
    imagen: ""
  });

  // Guardar los cambios en el navegador
  useEffect(() => {
    localStorage.setItem(
      "juegosPlayRoute",
      JSON.stringify(listaJuegos)
    );
  }, [listaJuegos]);

  // Actualizar el estado de los inputs
  function cambiarCampo(e) {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  // Crear o editar un juego
  function guardarJuego(e) {
    e.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.min_desc.trim() ||
      !formulario.categoria.trim() ||
      !formulario.imagen.trim()
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (juegoEditando !== null) {
      // Editar juego existente
      setListaJuegos(
        listaJuegos.map((juego) =>
          juego.id === juegoEditando
            ? { ...formulario, id: juego.id }
            : juego
        )
      );
    } else {
      // Crear un identificador nuevo
      const nuevoId =
        listaJuegos.length > 0
          ? Math.max(...listaJuegos.map((j) => j.id)) + 1
          : 1;

      setListaJuegos([
        ...listaJuegos,
        {
          ...formulario,
          id: nuevoId
        }
      ]);
    }

    limpiarFormulario();
  }

  // Cargar datos para editar
  function editarJuego(juego) {
    setJuegoEditando(juego.id);

    setFormulario({
      nombre: juego.nombre,
      min_desc: juego.min_desc,
      categoria: juego.categoria,
      imagen: juego.imagen
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Eliminar juego
  function eliminarJuego(id) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este juego?"
    );

    if (!confirmar) return;

    setListaJuegos(
      listaJuegos.filter((juego) => juego.id !== id)
    );

    if (juegoEditando === id) {
      limpiarFormulario();
    }
  }

  function limpiarFormulario() {
    setFormulario({
      nombre: "",
      min_desc: "",
      categoria: "",
      imagen: ""
    });

    setJuegoEditando(null);
  }

  // Cargar los juegos guardados o utilizar el catálogo inicial
    const [juegosCatalogo, setJuegosCatalogo] = useState(() => {
        const guardados = localStorage.getItem("juegosPlayRoute");

        return guardados ? JSON.parse(guardados) : juegos;
    });

    // Juegos que se muestran en la página principal
    const [juegosMostrados, setJuegosMostrados] =
        useState(juegosCatalogo);

    // Guardar los cambios del catálogo
    useEffect(() => {
        localStorage.setItem(
            "juegosPlayRoute",
            JSON.stringify(juegosCatalogo)
        );
    }, [juegosCatalogo]);

    // Sincronizar el catálogo mostrado cuando se modifica
    useEffect(() => {
        setJuegosMostrados(juegosCatalogo);
    }, [juegosCatalogo]);

  return (
    <main className="administrador">
      <h1>Administrar juegos</h1>

      <form
        className="form-administrador"
        onSubmit={guardarJuego}
      >
        <h2>
          {juegoEditando !== null
            ? "Editar juego"
            : "Agregar juego"}
        </h2>

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          value={formulario.nombre}
          onChange={cambiarCampo}
          placeholder="Ej. Terraria"
          required
        />

        <label htmlFor="min_desc">Descripción</label>
        <textarea
          id="min_desc"
          name="min_desc"
          value={formulario.min_desc}
          onChange={cambiarCampo}
          placeholder="Descripción del juego"
          required
        />

        <label htmlFor="categoria">
          Categorías
        </label>
        <input
          id="categoria"
          name="categoria"
          value={formulario.categoria}
          onChange={cambiarCampo}
          placeholder="Aventura, Sandbox"
          required
        />

        <label htmlFor="imagen">
          URL de la imagen
        </label>
        <input
          id="imagen"
          name="imagen"
          type="url"
          value={formulario.imagen}
          onChange={cambiarCampo}
          placeholder="https://..."
          required
        />

        {formulario.imagen && (
          <img
            src={formulario.imagen}
            alt="Vista previa"
            className="vista-previa-juego"
          />
        )}

        <button type="submit">
          {juegoEditando !== null
            ? "Guardar cambios"
            : "Agregar juego"}
        </button>

        {juegoEditando !== null && (
          <button
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar edición
          </button>
        )}
      </form>

      <h2>Catálogo ({listaJuegos.length})</h2>

      <div className="lista-administrador">
        {listaJuegos.map((juego) => (
          <article
            className="juego-administrable"
            key={juego.id}
          >
            <img
              src={juego.imagen}
              alt={juego.nombre}
            />

            <div className="datos-juego">
              <h3>{juego.nombre}</h3>
              <p>{juego.min_desc}</p>
              <p>{juego.categoria}</p>
            </div>

            <div className="acciones-juego">
              <button
                type="button"
                onClick={() => editarJuego(juego)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => eliminarJuego(juego.id)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Editor;