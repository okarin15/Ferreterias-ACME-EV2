CREATE DATABASE IF NOT EXISTS acme_db;
USE acme_db;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio INT NOT NULL,
    stock INT NOT NULL
);

-- Datos iniciales para pruebas
INSERT INTO productos (nombre, precio, stock) VALUES ('Martillo Galponero', 12990, 50);
INSERT INTO productos (nombre, precio, stock) VALUES ('Taladro Inalámbrico', 45000, 15);