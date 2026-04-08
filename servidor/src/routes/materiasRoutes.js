import { Router } from 'express';
import { getMateriasByFicha, crearMateria } from '../controllers/materiasController.js';

const router = Router();

router.get('/', getMateriasByFicha);
router.post('/', crearMateria);

export default router;
