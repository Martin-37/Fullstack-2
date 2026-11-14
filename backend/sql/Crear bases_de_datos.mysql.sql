-- Ejecutar con una cuenta administradora en MySQL Workbench.
-- Sustituir las contraseñas y copiarlas al .env. No ejecutar sobre datos previos sin revisión.
CREATE DATABASE IF NOT EXISTS playroute_usuarios CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS playroute_administrador CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS playroute_favoritos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Una cuenta por microservicio, cada una con acceso solo a su base.
CREATE USER IF NOT EXISTS 'pr_usuarios'@'localhost' IDENTIFIED BY 'CambiarUsuarios123!';
CREATE USER IF NOT EXISTS 'pr_administrador'@'localhost' IDENTIFIED BY 'CambiarAdmin123!';
CREATE USER IF NOT EXISTS 'pr_favoritos'@'localhost' IDENTIFIED BY 'CambiarFavoritos123!';
GRANT ALL PRIVILEGES ON playroute_usuarios.* TO 'pr_usuarios'@'localhost';
GRANT ALL PRIVILEGES ON playroute_administrador.* TO 'pr_administrador'@'localhost';
GRANT ALL PRIVILEGES ON playroute_favoritos.* TO 'pr_favoritos'@'localhost';
-- IF NOT EXISTS no cambia la contraseña de una cuenta existente.
