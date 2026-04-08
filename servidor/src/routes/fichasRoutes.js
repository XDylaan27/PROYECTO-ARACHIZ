import { Router } from 'express';
import { getFichasByInstructor, getAllFichas, getFichaById, crearFicha, editarFicha } from '../controllers/fichasController.js';

const router = Router();

const authMiddleware = (req, res, next) => {
  req.userId = req.headers['x-user-id'];
  next();
};

router.get('/', authMiddleware, getAllFichas);
router.get('/instructor', authMiddleware, getFichasByInstructor);
router.get('/:id', authMiddleware, getFichaById);
router.post('/', authMiddleware, crearFicha);
router.put('/:id', authMiddleware, editarFicha);

export default router;
