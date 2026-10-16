
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginAdmin() {
    const navegar = useNavigate();

    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");

    function iniciarSesion(e) {
        e.preventDefault();
        setError("");

        const usuarioLimpio = usuario.trim();

        // Validar campos vacíos
        if (!usuarioLimpio || !contrasena) {
            setError("Debes completar todos los campos.");
            return;
        }

        // Validar longitud del usuario
        if (usuarioLimpio.length < 4) {
            setError("El usuario debe tener al menos 4 caracteres.");
            return;
        }

        // Validar longitud de la contraseña
        if (contrasena.length < 5) {
            setError("La contraseña debe tener al menos 5 caracteres.");
            return;
        }

        // Validar credenciales de demostración
        const usuarioValido = "admin";
        const contrasenaValida = "12345";

        if (
            usuarioLimpio === usuarioValido &&
            contrasena === contrasenaValida
        ) {
            sessionStorage.setItem("sesionAdmin", "true");
            navegar("/administrador");
        } else {
            setError("Usuario o contraseña incorrectos.");
        }
    }

    return (
        <main className="login-main">
            <section className="login-card">
                <h1>Administrador</h1>

                <p>
                    Inicia sesión para administrar
                    el catálogo de PlayRoute.
                </p>

                {error && (
                    <p className="error-login" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={iniciarSesion}>
                    <div className="campo-login">
                        <label htmlFor="usuarioAdmin">
                            Usuario
                        </label>

                        <input
                            id="usuarioAdmin"
                            type="text"
                            value={usuario}
                            onChange={(e) =>
                                setUsuario(e.target.value)
                            }
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="campo-login">
                        <label htmlFor="contrasenaAdmin">
                            Contraseña
                        </label>

                        <input
                            id="contrasenaAdmin"
                            type="password"
                            value={contrasena}
                            onChange={(e) =>
                                setContrasena(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <button type="submit">
                        Iniciar sesión
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginAdmin;