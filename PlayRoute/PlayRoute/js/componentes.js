function cargarNavbar(){
    if(!navbar) return;
    navbar.innerHTML = `<nav class="navbar navbar-expand body-tertiary"data-bs-theme="dark">
            <div class="container-fluid">
                <a class="navbar-brand titulo " href="#"> PlayRoute <img src="https://i.redd.it/t64efwcviqo51.png" width="30" height="30"> </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link  " aria-current="page" href="index.html"> Inicio </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link " href="index.html#juegos"> Juegos </a>
                        </li>
                        <li class="nav-item dropdown ">
                            <a class="nav-link dropdown-toggle texto" href="#" role="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Categorias
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item " href="Accion.html" onclick="filtrarCategoria('Acción')">Acción</a></li>
                                <li><a class="dropdown-item " href="Aventura.html" onclick="filtrarCategoria('Aventura')">Aventura</a></li>
                                <li><a class = "dropdown-item " href="Estrategia.html" onclick="filtrarCategoria('Estrategia')">Estrategia</a></li>
                                <li><a class = "dropdown-item" href="Terror.html" onclick="filtrarCategoria('Terror')">Terror</a></li>

                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="Otros.html" onclick="filtrarCategoria('Otros')">Otros</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link " href="contacto.html">Contacto</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link " href="favorito.html">Favoritos</a>
                        </li>
                    </ul>
                    <form id="formBuscar" class="d-flex" role="search">
                    <input 
                            id="buscador"
                            class="form-control me-2" 
                            type="search" 
                            placeholder="Buscar..." 
                            aria-label="Search"
                            />
                        <button class="btn btn-outline-success" type="submit">Buscar</button>
                    </form>
                    <a href="login.html" class="btn btn-outline-light ms-lg-3 mt-2 mt-lg-0 d-flex align-items-center gap-1 texto-boton-login">
                        <i class="bi bi-person-circle"></i> Iniciar sesión
                    </a>
                </div>
            </div>
        </nav>`
        marcarPaginaActual();

    function marcarPaginaActual() {
        const paginaActual = window.location.pathname.split("/").pop() || "index.html";

        const enlaces = document.querySelectorAll("#navbar .nav-link");

        enlaces.forEach(enlace => {
            const paginaEnlace = enlace.getAttribute("href");

            if (paginaEnlace === paginaActual) {
            enlace.classList.add("active");
            enlace.setAttribute("aria-current", "page");
            }
        });
    }
}

function cargarFooter(){
    const footer = document.querySelector("#footer");
    if (!footer) return;

    footer.innerHTML = `<footer class="bg-dark text-white py-4">
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <h5>PlayRoute</h5>
                        <p>
                             accesorios y Lista de videojuegos
                            para todos los gamers.
                        </p>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <h5>Contacto</h5>
                        <p class="mb-0">
                            contacto@PlayRouter.cl
                        </p>
                        <p>
                            Viña del Mar, Chile
                        </p>
                    </div>
                </div>
                <hr>
                <p class="text-center mb-0">
                    &copy; 2026 PlayRoute. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    `;
    
}
function activarJuegosAlBajar() {
    const seccionJuegos = document.querySelector("#juegos");
    const enlaceJuegos = document.querySelector('#navbar a[href="index.html#juegos"]');
    const enlaceInicio = document.querySelector('#navbar a[href="index.html"]');

    if (!seccionJuegos || !enlaceJuegos || !enlaceInicio) return;

    window.addEventListener("scroll", () => {
        const posicion = seccionJuegos.getBoundingClientRect();

        if (posicion.top <= 200) {
            // Activar Juegos
            enlaceJuegos.classList.add("active");
            enlaceJuegos.setAttribute("aria-current", "page");

            // Desactivar Inicio
            enlaceInicio.classList.remove("active");
            enlaceInicio.removeAttribute("aria-current");
        } else {
            // Activar Inicio
            enlaceInicio.classList.add("active");
            enlaceInicio.setAttribute("aria-current", "page");

            // Desactivar Juegos
            enlaceJuegos.classList.remove("active");
            enlaceJuegos.removeAttribute("aria-current");
        }
    });
}
cargarNavbar()
cargarFooter()
activarJuegosAlBajar()