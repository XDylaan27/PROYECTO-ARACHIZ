import { supabaseAdmin } from '../config/supabaseClient.js';

// ── INSTRUCTOR: abrir sesión ──────────────────────────────────────────────────
export const abrirSesion = async (req, res) => {
  try {
    const { materia_id, observacion } = req.body;
    const instructor_id = req.headers['x-user-id'];

    if (!materia_id) return res.status(400).json({ error: 'materia_id es requerido' });

    // Verificar que no haya sesión abierta en esta materia
    const { data: abierta } = await supabaseAdmin
      .from('sesiones_asistencia')
      .select('id')
      .eq('materia_id', materia_id)
      .eq('estado', 'abierta')
      .single();

    if (abierta) return res.status(409).json({ error: 'Ya hay una sesión abierta en esta materia' });

    const { data, error } = await supabaseAdmin
      .from('sesiones_asistencia')
      .insert({ materia_id, instructor_id, observacion: observacion || null })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, sesion: data });
  } catch (err) {
    console.error('Error al abrir sesión:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── INSTRUCTOR: cerrar sesión ─────────────────────────────────────────────────
export const cerrarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const instructor_id = req.headers['x-user-id'];

    // Obtener sesión y su materia para saber la ficha
    const { data: sesion, error: errSesion } = await supabaseAdmin
      .from('sesiones_asistencia')
      .select('id, materia_id, estado, materias(ficha_id)')
      .eq('id', id)
      .single();

    if (errSesion || !sesion) return res.status(404).json({ error: 'Sesión no encontrada' });
    if (sesion.estado === 'cerrada') return res.status(409).json({ error: 'La sesión ya está cerrada' });

    const ficha_id = sesion.materias.ficha_id;

    // Obtener todos los aprendices de la ficha
    const { data: aprendices } = await supabaseAdmin
      .from('fichas_usuarios')
      .select('usuario_id')
      .eq('ficha_id', ficha_id)
      .eq('rol_en_ficha', 'aprendiz');

    const total_aprendices = aprendices?.length || 0;

    // Obtener quiénes ya marcaron asistencia
    const { data: asistidos } = await supabaseAdmin
      .from('registros_asistencia')
      .select('aprendiz_id')
      .eq('sesion_id', id)
      .eq('estado', 'asistio');

    const idsAsistidos = new Set((asistidos || []).map(a => String(a.aprendiz_id)));
    const total_asistieron = idsAsistidos.size;

    // Insertar fallas para quienes no marcaron
    const fallas = (aprendices || [])
      .filter(a => !idsAsistidos.has(String(a.usuario_id)))
      .map(a => ({
        sesion_id: Number(id),
        aprendiz_id: a.usuario_id,
        estado: 'falla',
        metodo: 'boton',
        hora_marcado: null,
      }));

    if (fallas.length > 0) {
      const { error: errFallas } = await supabaseAdmin
        .from('registros_asistencia')
        .insert(fallas);
      if (errFallas) throw errFallas;
    }

    // Cerrar sesión
    const { data: sesionCerrada, error: errCierre } = await supabaseAdmin
      .from('sesiones_asistencia')
      .update({ estado: 'cerrada', hora_fin: new Date().toISOString(), total_aprendices, total_asistieron })
      .eq('id', id)
      .select()
      .single();

    if (errCierre) throw errCierre;
    res.json({ success: true, sesion: sesionCerrada });
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── INSTRUCTOR: sesiones de una materia ──────────────────────────────────────
export const getSesionesByMateria = async (req, res) => {
  try {
    const { materia_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('sesiones_asistencia')
      .select('id, fecha, hora_inicio, hora_fin, estado, observacion, total_aprendices, total_asistieron')
      .eq('materia_id', materia_id)
      .order('hora_inicio', { ascending: false });

    if (error) throw error;
    res.json({ success: true, sesiones: data });
  } catch (err) {
    console.error('Error al obtener sesiones:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── INSTRUCTOR: registros de una sesión ──────────────────────────────────────
export const getRegistrosBySesion = async (req, res) => {
  try {
    const { sesion_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('registros_asistencia')
      .select(`
        id, estado, metodo, hora_marcado,
        usuarios (id, nombre, apellido, documento)
      `)
      .eq('sesion_id', sesion_id)
      .order('estado');

    if (error) throw error;
    const registros = data.map(r => ({ ...r.usuarios, estado: r.estado, metodo: r.metodo, hora_marcado: r.hora_marcado }));
    res.json({ success: true, registros });
  } catch (err) {
    console.error('Error al obtener registros:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── APRENDIZ: historial propio en una materia ────────────────────────────────
export const getMisRegistros = async (req, res) => {
  try {
    const { materia_id } = req.params;
    const aprendiz_id = req.headers['x-user-id'];

    const { data, error } = await supabaseAdmin
      .from('registros_asistencia')
      .select(`
        id, estado, metodo, hora_marcado,
        sesiones_asistencia (id, fecha, hora_inicio, hora_fin, observacion, estado)
      `)
      .eq('aprendiz_id', aprendiz_id)
      .eq('sesiones_asistencia.materia_id', materia_id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Filtrar solo los que pertenecen a esta materia
    const registros = data
      .filter(r => r.sesiones_asistencia !== null)
      .map(r => ({
        id: r.id,
        estado: r.estado,
        metodo: r.metodo,
        hora_marcado: r.hora_marcado,
        sesion: r.sesiones_asistencia,
      }));

    res.json({ success: true, registros });
  } catch (err) {
    console.error('Error al obtener registros del aprendiz:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── APRENDIZ: sesión abierta en una materia ───────────────────────────────────
export const getSesionAbierta = async (req, res) => {
  try {
    const { materia_id } = req.params;
    const aprendiz_id = req.headers['x-user-id'];

    const { data: sesion } = await supabaseAdmin
      .from('sesiones_asistencia')
      .select('id, hora_inicio, observacion')
      .eq('materia_id', materia_id)
      .eq('estado', 'abierta')
      .single();

    if (!sesion) return res.json({ success: true, sesion: null });

    // Verificar si el aprendiz ya marcó
    const { data: yaMarco } = await supabaseAdmin
      .from('registros_asistencia')
      .select('id')
      .eq('sesion_id', sesion.id)
      .eq('aprendiz_id', aprendiz_id)
      .single();

    res.json({ success: true, sesion, ya_marco: !!yaMarco });
  } catch (err) {
    console.error('Error al obtener sesión abierta:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── APRENDIZ: marcar asistencia ───────────────────────────────────────────────
export const marcarAsistencia = async (req, res) => {
  try {
    const { sesion_id } = req.body;
    const aprendiz_id = req.headers['x-user-id'];

    if (!sesion_id) return res.status(400).json({ error: 'sesion_id es requerido' });

    // Verificar que la sesión esté abierta
    const { data: sesion } = await supabaseAdmin
      .from('sesiones_asistencia')
      .select('id, estado')
      .eq('id', sesion_id)
      .single();

    if (!sesion || sesion.estado !== 'abierta') {
      return res.status(409).json({ error: 'La sesión ya no está disponible' });
    }

    // Verificar que no haya marcado ya
    const { data: yaMarco } = await supabaseAdmin
      .from('registros_asistencia')
      .select('id')
      .eq('sesion_id', sesion_id)
      .eq('aprendiz_id', aprendiz_id)
      .single();

    if (yaMarco) return res.status(409).json({ error: 'Ya marcaste asistencia en esta sesión' });

    const { data, error } = await supabaseAdmin
      .from('registros_asistencia')
      .insert({ sesion_id, aprendiz_id, estado: 'asistio', metodo: 'boton', hora_marcado: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, registro: data });
  } catch (err) {
    console.error('Error al marcar asistencia:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
