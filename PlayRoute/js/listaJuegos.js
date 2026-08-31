const juegos = [ 
  { 
    id: 1, 
    nombre: "Valorant", 
    min_desc: "FPS de accion, 5 contra 5 competitivo", 
    categoria: "Shooter", 
    imagen: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt00ca273d30fdb1d2/6504d00baf49497e25926e72/Damage_Heroes_Mobile.png" 
  }, 
  { 
    id: 2, 
    nombre: "Valorant", 
    min_desc: "FPS de accion, 5 contra 5 competitivo", 
    categoria: "Shooter", 
    imagen: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt00ca273d30fdb1d2/6504d00baf49497e25926e72/Damage_Heroes_Mobile.png" 
  },
  { 
    id: 3, 
    nombre: "Valorant", 
    min_desc: "FPS de accion, 5 contra 5 competitivo", 
    categoria: "Shooter", 
    imagen: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt00ca273d30fdb1d2/6504d00baf49497e25926e72/Damage_Heroes_Mobile.png" 
  },
  { 
    id: 4, 
    nombre: "Valorant", 
    min_desc: "FPS de accion, 5 contra 5 competitivo", 
    categoria: "Shooter", 
    imagen: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt00ca273d30fdb1d2/6504d00baf49497e25926e72/Damage_Heroes_Mobile.png" 
  }
];

const contenedor = document.querySelector("#contenedorJuegos"); 
const cantidad = document.querySelector("#cantidadJuegos"); 
  
function renderProductos(lista) { 
  contenedor.innerHTML = ""; 
  
  lista.forEach(juego => { 
    contenedor.innerHTML += `
    <div class="col-sm-6 col-lg-4"> 
        <article class="card h-100 shadow-sm"> 
          <img src="${juego.imagen}" 
               class="card-img-top" 
               alt="${juego.nombre}"> 
          <div class="card-body d-flex flex-column"> 
            <span class="badge text-bg-light align-self-start mb-2"> 
              ${juego.categoria} 
            </span> 
            <h2 class="h5">${juego.nombre}</h2> 
            <button class="btn btn-primary mt-auto btn-agregar" 
                    data-id="${juego.id}"> 
            </button> 
          </div> 
        </article> 
      </div>`; 
  }); 
    cantidad.textContent = `${lista.length} productos`; 
} 
  
renderProductos(juegos);