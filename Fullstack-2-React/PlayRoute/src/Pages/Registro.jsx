
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Registro() {

    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [confirmarContrasena, setConfirmarContrasena] = useState("");

    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("danger");

    const [validado, setValidado] = useState(false);

    function registrarUsuario(evento) {

        evento.preventDefault();

        setMensaje("");
        setValidado(true);

        const nombreLimpio = nombre.trim();
        const correoLimpio = correo.trim();
        const claveLimpia = contrasena.trim();
        const confirmacionLimpia = confirmarContrasena.trim();

        // Validar campos vacíos
        if (
            nombreLimpio === "" ||
            correoLimpio === "" ||
            claveLimpia === "" ||
            confirmacionLimpia === ""
        ) {
            setTipoMensaje("danger");
            setMensaje("Por favor completa todos los campos.");
            return;
        }

        // Validar correo
        const correoValido =
            /^[^\s@]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;

        if (!correoValido.test(correoLimpio)) {
            setTipoMensaje("danger");
            setMensaje("Ingresa un correo válido.");
            return;
        }

        // Validar contraseña
        if (claveLimpia.length < 6) {
            setTipoMensaje("danger");
            setMensaje(
                "La contraseña debe tener al menos 6 caracteres."
            );
            return;
        }

        // Confirmar contraseña
        if (claveLimpia !== confirmacionLimpia) {
            setTipoMensaje("danger");
            setMensaje("Las contraseñas no coinciden.");
            return;
        }

        // Comprobar si ya existe una cuenta
        const usuarioExistente =
            JSON.parse(localStorage.getItem("usuarioRegistrado"));

        if (
            usuarioExistente &&
            usuarioExistente.correo === correoLimpio
        ) {
            setTipoMensaje("danger");
            setMensaje(
                "Ya existe una cuenta registrada con ese correo."
            );
            return;
        }

        // Crear usuario
        const nuevoUsuario = {
            nombre: nombreLimpio,
            correo: correoLimpio,
            contrasena: claveLimpia
        };

        // Guardar usuario
        localStorage.setItem(
            "usuarioRegistrado",
            JSON.stringify(nuevoUsuario)
        );

        // Mensaje de éxito
        setTipoMensaje("success");
        setMensaje(
            "Cuenta creada correctamente 🎉"
        );

        // Ir al Login
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }

    return (
        <main className="registro-main">

            <div className="registro-card">

                <div className="text-center mb-4">

                    <h1 className="h3 mb-1">
                        Crear cuenta
                    </h1>

                    <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.9rem" }}
                    >
                        Crea una cuenta para disfrutar de todas las funciones de PlayRoute.
                    </p>

                </div>

                {/* Mensaje */}

                {mensaje && (
                    <div
                        className={`alert alert-${tipoMensaje} py-2`}
                        role="alert"
                    >
                        {mensaje}
                    </div>
                )}

                <form
                    noValidate
                    onSubmit={registrarUsuario}
                    className={validado ? "was-validated" : ""}
                >

                    {/* Nombre */}

                    <div className="mb-3">

                        <label
                            htmlFor="nombre"
                            className="form-label"
                        >
                            Nombre de usuario
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            id="nombre"
                            placeholder="Tu nombre"
                            value={nombre}
                            onChange={(evento) =>
                                setNombre(evento.target.value)
                            }
                            required
                        />

                        <div className="invalid-feedback">
                            Ingresa tu nombre de usuario.
                        </div>

                    </div>

                    {/* Correo */}

                    <div className="mb-3">

                        <label
                            htmlFor="correo"
                            className="form-label"
                        >
                            Correo electrónico
                        </label>

                        <input
                            type="email"
                            className="form-control"
                            id="correo"
                            placeholder="nombre@correo.com"
                            value={correo}
                            onChange={(evento) =>
                                setCorreo(evento.target.value)
                            }
                            required
                        />

                        <div className="invalid-feedback">
                            Ingresa un correo válido.
                        </div>

                    </div>

                    {/* Contraseña */}

                    <div className="mb-3">

                        <label
                            htmlFor="contrasena"
                            className="form-label"
                        >
                            Contraseña
                        </label>

                        <div className="input-group">

                            <input
                                type={
                                    mostrarPassword
                                        ? "text"
                                        : "password"
                                }
                                className="form-control"
                                id="contrasena"
                                placeholder="Tu contraseña"
                                minLength="6"
                                value={contrasena}
                                onChange={(evento) =>
                                    setContrasena(evento.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                className="input-group-text toggle-password"
                                onClick={() =>
                                    setMostrarPassword(!mostrarPassword)
                                }
                            >
                                <i
                                    className={
                                        mostrarPassword
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>
                            </button>

                            <div className="invalid-feedback">
                                La contraseña debe tener al menos 6 caracteres.
                            </div>

                        </div>

                    </div>

                    {/* Confirmar contraseña */}

                    <div className="mb-3">

                        <label
                            htmlFor="confirmarContrasena"
                            className="form-label"
                        >
                            Confirmar contraseña
                        </label>

                        <div className="input-group">

                            <input
                                type={
                                    mostrarConfirmacion
                                        ? "text"
                                        : "password"
                                }
                                className="form-control"
                                id="confirmarContrasena"
                                placeholder="Repite tu contraseña"
                                minLength="6"
                                value={confirmarContrasena}
                                onChange={(evento) =>
                                    setConfirmarContrasena(
                                        evento.target.value
                                    )
                                }
                                required
                            />

                            <button
                                type="button"
                                className="input-group-text toggle-password"
                                onClick={() =>
                                    setMostrarConfirmacion(
                                        !mostrarConfirmacion
                                    )
                                }
                            >
                                <i
                                    className={
                                        mostrarConfirmacion
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>
                            </button>

                            <div className="invalid-feedback">
                                Confirma tu contraseña.
                            </div>

                        </div>

                    </div>

                    {/* Crear cuenta */}

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        Crear cuenta
                    </button>

                </form>

                <div className="login-divider">
                    o
                </div>

                <p
                    className="text-center mb-0"
                    style={{ fontSize: "0.9rem" }}
                >
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login">
                        Iniciar sesión
                    </Link>
                </p>

            </div>

        </main>
    );
}

export default Registro;

