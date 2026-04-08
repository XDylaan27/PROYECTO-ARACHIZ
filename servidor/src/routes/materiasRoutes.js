import { Router } from 'express';
import { getMateriasByFicha, getMateriaById, crearMateria } from '../controllers/materiasController.js';

const router = Router();

router.get('/', getMateriasByFicha);
router.get('/:id', getMateriaById);
router.post('/', crearMateria);

export default router;
