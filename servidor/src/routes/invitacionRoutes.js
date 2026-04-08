import { Router } from 'express';
import { unirseConCodigo, getAprendicesByFicha, getFichasAprendiz } from '../controllers/invitacionController.js';

const router = Router();

router.post('/unirse', unirseConCodigo);
router.get('/mis-fichas', getFichasAprendiz);
router.get('/aprendices/:ficha_id', getAprendicesByFicha);

export default router;
