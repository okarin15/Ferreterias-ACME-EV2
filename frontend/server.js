const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Conexión a MariaDB usando la red interna 'acme-net'
const db = mysql.createConnection({
    host: 'db', 
    user: 'user_acme',
    password: 'password_acme',
    database: 'acme_db'
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MariaDB:', err);
        return;
    }
    console.log('Conectado exitosamente a MariaDB ACME');
});

// API para obtener productos
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// API para agregar productos
app.post('/api/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', 
    [nombre, precio, stock], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, ...req.body });
    });
});

app.listen(3000, () => {
    console.log('Servidor ERP corriendo en el puerto 3000');
});