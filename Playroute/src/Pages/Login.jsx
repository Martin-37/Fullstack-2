import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarUsuario } from "../Utlis/sesion";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ correo: "", contrasena: "" });
    const [verClave, setVerClave] = useState(false);
    const [error, setError] = useState("");
    const [validado, setValidado] = useState(false);

    const cambiar = (e) => setForm({ ...form, [e.target.id]: e.target.value });

    function iniciarSesion(e) {
        e.preventDefault();
        setError("");
        setValidado(true);
        if (!e.currentTarget.checkValidity()) return;

        const usuario = buscarUsuario(form.correo, form.contrasena);
        if (!usuario) return setError("Correo o contraseña incorrectos.");

        localStorage.setItem("sesionActiva", "true");
        localStorage.setItem("usuario", usuario.correo);
        localStorage.setItem("rol", usuario.rol);
        navigate("/");
    }

    function invitado() {
        ["usuario", "rol"].forEach((k) => localStorage.removeItem(k));
        localStorage.setItem("sesionActiva", "false");
        navigate("/");
    }

    return (
        <main className="login-main">
            <div className="login-card">
                <img
                    src="/login.jpg"
                    alt="Iniciar sesión"
                    className="d-block mx-auto mb-3"
                    width="90"
                />
                <div className="text-center mb-4">
                    <h1 className="h3 mb-1">Iniciar sesión</h1>
                    <p className="text-muted mb-0 small">
                        Es opcional: puedes seguir viendo el catálogo sin una cuenta.
                    </p>
                </div>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <form noValidate onSubmit={iniciarSesion} className={validado ? "was-validated" : ""}>
                    <div className="mb-3">
                        <label htmlFor="correo" className="form-label">Correo electrónico</label>
                        <input
                            id="correo"
                            type="email"
                            className="form-control"
                            placeholder="nombre@correo.com"
                            pattern="[^\s@]+@[a-zA-Z0-9]+\.[a-zA-Z]+"
                            value={form.correo}
                            onChange={cambiar}
                            required
                        />
                        <div className="invalid-feedback">Ingresa un correo válido.</div>
                    </div>

                    <div className="mb-2">
                        <label htmlFor="contrasena" className="form-label">Contraseña</label>
                        <div className="input-group">
                            <input
                                id="contrasena"
                                type={verClave ? "text" : "password"}
                                className="form-control"
                                placeholder="Tu contraseña"
                                minLength={6}
                                value={form.contrasena}
                                onChange={cambiar}
                                required
                            />
                            <button
                                type="button"
                                className="input-group-text toggle-password"
                                onClick={() => setVerClave(!verClave)}
                            >
                                <i className={`bi bi-eye${verClave ? "-slash" : ""}`}></i>
                            </button>
                            <div className="invalid-feedback">
                                La contraseña debe tener al menos 6 caracteres.
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3 small">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="recordarme" />
                            <label className="form-check-label" htmlFor="recordarme">Recordarme</label>
                        </div>
                        <a href="#" className="link-secondary">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Iniciar sesión</button>
                </form>

                <div className="login-divider">o</div>

                <button type="button" className="btn btn-invitado w-100 mb-3" onClick={invitado}>
                    Continuar como invitado
                </button>

                <p className="text-center mb-0 small">
                    ¿No tienes cuenta? <a href="/registro">Regístrate</a>
                </p>
            </div>
        </main>
    );
}

export default Login;
