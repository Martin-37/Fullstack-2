# PlayRoute — Docker Compose (React + 3 microservicios)

**Origen:** versión integrada de PlayRoute, adaptada de la arquitectura de GameTech del profesor. Docker no sustituye la demostración de Spring Boot + JWT + Swagger + React.

## Arranque rápido en Windows

1. Instala **Docker Desktop**, ábrelo y selecciona contenedores Linux (WSL 2 si corresponde).
2. Descomprime el ZIP, entra a la **carpeta PlayRoute** (la que contiene `compose.yaml`) con PowerShell.
3. Ejecuta **un solo comando**:

```powershell
powershell -ExecutionPolicy Bypass -File .\iniciar.ps1
```

El script crea `.env` **solo la primera vez** con claves aleatorias y ejecuta `docker compose up -d --build --wait`. Guarda `.env`: allí están `ADMIN_PASSWORD` y `MIEMBRO_PASSWORD` (para `admin@playroute.com` y `user@playroute.com`). **Nunca subas `.env` a GitHub ni incluyas claves en las capturas.**

La construcción inicial requiere conexión a Internet para imágenes Docker, Maven y npm. Recomendada memoria de Docker Desktop 6–8 GiB para cuatro JVM + tres MySQL. Docker Compose moderno soporta `--wait`.

| Acceso | URL desde tu computador |
|---|---|
| Frontend React + Nginx | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| API Catálogo v1 | http://localhost:8080/api/v1/juegos |

Puedes abrir también `http://localhost:3000/swagger-ui.html` mediante el proxy Nginx. React mantiene sus URLs `/api/` por compatibilidad y el backend **también expone `/api/v1/`** para documentar los endpoints versionados. Ambas llegan a las mismas operaciones.

## Comprobar el funcionamiento

```powershell
docker compose ps
powershell -ExecutionPolicy Bypass -File .\verificar.ps1
powershell -ExecutionPolicy Bypass -File .\pruebas\integracion.ps1
```

`verificar.ps1` consulta Gateway + catálogo; `pruebas/integracion.ps1` registra evidencias en consola de login, JWT, CRUD de juego y favoritos. La prueba elimina su juego temporal al finalizar y **no reemplaza capturas reales** de Swagger, frontend y Docker Desktop.

Para observar problemas:

```powershell
docker compose logs -f --tail=100 usuarios
docker compose logs --tail=100 catalogo favoritos gateway frontend
docker compose config
```

## Apagar / volver a iniciar

```powershell
powershell -ExecutionPolicy Bypass -File .\detener.ps1
# o: docker compose down
# Para iniciar luego sin recompilar:
docker compose up -d --wait
```

**No ejecutes `docker compose down -v` salvo que quieras borrar las bases MySQL y las claves JWT almacenadas.** Las contraseñas en `.env` se aplican al crear los usuarios y bases iniciales; editarlas tras haber creado volúmenes no cambia automáticamente las credenciales guardadas. 

## Qué se ejecuta

- `frontend` (Nginx + compilación React/Vite), expuesto en **localhost:3000**.
- `gateway` (Spring Cloud Gateway), expuesto en **localhost:8080**.
- `usuarios` (JWT, login, roles), interno en 8081, base `db-usuarios`.
- `catalogo` (juegos y CRUD), interno en 8082, base `db-catalogo`.
- `favoritos` (asocia juego a usuario), interno en 8083, base `db-favoritos`.
- `auth_keys` guarda claves de firma JWT y los tres volúmenes `db_*` preservan información.
- La carpeta `backend/common` es un módulo Java compartido; **no es un cuarto microservicio**.

El Gateway se comunica usando nombres de servicio Docker (`usuarios`, `catalogo`, `favoritos`); **dentro de Docker no se utiliza localhost para llamar a otro contenedor**. El frontend usa el proxy Nginx para evitar URLs fijas en el navegador.

## Swagger y seguridad

1. Abrir `http://localhost:8080/swagger-ui.html` y seleccionar Usuarios / Catálogo / Favoritos.
2. En la sección Usuarios: `POST /api/v1/auth/login`, pasar correo y contraseña desde `.env` y encabezado `X-Requested-With: PlayRoute`. Consultar el `accessToken` devuelto.
3. Utilizar `Authorize` con el JWT y consultar `GET /api/v1/auth/me` o crear un juego desde el rol ADMIN.
4. Sin token, `GET /api/v1/juegos` es público. Las operaciones de modificación de catálogo exigen ADMIN; Favoritos exige login y extrae el usuario del JWT.
5. Para la recarga de sesión, el frontend usa cookie HttpOnly de renovación; no guardes JWT ni contraseñas en capturas.

## Si hay problemas

- **Puerto ocupado:** asegúrate de liberar localhost:3000/8080 o modifica `FRONTEND_PORT` en `.env` y revisa `FRONTEND_ORIGINS`. Puerto del Gateway permanece en 8080 salvo cambio explícito de Compose.
- **Fallo de Maven/npm:** Internet y memoria disponibles. No se verificó la compilación completa en este entorno; recoge los logs en tu equipo.
- **MySQL no levanta:** `docker compose ps` y `docker compose logs db-usuarios`; verifica que Docker tenga memoria suficiente.
- **Usuario/clave no coincide:** la base persiste. Las variables iniciales solo afectan las cuentas creadas en bases vacías.
- **Error 401:** JWT inválido o vencido; inicia sesión otra vez (la cookie HttpOnly puede renovar la sesión).
- **CORS/403 en login:** origen debe estar permitido y se debe enviar `X-Requested-With: PlayRoute`.

## Despliegue EC2 (opcional)

La guía del profesor presenta EC2 como **laboratorio adicional**. Este `compose.yaml` publica frontend y Gateway solo en `127.0.0.1` para un uso local más seguro. Si lo subes a EC2, **no publiques MySQL ni los puertos internos**. Utiliza VPN/túnel SSH o configura un proxy HTTPS con control de exposición, cambia `COOKIE_SECURE` y orígenes, gestiona secretos de forma segura y consulta las restricciones de AWS Academy antes de iniciar recursos. No uses la configuración de demostración tal cual como un despliegue público.
