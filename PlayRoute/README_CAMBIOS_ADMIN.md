# Cambios de interfaz PlayRoute – Panel administrativo

- En la página principal se quitaron los botones **Editar**, **Eliminar** y **Agregar juego**, incluso al iniciar sesión como `ADMIN`. El catálogo público sigue mostrando tarjetas y favoritos.
- En `/admin` permanecen el CRUD y las secciones **Resumen**, **Videojuegos** y **Categorías**.
- En **Resumen** se eliminaron los indicadores **Categorías disponibles** y **Microservicios del proyecto**; se mantiene únicamente **Videojuegos**.
- La tipografía del panel `/admin` se aumentó ligeramente para mejorar la lectura sin alterar la paleta ni la distribución general.
- No se modificaron archivos de backend, API ni la configuración de Docker.

## Instalar solo archivos cambiados

Copia los archivos del ZIP de cambios dentro de tu carpeta `PlayRoute` (respetando las rutas) y permite sobrescribir.

## Ejecutar

```powershell
cd frontend
npm run dev
```

Ingresa como administrador; en la página principal ya no aparecen controles CRUD en las tarjetas, pero sí dentro de **Panel admin**.
