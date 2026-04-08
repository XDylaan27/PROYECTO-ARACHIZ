import { supabaseAdmin } from '../config/supabaseClient.js';

export const getMateriasByFicha = async (req, res) => {
  try {
    const { ficha_id } = req.query;

    if (!ficha_id) {
      return res.status(400).json({ error: 'ficha_id es requerido' });
    }

    const { data, error } = await supabaseAdmin
      .from('materias')
      .select('id, nombre_materia, tipo_materia, created_at')
      .eq('ficha_id', ficha_id)
      .order('id', { ascending: true });

    if (error) throw error;
    res.json({ success: true, materias: data });
  } catch (err) {
    console.error('Error al obtener materias:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const crearMateria = async (req, res) => {
  try {
    const { nombre_materia, tipo_materia, ficha_id } = req.body;
    const instructor_creador_id = req.headers['x-user-id'];

    if (!nombre_materia || !ficha_id) {
      return res.status(400).json({ error: 'nombre_materia y ficha_id son requeridos' });
    }

    const { data, error } = await supabaseAdmin
      .from('materias')
      .insert({ nombre_materia, tipo_materia, ficha_id, instructor_creador_id })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, materia: data });
  } catch (err) {
    console.error('Error al crear materia:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
