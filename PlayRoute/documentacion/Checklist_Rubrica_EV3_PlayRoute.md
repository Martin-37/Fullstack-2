# PlayRoute — checklist para la Evaluación Parcial 3 (DSY1104)

**Fecha:** 13 de noviembre de 2026. **Base:** rúbrica de la Evaluación Parcial 3 (EE/EP), Anexos 1–4, guía de arquitectura y guía Docker de GameTech. **Estado:** trabajo preparado, **no validado funcionalmente en Docker** en este entorno.

| Exigencia | Implementación/preparación incluida | Evidencia final que debes obtener |
|---|---|---|
| Backend conectado a BD relacional | Tres servicios Spring Boot, perfil `mysql`, 3 contenedores `mysql:8.4` y volúmenes | `docker compose ps`, consulta a Catálogo y/o evidencia de tablas |
| Lógica y capas | `controller`, `service`, `repository`, `model`, `dto`/config/exception | Explicar flujo para `POST /api/v1/juegos` y `POST /api/v1/favoritos/{juegoId}` |
| API REST CRUD + Swagger | Usuarios y juegos CRUD; Favoritos GET/POST/DELETE; aliases versionados `/api/v1` | Capturas Swagger con GET, POST, PUT, DELETE y respuestas |
| Integración frontend/backend | React llama `/api`; Nginx/Gateway enrutan a Java; Favoritos consulta Catálogo | Capturar juegos desde la base y favoritos desde cuenta autenticada |
| JWT y roles | Usuarios firma JWT RS256; ADMIN modifica juegos, MIEMBRO consulta/favoritos | Demostrar operación permitida ADMIN y prohibida MIEMBRO |
| Renovación/persistencia de sesión | Cookie HttpOnly y endpoint `/auth/refresh` + token de acceso en frontend | Captura antes/después de recargar; comprobar expiry/renovación |
| Restricción UI | Formularios CRUD visibles solo para ADMIN y autorización real en backend | Comparar vistas ADMIN vs MIEMBRO |
| Docker | `compose.yaml`, Dockerfiles, scripts para iniciar y comprobar ocho contenedores | Probar `iniciar.ps1` y `verificar.ps1`; capturas reales de Docker Desktop |
| Manual de usuario | `Manual_Usuario_PlayRoute.docx` con guía de uso y figuras enumeradas | **Sustituir todos los espacios de captura pendientes** (borde negro 1 px) |
| API e integración (Anexo 2) | `Documentacion_APIs_e_Integracion_PlayRoute.docx` | Capturas Swagger, HTTP y React, más descripción de cada figura |
| Documentación API (Anexo 3) | `Documentacion_APIs_PlayRoute.xlsx`, 19 endpoints reales, 3 servicios | Revisar respuestas al probar cada endpoint |
| Manual técnico de microservicios | `Manual_Tecnico_Microservicios_y_Docker_PlayRoute.docx` | Completar figuras de Docker, Swagger y scripts |
| ERS | **No incluido:** faltan requisitos formales del cliente y aprobación del equipo | Adjuntar documento ERS terminado de tu proyecto |
| GitHub | Archivos `.gitignore` y estructura preparados | Subir frontend y backend a repos públicos; adjuntar ambos enlaces |
| Entrega ZIPs | ZIP consolidado con frontend+backend; opcional separarlos para la plataforma | Adjuntar ZIP de frontend y ZIP de backend si la plataforma exige dos |
| Presentación oral | Manual técnico incluye preguntas para explicar arquitectura | Practicar demo en 15 min y preguntas (según Anexo 1) |

## Evidencias mínimas para completar antes de presentar

1. Ocho contenedores healthy en `docker compose ps`.
2. Swagger (Usuarios / Catálogo / Favoritos) con rutas `/api/v1/`.
3. GET público `/api/v1/juegos` con respuesta 200.
4. Inicio de sesión ADMIN y JWT obtenido **sin mostrar valor del token**.
5. Crear/editar/eliminar juego con ADMIN y visualización inmediata en React.
6. Denegación 403 para crear un juego desde el rol MIEMBRO.
7. Agregar y quitar favorito desde el frontend autenticado y comprobar la lista por usuario.
8. Actualizar/reabrir la página y comprobar el comportamiento de sesión; si falla, documentarlo y corregir.
9. Ejecutar `pruebas/integracion.ps1` y conservar resultado sin credenciales.
10. Proporcionar enlaces GitHub y ERS terminado.

**Nota sobre la consigna:** el Anexo 1 describe el caso de una tienda con roles Administrador, Vendedor y Cliente; PlayRoute es una guía de videojuegos con ADMIN y MIEMBRO, no una tienda. Explica al profesor la adaptación del caso y confirma que acepta esa equivalencia de roles y funcionalidades. La rúbrica general evalúa la implementación, no basta con presentar documentos.

**Estado técnico:** se realizó revisión de estructura, YAML y recursos de documentación; **no se ejecutó realmente `docker compose up` ni `mvn test`** aquí al no disponer de Docker/Maven ni de sus dependencias descargadas. Cada marca de evidencia es una tarea a realizar en el computador del estudiante, no un resultado fabricado.
