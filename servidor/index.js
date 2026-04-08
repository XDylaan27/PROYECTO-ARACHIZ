import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();


console.log('=== DEBUG .env ===');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Cargada' : '❌ NO CARGADA');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Cargada (primeros 10 chars): ' + process.env.SUPABASE_KEY.substring(0, 10) + '...' : '❌ NO CARGADA');
console.log('PORT:', process.env.PORT);
console.log('=== FIN DEBUG ===');

import fichasRoutes from './src/routes/fichasRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import materiasRoutes from './src/routes/materiasRoutes.js';
import invitacionRoutes from './src/routes/invitacionRoutes.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de API
app.use('/api/fichas', fichasRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/invitacion', invitacionRoutes);

app.get('/', (req, res) => {
    res.json({ mensaje: 'Servidor Arachiz funcionando 🚀' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📡 Endpoint auth: http://localhost:${PORT}/api/auth/login`);
});