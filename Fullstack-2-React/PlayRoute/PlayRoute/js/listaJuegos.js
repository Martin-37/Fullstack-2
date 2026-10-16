const juegos = [
  {
    id: 1,
    nombre: "Overwatch",
    min_desc: "FPS de accion, 5 contra 5 competitivo, con habilidades",
    categoria: "Acción, HeroShooter",
    imagen:"https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt00ca273d30fdb1d2/6504d00baf49497e25926e72/Damage_Heroes_Mobile.png",
  },
  {
    id: 2,
    nombre: "Valorant",
    min_desc: "FPS tactico, 5 contra 5 competitivo, con habilidades",
    categoria: "Acción, HeroShooter",
    imagen:"https://pbs.twimg.com/profile_images/2089698780060778496/OrEsKDXH_400x400.jpg",
  },
  {
    id: 3,
    nombre: "Minecraft",
    min_desc: "Juego de construccion y supervivencia, de estilo sandbox",
    categoria: "Aventura, Sandbox",
    imagen:"https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Homepage_Discover-our-games_MC-Vanilla-KeyArt_864x864.jpg",
  },
  {
    id: 4,
    nombre: "League of Legends",
    min_desc:
      "juego de estrategia en tiempo real, 5 contra 5 competitivo, Con el objetivo de destruir el nexo del rival",
    categoria: "Estrategia, MOBA",
    imagen:"https://store-images.s-microsoft.com/image/apps.18996.14127010465288187.f9de4a96-0ee4-4da3-bf66-d4132b38c599.caf661a7-e0b3-492d-b91b-63627e47283e",
  },
  {
    id: 5,
    nombre: "The Binding of Isaac",
    min_desc:"Juego de aventura en el que el objetivo es matar a la mama del protagonista",
    categoria: "Terror, Roguelike",
    imagen:"https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/The_Binding_of_Issac_Rebirth_cover.jpg/250px-The_Binding_of_Issac_Rebirth_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: 6,
    nombre: "Cuphead",
    min_desc:"Juego de plataformas y disparos, con un estilo de animacion de los años 30",
    categoria: "Accion, Platformer, Run and Gun",
    imagen:"https://image.api.playstation.com/vulcan/img/cfn/11307fllh6D-IvbpCa18N0vRggVeRYWA06paTNCj3DENJMScAzW2f3ry4IwFcXBAt9kWXdZGpGoOGjxJ_e9MdordMVAosNhZ.png?w=440",
  },
  {
    id: 7,
    nombre: "Celeste",
    min_desc:"Juego de plataformas y aventura, catalogado como un juego dificil",
    categoria: "Aventura, Platformer",
    imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDYG94D9jf8hDJI4Zijpm8SR8F74izvyKGpuFttMCzwA&s=10",
  },
  {
    id: 8,
    nombre: "Rocket league",
    min_desc:"Juego de futbol con vehiculos, con un estilo de animacion de los años 30",
    categoria: "Otros , Sports, Racing",
    imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRafL_N4pJESnTrlNyT62hWEUouhqvOJvM960A3-_DfIZmM74VnNm_JDIc&s=10",
  },
  {
    id: 9,
    nombre: "Hollow Knight",
    min_desc:"Juego de plataformas del estilo metroidvania, y uno de los pocos soulslike plataformas",
    categoria: "Aventura, metroidvania, Soulslike",
    imagen:"https://upload.wikimedia.org/wikipedia/en/thumb/d/de/Hollow_Knight_2026_cover_art.jpg/250px-Hollow_Knight_2026_cover_art.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: 10,
    nombre: "Hollow Knight: Silksong",
    min_desc:"Juego de plataformas del estilo metroidvania, secuela de Holllow knight pero esta vez como persona jugable Hornet",
    categoria: "Aventura, metroidvania, Soulslike",
    imagen:"https://cdng.europosters.eu/pod_public/1300/284896.jpg",
  },
];

// Guarda los ids de favoritos en localStorage (persisten aunque se recargue la pagina)
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

function esFavorito(id) {
  return favoritos.includes(id);
}

function toggleFavorito(id) {
  if (esFavorito(id)) {
    favoritos = favoritos.filter((favId) => favId !== id); // lo saca
  } else {
    favoritos.push(id); // lo agrega
  }
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function obtenerJuegosFavoritos() {
  return juegos.filter((juego) => esFavorito(juego.id));
}

function tarjetaJuego(juego) {
  return `
   <div class="col-sm-6 col-lg-4 d-flex justify-content-center"> 
        <article class="card h-100 shadow-sm"> 
          <img src="${juego.imagen}" class="card-img-top" alt="${juego.nombre}" style="width:100%;height:auto;object-fit:cover;"> 
          <button class="btn-favorito ${esFavorito(juego.id) ? 'activo' : ''}" data-id="${juego.id}">
            <i class="bi ${esFavorito(juego.id) ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </button>
          <div class="card-body d-flex flex-column"> 
            <span class="badge text-bg-light align-self-start mb-2">${juego.categoria}</span> 
            <h2 class="h5">${juego.nombre}</h2> 
            <p class="card-text">${juego.min_desc}</p>
          </div> 
        </article> 
      </div>`;
}

/* ---------- Pagina principal (index.html) ---------- */
const contenedor = document.querySelector("#contenedorJuegos");

if (contenedor) {
  const cantidad = document.querySelector("#cantidadJuegos");

  // El index siempre muestra todos los juegos. Para ver solo los favoritos
  // ahora se usa el link "Favoritos" del navbar, que lleva a favorito.html.
  function renderProductos(lista) {
    contenedor.innerHTML = "";

    lista.forEach((juego) => {
      contenedor.innerHTML += tarjetaJuego(juego);
    });
    cantidad.textContent = `${lista.length} juegos`;
  }

  renderProductos(juegos);

  // Click sobre el corazon: agrega/saca de favoritos y refresca la tarjeta
  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".btn-favorito");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    toggleFavorito(id);
    renderProductos(juegos);
  });
}
function filtrarCategoria(categoria) {
    const juegosFiltrados = juegos.filter(juego =>
        juego.categoria.toLowerCase().includes(categoria.toLowerCase())
    );

    renderProductos(juegosFiltrados);
}
// =========================
// FILTRAR SEGUN PAGINA
// =========================
function cargarJuegosSegunPagina() {

  if (!contenedor) return;

  const paginaActual =
    window.location.pathname.split("/").pop().toLowerCase();


  if (paginaActual === "accion.html") {

    filtrarCategoria("Acción");

  } else if (paginaActual === "aventura.html") {

    filtrarCategoria("Aventura");

  } else if (paginaActual === "estrategia.html") {

    filtrarCategoria("Estrategia");

  } else if (paginaActual === "terror.html") {

    filtrarCategoria("Terror");

  } else if (paginaActual === "otros.html") {

    filtrarCategoria("Otros");

  } else {

    // index.html
    renderProductos(juegos);

  }
  if (contenedor) {

  contenedor.addEventListener("click", (evento) => {

    const boton =
      evento.target.closest(".btn-favorito");

    if (!boton) return;

    const id =
      Number(boton.dataset.id);

    toggleFavorito(id);

    // Volvemos a cargar la categoría actual
    cargarJuegosSegunPagina();

  });

}
}




// =========================
// INICIAR
// =========================

cargarJuegosSegunPagina();

/* ---------- Pagina de favoritos (favorito.html) ---------- */
const contenedorFavoritos = document.querySelector("#contenedorFavoritos");

if (contenedorFavoritos) {
  const cantidadFavoritos = document.querySelector("#cantidadFavoritos");

  function renderFavoritos() {
    const lista = obtenerJuegosFavoritos();
    contenedorFavoritos.innerHTML = "";

    if (lista.length === 0) {
      contenedorFavoritos.innerHTML = `
        <div class="col-12 text-center text-muted py-5">
          <i class="bi bi-heart" style="font-size: 2.5rem;"></i>
          <p class="mt-3">Todavia no agregaste juegos a favoritos.</p>
          <a href="index.html#juegos" class="btn btn-outline-primary btn-sm">Explorar juegos</a>
        </div>`;
      if (cantidadFavoritos) cantidadFavoritos.textContent = "0 juegos";
      return;
    }

    lista.forEach((juego) => {
      contenedorFavoritos.innerHTML += tarjetaJuego(juego);
    });
    if (cantidadFavoritos) cantidadFavoritos.textContent = `${lista.length} juegos`;
  }

  // Click sobre el corazon: saca el juego de favoritos y vuelve a dibujar la lista
  contenedorFavoritos.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".btn-favorito");
    if (!boton) return;

    const id = Number(boton.dataset.id);
    toggleFavorito(id);
    renderFavoritos();
  });

  renderFavoritos();
 
}
