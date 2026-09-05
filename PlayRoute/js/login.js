function initLogin() {
    const formLogin = document.querySelector("#formLogin");
    const mensajeLogin = document.querySelector("#mensajeLogin");
    const togglePassword = document.querySelector("#togglePassword");
    const inputContrasena = document.querySelector("#contrasena");

    if (!formLogin) return;

    togglePassword.addEventListener("click", () => {
        const esPassword = inputContrasena.type === "password";
        inputContrasena.type = esPassword ? "text" : "password";
        togglePassword.innerHTML = esPassword
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';
    });

    formLogin.addEventListener("submit", (evento) => {
        evento.preventDefault();
        mensajeLogin.classList.add("d-none");

        if (!formLogin.checkValidity()) {
            formLogin.classList.add("was-validated");
            return;
        }

        // Punto de conexión con el backend de autenticación cuando esté disponible.
        mensajeLogin.classList.remove("d-none", "alert-danger");
        mensajeLogin.classList.add("alert-success");
        mensajeLogin.textContent = "Inicio de sesión simulado correctamente. Conecta este formulario a tu API cuando esté lista.";
    });
}

initLogin();