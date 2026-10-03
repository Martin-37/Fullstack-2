function Login() {
    return (
        <main className="login-main">

            <div className="login-card">

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

                <div
                    id="mensajeLogin"
                    className="alert alert-danger py-2 d-none"
                    role="alert"
                >
                </div>

                <form id="formLogin" noValidate>

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
                                type="password"
                                className="form-control"
                                id="contrasena"
                                placeholder="Tu contraseña"
                                minLength="6"
                                required
                            />

                            <span
                                className="input-group-text toggle-password"
                                id="togglePassword"
                            >
                                <i className="bi bi-eye"></i>
                            </span>

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

                <a
                    href="/"
                    className="btn btn-invitado w-100 mb-3"
                >
                    Continuar como invitado
                </a>

                <p
                    className="text-center mb-0"
                    style={{ fontSize: "0.9rem" }}
                >
                    ¿No tienes cuenta? <a href="#">Regístrate</a>
                </p>

            </div>

        </main>
    );
}

export default Login;


