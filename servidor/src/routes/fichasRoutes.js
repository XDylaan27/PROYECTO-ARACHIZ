import express from 'express';
import { crearFicha, obtenerFichas, obtenerFichaPorId } from '../controllers/fichasController.js';

const router = express.Router();

// Definir endpoints
router.post('/', crearFicha);       // POST http://localhost:3000/api/fichas
router.get('/', obtenerFichas);     // GET http://localhost:3000/api/fichas
router.get('/:id', obtenerFichaPorId); // GET http://localhost:3000/api/fichas/:id

export default router;