const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para entender JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        mensaje: 'Servidor Arachiz funcionando correctamente',
        fecha: new Date().toISOString()
    });
});

// Encender servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});