
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [mensaje, setMensaje] = useState("");
    const [tipoMensaje, setTipoMensaje] = useState("danger");

    const [validado, setValidado] = useState(false);

    function iniciarSesion(evento) {

        evento.preventDefault();

        setMensaje("");

        const correoLimpio = correo.trim();
        const claveLimpia = contrasena.trim();

        setValidado(true);

        // Validación de campos vacíos
        if (correoLimpio === "" || claveLimpia === "") {

            setTipoMensaje("danger");
            setMensaje("Por favor completa todos los campos.");

            return;
        }

        // Validación del correo
        const correoValido =
            /^[^\s@]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;

        if (!correoValido.test(correoLimpio)) {

            setTipoMensaje("danger");
            setMensaje("Ingresa un correo válido.");

            return;
        }

        // Validación de contraseña
        if (claveLimpia.length < 6) {

            setTipoMensaje("danger");
            setMensaje(
                "La contraseña debe tener al menos 6 caracteres."
            );

            return;
        }

        // Guardar sesión
        localStorage.setItem("sesionActiva", "true");
        localStorage.setItem("usuario", correoLimpio);

        // Mensaje de éxito
        setTipoMensaje("success");
        setMensaje("Inicio de sesión exitoso 🎉");

        // Redirigir
        setTimeout(() => {
            navigate("/");
        }, 500);
    }

    function continuarComoInvitado() {

        localStorage.setItem("sesionActiva", "false");
        localStorage.removeItem("usuario");

        navigate("/");
    }

    return (
        <main className="loginusuario-main">

            <div className="loginusuario-card">

                <div className="text-center mb-4">

                    <h1 className="h3 mb-1">
                        Iniciar sesión
                    </h1>

                    <p
                        className="text-muted mb-0"
                        style={{ fontSize: "0.9rem" }}
                    >
                        Es opcional: puedes seguir viendo el catálogo sin una cuenta.
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
                    id="formLogin"
                    noValidate
                    onSubmit={iniciarSesion}
                    className={validado ? "was-validated" : ""}
                >

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
                    <div className="mb-2">

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
                                id="togglePassword"
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

                    {/* Recordarme / contraseña */}
                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div className="form-check">

                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="recordarme"
                            />

                            <label
                                className="form-check-label"
                                htmlFor="recordarme"
                                style={{ fontSize: "0.9rem" }}
                            >
                                Recordarme
                            </label>

                        </div>

                        <a
                            href="#"
                            className="link-secondary"
                            style={{ fontSize: "0.9rem" }}
                        >
                            ¿Olvidaste tu contraseña?
                        </a>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        Iniciar sesión
                    </button>

                </form>

                <div className="login-divider">
                    o
                </div>

                <button
                    type="button"
                    className="btn btn-invitado w-100 mb-3"
                    onClick={continuarComoInvitado}
                >
                    Continuar como invitado
                </button>

                <p
                    className="text-center mb-0"
                    style={{ fontSize: "0.9rem" }}
                >
                    ¿No tienes cuenta? <a href="/registro">Regístrate</a>
                </p>

            </div>

        </main>
    );
}

export default Login;

