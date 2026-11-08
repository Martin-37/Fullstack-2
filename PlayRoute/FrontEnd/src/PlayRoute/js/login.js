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


formLogin.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que se recargue la página

  const correo = document.querySelector("#correo").value.trim();
  const clave = document.querySelector("#contrasena").value.trim();

  // Validación: campos vacíos
  if (correo === "" || clave === "") {
    mensajeLogin.textContent = "Por favor completa todos los campos.";
    mensajeLogin.style.color = "red";
    return;
  }

  // Validación: longitud mínima de la contraseña
  if (clave.length < 6) {
    mensajeLogin.textContent = "La contraseña debe tener al menos 6 caracteres.";
    mensajeLogin.style.color = "red";
    return;
  }

  // Validación: usuario y clave correctos (ejemplo simple)

    mensajeLogin.textContent = "Inicio de sesión exitoso 🎉";
    mensajeLogin.style.color = "green";
    // Redirigir a otra página
    window.location.href = "index.html"; // Cambia esto a la página deseada
  
  
});
}




initLogin();