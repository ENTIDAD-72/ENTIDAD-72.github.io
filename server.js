const express = require('express');
const bodyParser = require('body-parser');
const sql = require('msnodesqlv8');
const path = require('path');
const cors = require('cors');
const http = require('http');

// Conexión a la base de datos Access
const connectionString = `Driver={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${path.join(__dirname, 'database', 'db.accdb')};`;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.post('/agregar-empleado', (req, res) => {
    const { nombre, identificacion, contrato, jefe } = req.body;
    const query = `INSERT INTO Empleados (Nombre, Identificacion, Contrato, Jefe) VALUES (?, ?, ?, ?)`;

    sql.query(connectionString, query, [nombre, identificacion, contrato, jefe], (err) => {
        if (err) {
            res.status(500).send('Error al agregar empleado: ' + err);
        } else {
            res.status(200).send('Empleado agregado');
        }
    });
});

app.post('/asignar-tarea', (req, res) => {
    const { empleado, tarea, ubicacion, insumos, descripcion, turno } = req.body;
    const query = `INSERT INTO Tareas (Empleado, Tarea, Ubicacion, Insumos, Descripcion, Turno) VALUES (?, ?, ?, ?, ?, ?)`;

    sql.query(connectionString, query, [empleado, tarea, ubicacion, insumos, descripcion, turno], (err) => {
        if (err) {
            res.status(500).send('Error al asignar tarea: ' + err);
        } else {
            res.status(200).send('Tarea asignada');
        }
    });
});

app.get('/obtener-empleados', (req, res) => {
    const query = `SELECT * FROM Empleados`;

    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            res.status(500).send('Error al obtener empleados: ' + err);
        } else {
            res.status(200).json(rows);
        }
    });
});

app.get('/obtener-tareas', (req, res) => {
    const query = `SELECT * FROM Tareas`;

    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            res.status(500).send('Error al obtener tareas: ' + err);
        } else {
            res.status(200).json(rows);
        }
    });
});

app.put('/cambiar-estado/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const query = `UPDATE Tareas SET Estado = ? WHERE ID = ?`;

    sql.query(connectionString, query, [estado, id], (err) => {
        if (err) {
            res.status(500).send('Error al cambiar estado: ' + err);
        } else {
            res.status(200).send('Estado cambiado');
        }
    });
});

app.delete('/eliminar-tarea/:id', (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM Tareas WHERE ID = ?`;

    sql.query(connectionString, query, [id], (err) => {
        if (err) {
            res.status(500).send('Error al eliminar tarea: ' + err);
        } else {
            res.status(200).send('Tarea eliminada');
        }
    });
});

// Ruta por defecto
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para cerrar el servidor
app.post('/close-server', (req, res) => {
    console.log('Solicitud de cierre recibida. Cerrando servidor...');
    if (server) {
        server.close(() => {
            console.log('Servidor cerrado.');
            process.exit(0);
        });
        res.status(200).send('Cerrando servidor...');
    } else {
        res.status(500).send('El servidor no está en ejecución.');
    }
});

// Función para encontrar un puerto libre
function findAvailablePort(port) {
    return new Promise((resolve, reject) => {
        const tempServer = http.createServer(app);
        tempServer.listen(port, () => {
            tempServer.close(() => {
                resolve(port);
            });
        });
        tempServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(port + 1));
            } else {
                reject(err);
            }
        });
    });
}

// Encontrar un puerto disponible y luego iniciar el servidor
let server;
findAvailablePort(3000)
    .then((port) => {
        server = app.listen(port, () => { 
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error al encontrar un puerto disponible:', err);
    });

