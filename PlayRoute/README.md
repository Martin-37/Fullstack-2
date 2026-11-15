> **Docker Compose (nuevo):** instrucciones en [README_DOCKER.md](README_DOCKER.md). En Windows ejecuta `powershell -ExecutionPolicy Bypass -File .\iniciar.ps1` desde esta carpeta para levantar React, Gateway, tres microservicios y tres MySQL.

# PlayRoute — frontend React + 3 microservicios Spring Boot

Proyecto integrado **a partir del ZIP actualizado del estudiante**. El ZIP GameTech EV3 del profesor sirvió como referencia de arquitectura (capas, Maven multimódulo, JWT, Gateway, Swagger); no se copiaron sus productos ni pedidos. El diseño visual React se conserva.

## 1. Arquitectura

```
React + Vite (:5173)
     | /api (proxy Vite)
     v
Gateway Spring Cloud (:8080) — sin base de datos
  ├── Usuarios (:8081)  → BD usuarios
  ├── Catálogo (:8082)  → BD catalogo
  └── Favoritos (:8083) → BD favoritos
```

Los **tres microservicios de negocio** son Usuarios, Catalogo y Favoritos. Gateway es el punto de entrada; `common` es una biblioteca de código y **no cuenta como microservicio**. Cada servicio usa `controller`, `service`, `repository`, `model`, `config` y, cuando aplica, `dto` y `exception`.

* Usuarios: registro (`/api/auth/registro`), login (`/api/auth/login`), refresh con cookie HttpOnly, logout, `/api/auth/me`, usuarios CRUD de administración.
* Catálogo: GET público y operaciones de alta, modificación y baja de videojuegos exclusivamente para `ADMIN`. Las categorías se guardan como texto con etiquetas separadas por coma, compatibles con los formularios actuales; se filtra con `?categoria=` y `?q=`. **No** hay una tabla de categorías independiente en esta etapa.
* Favoritos: almacena pares `usuarioId`-`juegoId` sin clave foránea entre bases de datos. **Obtiene el `usuarioId` desde el JWT**, nunca desde el cuerpo enviado por React; verifica la existencia del juego consultando el Catálogo.

## 2. Antes de ejecutar

- JDK 17 o superior (se recomienda Java 21).
- Node compatible con el `package.json` actual (recomendado Node 24.21 o superior).
- Conexión a internet en la primera compilación para que Maven Wrapper y npm obtengan dependencias.
- **No necesitas MySQL para empezar:** el perfil predeterminado es H2 con archivos persistentes por servicio.

### Paso A: compilar backend

En PowerShell, situándote en `PlayRoute`:

```powershell
cd backend
.\mvnw.cmd clean package
```

Si faltan dependencias, deja que Maven las descargue. Si aparece un error de Java, comprueba `java -version`.

### Paso B: iniciar backend (4 terminales)

Abre una terminal PowerShell para **cada** comando, desde la carpeta `PlayRoute`:

```powershell
cd backend\Usuarios
java -jar target\Usuarios-1.0.0.jar
```

```powershell
cd backend\Catalogo
java -jar target\Catalogo-1.0.0.jar
```

```powershell
cd backend\Favoritos
java -jar target\Favoritos-1.0.0.jar
```

```powershell
cd backend\Gateway
java -jar target\Gateway-1.0.0.jar
```

El orden recomendado es Usuarios → Catálogo → Favoritos → Gateway. Deja las 4 terminales abiertas. Cada servicio H2 guarda datos en su propia carpeta `data`; el servicio Usuarios también guarda allí sus claves RSA, **no subas esas claves a Git**.

### Paso C: frontend

En una quinta terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Entra a **http://localhost:5173**. Las llamadas `/api` se redirigen desde Vite hacia el Gateway 8080.

### Cuentas de demostración

| Correo | Contraseña inicial | Rol |
|---|---|---|
| `admin@playroute.com` | `Admin1234!` | ADMIN |
| `user@playroute.com` | `Cliente1234!` | MIEMBRO |

Las contraseñas se configuran antes del primer arranque con variables `ADMIN_PASSWORD` y `MIEMBRO_PASSWORD`, y se almacenan como hashes BCrypt. **Cambiar las variables no modifica cuentas ya existentes**. Cambia las claves para cualquier uso fuera del laboratorio. El registro normal nunca crea administradores.

## 3. Prueba de endpoints

Una vez iniciados los servicios, Swagger:

**http://localhost:8080/swagger-ui.html**

El selector debería ofrecer Usuarios, Catálogo y Favoritos. En Usuarios, prueba `POST /api/auth/login` (cabecera `X-Requested-With: PlayRoute`), copia `accessToken` y pégalo en **Authorize** de Swagger para probar endpoints que requieren JWT.

| Método | Ruta en Gateway | Permiso |
|---|---|---|
| POST | `/api/auth/registro` | Público |
| POST | `/api/auth/login` | Público |
| POST | `/api/auth/refresh` | Cookie válida + cabecera |
| POST | `/api/auth/logout` | Sesión/cookie + cabecera |
| GET | `/api/auth/me` | Usuario autenticado |
| GET, POST, PUT, DELETE | `/api/usuarios[/{id}]` | ADMIN |
| GET | `/api/juegos` | Público |
| GET | `/api/juegos/{id}` | Público |
| GET | `/api/juegos?q=minecraft` | Público |
| GET | `/api/juegos?categoria=accion` | Público, acentos normalizados |
| POST | `/api/juegos` | ADMIN |
| PUT, DELETE | `/api/juegos/{id}` | ADMIN |
| GET | `/api/favoritos` | Autenticado, solo propios |
| POST, DELETE | `/api/favoritos/{juegoId}` | Autenticado, solo propios |

Un juego JSON se envía, por ejemplo, así:

```json
{
  "nombre": "Hades",
  "min_desc": "Roguelike de acción",
  "categoria": "Acción, Aventura",
  "imagen": "https://example.com/hades.jpg"
}
```

GET `/api/favoritos` devuelve un arreglo de IDs de juegos (por ejemplo `[1, 3]`). El catálogo se inicializa con los 15 juegos del frontend **solo la primera vez que la tabla está vacía**.

## 4. MySQL opcional

1. Ejecuta `backend/sql/Crear bases_de_datos.mysql.sql` en Workbench con privilegios de administración y **cambia las contraseñas de ejemplo**.
2. Usa el perfil `mysql` para cada microservicio: en la terminal respectiva, antes de `java -jar`, configura:

```powershell
$env:SPRING_PROFILES_ACTIVE="mysql"
$env:DB_USUARIOS_PASSWORD="tu-clave-de-usuarios"
# Inicia desde backend\Usuarios
java -jar target\Usuarios-1.0.0.jar
```

En las otras terminales usa `DB_CATALOGO_PASSWORD` (Catálogo) y `DB_FAVORITOS_PASSWORD` (Favoritos) con `SPRING_PROFILES_ACTIVE=mysql`. Los usuarios predeterminados de MySQL son `pr_usuarios`, `pr_catalogo` y `pr_favoritos` y pueden cambiarse con `DB_USUARIOS_USER`, `DB_CATALOGO_USER` y `DB_FAVORITOS_USER`.

Las URL se pueden sobreescribir con `DB_USUARIOS_URL`, `DB_CATALOGO_URL`, `DB_FAVORITOS_URL`. Si ya utilizabas el perfil `h2`, el cambio a `mysql` crea **otra base de datos**, no migra automáticamente los datos de H2.

## 5. Qué se integró en React

- Las páginas de Login y Registro ahora llaman a `Usuarios` por API (no guardan contraseñas en `localStorage`).
- `JuegosContext` consulta el Catálogo por API para mostrar y realizar CRUD de videojuegos; conserva el listado visual inicial mientras se carga el servidor y muestra un aviso si falla la conexión.
- Las tarjetas y la página Favoritos consultan y modifican favoritos en la BD; se requiere cuenta iniciada.
- El token de acceso se guarda en `sessionStorage`; la renovación usa una cookie HttpOnly del servicio Usuarios. La autorización real la implementa Spring Security en los microservicios, independientemente del rol que muestre React.
- Vite redirige `/api` a `localhost:8080`.

Las pantallas de contacto y guía se dejaron esencialmente como estaban. El vínculo «¿Olvidaste tu contraseña?» sigue siendo de ejemplo, y no hay recuperación por correo implementada.

## 6. Validación y próximos pasos

```powershell
cd backend
.\mvnw.cmd test
cd ..\frontend
npm ci
npm run test:run
npm run build
```

**Importante:** los archivos fueron integrados y revisados estáticamente; **en este entorno no pudieron ejecutarse las pruebas de integración del backend ni del frontend** porque no está disponible Maven preinstalado y faltan paquetes de npm en la caché sin conexión. Ejecuta las instrucciones anteriores en tu equipo; si se produce un error, comparte la salida de consola para corregirlo.

Próxima etapa opcional: agregar pruebas HTTP reales con JUnit + MockMvc, tests de acceso por roles, infraestructura Docker/MySQL y mejoras del modelo de categorías (tabla y CRUD). El ejemplo del docente contiene varios de esos patrones.
