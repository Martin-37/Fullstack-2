import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { obtenerRol, cerrarSesion } from "../Utlis/sesion";

function Navbar({ juegos, setJuegosMostrados }) {
    const navigate = useNavigate();
    useLocation(); // hace que el navbar se actualice al cambiar de página (login / logout)
    const rol = obtenerRol();

    const [seccionActiva, setSeccionActiva] = useState("inicio");
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [sugerencias, setSugerencias] = useState([]);

    useEffect(() => {
        function activarJuegosAlBajar() {
            const seccionJuegos = document.querySelector("#juegos");

            if (!seccionJuegos) return;

            const posicion = seccionJuegos.getBoundingClientRect();

            if (posicion.top <= 200) {
                setSeccionActiva("juegos");
            } else {
                setSeccionActiva("inicio");
            }
        }

        window.addEventListener("scroll", activarJuegosAlBajar);

        return () => {
            window.removeEventListener("scroll", activarJuegosAlBajar);
        };
    }, []);

    function cambiarBusqueda(evento) {

        const texto = evento.target.value;

        setTextoBusqueda(texto);

        if (texto.trim() === "") {
            setSugerencias([]);
            return;
        }

        const resultados = juegos.filter((juego) =>
            juego.nombre
                .toLowerCase()
                .includes(texto.toLowerCase())
        );

        setSugerencias(resultados);
    }

    function seleccionarSugerencia(juego) {

        setTextoBusqueda(juego.nombre);

        setSugerencias([]);
    }

    function filtrarCategoria(categoria) {
        const resultados = juegos.filter((juego) =>
            juego.categoria
                .toLowerCase()
                .includes(categoria.toLowerCase())
        );

        setJuegosMostrados(resultados);
    }

    function buscarJuegos(evento) {

        evento.preventDefault();

        const resultados = juegos.filter((juego) =>
            juego.nombre
                .toLowerCase()
                .includes(textoBusqueda.toLowerCase().trim())
        );

        setJuegosMostrados(resultados);
        setSugerencias([]);

        navigate("/");

        setTimeout(() => {
            document.querySelector("#juegos")?.scrollIntoView({
                behavior: "smooth"
            });
        }, 100);
    }

    function mostrarTodos() {
        setJuegosMostrados(juegos);
    }

    function salir() {
        cerrarSesion();
        navigate("/login");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-playroute">
            <div className="container-fluid">

                {/* Logo / nombre */}
                <a className="navbar-brand" href="#">
                    PlayRoute <img src="https://i.redd.it/t64efwcviqo51.png" width="30" height="30" />
                </a>

                {/* Botón para móvil */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Abrir navegación"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    {/* Enlaces */}
                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                                onClick={() => setJuegosMostrados(juegos)}
                            >
                                Inicio
                            </Link>
                        </li>

                        <li className="nav-item">
                            <a
                                className="nav-link"
                                href="/"
                                onClick={(evento) => {
                                    evento.preventDefault();

                                    navigate("/");

                                    setTimeout(() => {
                                        document.querySelector("#juegos")?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                    }, 100);
                                }}
                            >
                                Juegos
                            </a>
                        </li>

                        {/* Categorías */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categorías
                            </a>

                            <ul className="dropdown-menu">

                                <li>
                                    <Link className="dropdown-item" to="/categoria/acción">
                                        Acción
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/categoria/aventura">
                                        Aventura
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/categoria/estrategia">
                                        Estrategia
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/categoria/terror">
                                        Terror
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" to="/categoria/otros">
                                        Otros
                                    </Link>
                                </li>

                            </ul>

                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/favoritos">
                                Favoritos
                            </a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="/contacto">
                                Contacto
                            </a>
                        </li>

                    </ul>

                    {/* Buscador */}
                    <form
                        className="d-flex me-3 position-relative"
                        role="search"
                        onSubmit={buscarJuegos}
                    >

                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Buscar..."
                            aria-label="Buscar"
                            value={textoBusqueda}
                            onChange={cambiarBusqueda}
                        />

                        {sugerencias.length > 0 && (
                            <div
                                className="list-group position-absolute"
                                style={{
                                    top: "100%",
                                    left: 0,
                                    right: "50px",
                                    zIndex: 1000
                                }}
                            >
                                {sugerencias.map((juego) => (
                                    <button
                                        key={juego.id}
                                        type="button"
                                        className="list-group-item list-group-item-action"
                                        onClick={() => seleccionarSugerencia(juego)}
                                    >
                                        {juego.nombre}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            className="btn btn-outline-light"
                            type="submit"
                        >
                            Buscar
                        </button>

                    </form>

                    {/* Iniciar / cerrar sesión */}
                    {rol === "invitado" ? (
                        <a className="btn btn-light" href="/login">
                            Iniciar sesión
                        </a>
                    ) : (
                        <>
                            <img
                                src="/login.jpg"
                                alt="Mi perfil"
                                className="rounded-circle me-2"
                                width="38"
                                height="38"
                                style={{ objectFit: "cover", backgroundColor: "white" }}
                            />

                            {rol === "admin" && (
                                <span className="badge bg-info me-2">Administrador</span>
                            )}
                            <button className="btn btn-light" onClick={salir}>
                                Cerrar sesión
                            </button>
                        </>
                    )}

                </div>
            </div>

        </nav>
    );
}

export default Navbar;
