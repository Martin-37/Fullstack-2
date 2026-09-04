const juegos = [
  {
    id: 1,
    nombre: "Overwatch",
    min_desc: "FPS de accion, 5 contra 5 competitivo, con habilidades",
    categoria: "Hero Shooter",
    imagen:"https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt00ca273d30fdb1d2/6504d00baf49497e25926e72/Damage_Heroes_Mobile.png",
  },
  {
    id: 2,
    nombre: "Valorant",
    min_desc: "FPS tactico, 5 contra 5 competitivo, con habilidades",
    categoria: "HeroShooter",
    imagen:"https://pbs.twimg.com/profile_images/2089698780060778496/OrEsKDXH_400x400.jpg",
  },
  {
    id: 3,
    nombre: "Minecraft",
    min_desc: "Juego de construccion y supervivencia, de estilo sandbox",
    categoria: "Sandbox",
    imagen:"https://www.minecraft.net/content/dam/minecraftnet/games/minecraft/key-art/Homepage_Discover-our-games_MC-Vanilla-KeyArt_864x864.jpg",
  },
  {
    id: 4,
    nombre: "League of Legends",
    min_desc:
      "juego de estrategia en tiempo real, 5 contra 5 competitivo, Con el objetivo de destruir el nexo del rival",
    categoria: "MOBA",
    imagen:"https://store-images.s-microsoft.com/image/apps.18996.14127010465288187.f9de4a96-0ee4-4da3-bf66-d4132b38c599.caf661a7-e0b3-492d-b91b-63627e47283e",
  },
  {
    id: 5,
    nombre: "The Binding of Isaac",
    min_desc:"Juego de aventura en el que el objetivo es matar a la mama del protagonista",
    categoria: "Roguelike",
    imagen:"https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/The_Binding_of_Issac_Rebirth_cover.jpg/250px-The_Binding_of_Issac_Rebirth_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: 6,
    nombre: "Cuphead",
    min_desc:"Juego de plataformas y disparos, con un estilo de animacion de los años 30",
    categoria: "Platformer, Run and Gun",
    imagen:"https://image.api.playstation.com/vulcan/img/cfn/11307fllh6D-IvbpCa18N0vRggVeRYWA06paTNCj3DENJMScAzW2f3ry4IwFcXBAt9kWXdZGpGoOGjxJ_e9MdordMVAosNhZ.png?w=440",
  },
  {
    id: 7,
    nombre: "Celeste",
    min_desc:"Juego de plataformas y aventura, catalogado como un juego dificil",
    categoria: "Platformer",
    imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDYG94D9jf8hDJI4Zijpm8SR8F74izvyKGpuFttMCzwA&s=10",
  },
  {
    id: 8,
    nombre: "Rocket league",
    min_desc:"Juego de futbol con vehiculos, con un estilo de animacion de los años 30",
    categoria: "Sports, Racing",
    imagen:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRafL_N4pJESnTrlNyT62hWEUouhqvOJvM960A3-_DfIZmM74VnNm_JDIc&s=10",
  },
  {
    id: 9,
    nombre: "Hollow Knight",
    min_desc:"Juego de plataformas del estilo metroidvania, y uno de los pocos soulslike plataformas",
    categoria: "metroidvania, Soulslike",
    imagen:"https://upload.wikimedia.org/wikipedia/en/thumb/d/de/Hollow_Knight_2026_cover_art.jpg/250px-Hollow_Knight_2026_cover_art.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: 10,
    nombre: "Hollow Knight: Silksong",
    min_desc:"Juego de plataformas del estilo metroidvania, secuela de Holllow knight pero esta vez como persona jugable Hornet",
    categoria: "metroidvania, Soulslike",
    imagen:"https://cdng.europosters.eu/pod_public/1300/284896.jpg",
  },
];

const contenedor = document.querySelector("#contenedorJuegos");
const cantidad = document.querySelector("#cantidadJuegos");
const botonVerFavoritos = document.querySelector("#verFavoritos");

// Guarda los ids de favoritos en localStorage (persisten aunque se recargue la pagina)
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// Controla que lista se esta mostrando en este momento: todos los juegos o solo favoritos
let mostrandoFavoritos = false;
let listaActual = juegos;

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

function renderProductos(lista) {
  listaActual = lista;
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12 text-center text-muted py-5">
        <i class="bi bi-heart" style="font-size: 2rem;"></i>
        <p class="mt-2">Todavia no agregaste juegos a favoritos.</p>
      </div>`;
    cantidad.textContent = `0 juegos`;
    return;
  }

  lista.forEach((juego) => {
    contenedor.innerHTML += `
   <div class="col-sm-6 col-lg-4"> 
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
  });
  cantidad.textContent = `${lista.length} juegos`;
}

function actualizarVista() {
  if (mostrandoFavoritos) {
    renderProductos(obtenerJuegosFavoritos());
  } else {
    renderProductos(juegos);
  }
}

renderProductos(juegos);

// Click sobre el corazon: agrega/saca de favoritos
contenedor.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-favorito");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  toggleFavorito(id);
  actualizarVista();
});

// Click en "Ver favoritos": alterna entre ver todos los juegos y ver solo el carrito de favoritos
botonVerFavoritos.addEventListener("click", () => {
  mostrandoFavoritos = !mostrandoFavoritos;
  botonVerFavoritos.textContent = mostrandoFavoritos
    ? "Ver todos los juegos"
    : "Ver favoritos";
  actualizarVista();
});