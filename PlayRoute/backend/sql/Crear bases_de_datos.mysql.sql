-- EJEMPLO para ambiente local. Cambiar las contraseñas antes de ejecutar.
CREATE DATABASE IF NOT EXISTS playroute_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS playroute_catalogo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS playroute_favoritos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'pr_usuarios'@'localhost' IDENTIFIED BY 'CambiarUsuarios123!';
CREATE USER IF NOT EXISTS 'pr_catalogo'@'localhost' IDENTIFIED BY 'CambiarCatalogo123!';
CREATE USER IF NOT EXISTS 'pr_favoritos'@'localhost' IDENTIFIED BY 'CambiarFavoritos123!';
GRANT ALL PRIVILEGES ON playroute_usuarios.* TO 'pr_usuarios'@'localhost';
GRANT ALL PRIVILEGES ON playroute_catalogo.* TO 'pr_catalogo'@'localhost';
GRANT ALL PRIVILEGES ON playroute_favoritos.* TO 'pr_favoritos'@'localhost';
-- Nota: CREATE USER IF NOT EXISTS no actualiza claves de usuarios existentes.
