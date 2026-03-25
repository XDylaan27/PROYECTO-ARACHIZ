// servidor/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fichasRoutes from './src/routes/fichasRoutes.js';
import authRoutes from './src/routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir conexiones desde React (Frontend)
app.use(express.json()); // Permitir recibir JSON en el body

// Rutas de API
app.use('/api/fichas', fichasRoutes);
app.use('/api/auth', authRoutes); 

// Ruta de prueba raíz
app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Arachiz funcionando 🚀' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoint listo: http://localhost:${PORT}/api/fichas`);
});