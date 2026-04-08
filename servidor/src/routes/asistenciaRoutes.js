import { Router } from 'express';
import {
  abrirSesion,
  cerrarSesion,
  getSesionesByMateria,
  getRegistrosBySesion,
  getSesionAbierta,
  marcarAsistencia,
  getMisRegistros,
} from '../controllers/asistenciaController.js';

const router = Router();

// Instructor
router.post('/sesiones', abrirSesion);
router.put('/sesiones/:id/cerrar', cerrarSesion);
router.get('/sesiones/materia/:materia_id', getSesionesByMateria);
router.get('/sesiones/:sesion_id/registros', getRegistrosBySesion);

// Aprendiz
router.get('/sesion-abierta/:materia_id', getSesionAbierta);
router.get('/mis-registros/:materia_id', getMisRegistros);
router.post('/marcar', marcarAsistencia);

export default router;
