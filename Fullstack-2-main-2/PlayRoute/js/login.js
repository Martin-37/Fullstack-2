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
    // login.js

// Capturamos el formulario y el mensaje
const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", function(event) {
  event.preventDefault(); // Evita que se recargue la página

  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value.trim();

  // Validación: campos vacíos
  if (usuario === "" || clave === "") {
    mensaje.textContent = "Por favor completa todos los campos.";
    mensaje.style.color = "red";
    return;
  }

  // Validación: longitud mínima de la contraseña
  if (clave.length < 4) {
    mensaje.textContent = "La contraseña debe tener al menos 4 caracteres.";
    mensaje.style.color = "red";
    return;
  }

  // Validación: usuario y clave correctos (ejemplo simple)
  if (usuario === "admin" && clave === "1234") {
    mensaje.textContent = "Inicio de sesión exitoso 🎉";
    mensaje.style.color = "green";
    // Redirigir a otra página
    window.location.href = "index.html"; // Cambia esto a la página deseada
  } else {
    mensaje.textContent = "Usuario o contraseña incorrectos.";
    mensaje.style.color = "red";
  }
});

}

initLogin();