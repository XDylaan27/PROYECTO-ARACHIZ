import express from 'express';
import { crearFicha, obtenerFichas } from '../controllers/fichasController.js';

const router = express.Router();

// Definir endpoints
router.post('/', crearFicha);       // POST http://localhost:3000/api/fichas
router.get('/', obtenerFichas);     // GET http://localhost:3000/api/fichas

export default router;