# Nuevo panel de administración de PlayRoute

Se agregó la ruta protegida `http://localhost:5173/admin` al frontend. No se modificó ningún microservicio ni la configuración Docker/MySQL.

## Cómo probarlo

1. Conserva el backend local en marcha (Usuarios 8081, Catálogo 8082, Favoritos 8083 y Gateway 8080).
2. Desde la carpeta `frontend`, ejecuta `npm run dev`.
3. Inicia sesión con una cuenta cuyo rol sea `ADMIN`.
4. Pulsa **Panel admin** en la barra de navegación. O entra directamente a `/admin`.
5. En **Resumen** verás cantidades obtenidas del catálogo y una vista rápida de videojuegos.
6. En **Videojuegos** podrás buscar, filtrar, agregar, editar y eliminar (con confirmación) usando la API existente.
7. En **Categorías** puedes consultar las categorías presentes y filtrar los juegos de cada una.

La pantalla respeta la barra azul oscuro, superficies blancas y tipografía de PlayRoute. En `/` se conserva la experiencia existente.

## Archivos incorporados o modificados

- `frontend/src/Pages/Admin/PanelAdmin.jsx` (nuevo)
- `frontend/src/Pages/Admin/PanelAdmin.css` (nuevo)
- `frontend/src/Pages/Admin/PanelAdmin.test.jsx` (nuevo)
- `frontend/src/Components/RutaAdmin.jsx` (nuevo)
- `frontend/src/App.jsx` (ruta /admin)
- `frontend/src/Components/Navbar.jsx` (enlace Panel admin)

## Seguridad y limitaciones

- `RutaAdmin.jsx` restringe la **interfaz** a la cuenta con rol `admin`.
- El backend sigue siendo quien autoriza las operaciones CRUD mediante JWT y Spring Security. Nunca se debe confiar en ocultar la ruta o los botones como control de seguridad único.
- Las categorías se derivan de los videojuegos registrados; no se creó un CRUD independiente de categorías ni nuevas APIs.
- Las tarjetas presentan datos existentes; el número de microservicios (3) es una referencia a la arquitectura del proyecto, no un monitoreo de salud.
- El frontend depende del Gateway local y de los microservicios en ejecución. No se realizaron pruebas en AWS.
