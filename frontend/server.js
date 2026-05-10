const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const dbConfig = {
    host: 'db',
    user: 'user_acme',
    password: 'password_acme',
    database: 'acme_db'
};

let db;

function conectarBD() {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            console.error('Error conectando a MariaDB (reintentando en 5s):', err.message);
            setTimeout(conectarBD, 5000); // Reintento automático
        } else {
            console.log('Conectado exitosamente a MariaDB ACME');
        }
    });

    // Manejador de errores para caídas de conexión inesperadas
    db.on('error', err => {
        console.error('Error en la base de datos:', err.code);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            console.log('Reconectando...');
            conectarBD();
        } else {
            throw err;
        }
    });
}

conectarBD();

// Endpoints (mantener igual que antes)
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

app.post('/api/productos', (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)', 
    [nombre, precio, stock], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json({ id: results.insertId, ...req.body });
    });
});

app.delete('/api/productos/:id', (req, res) => {
    db.query('DELETE FROM productos WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Eliminado" });
    });
});

app.listen(3000, () => {
    console.log('Servidor ERP corriendo en el puerto 3000');
});