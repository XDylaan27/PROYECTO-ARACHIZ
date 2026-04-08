import { supabaseAdmin } from '../config/supabaseClient.js';
import { randomBytes } from 'crypto';

const generarCodigo = () => randomBytes(4).toString('hex').toUpperCase(); // ej: "A3F2B1C4"

export const getFichasByInstructor = async (req, res) => {
  try {
    const instructorId = req.headers['x-user-id'];
    if (!instructorId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const { data, error } = await supabaseAdmin
      .from('fichas_usuarios')
      .select(`ficha_id, fichas (id, numero_ficha, programa, nivel, jornada, region, centro_formacion)`)
      .eq('usuario_id', instructorId);

    if (error) throw error;
    res.json({ success: true, fichas: data.map(item => item.fichas) });
  } catch (err) {
    console.error('Error al obtener fichas:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getFichaById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('fichas')
      .select('id, numero_ficha, programa, nivel, jornada, region, centro_formacion, duracion_meses, codigo_invitacion')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Ficha no encontrada' });
    res.json({ success: true, ficha: data });
  } catch (err) {
    console.error('Error al obtener ficha:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const getAllFichas = async (req, res) => {
  try {
    const instructorId = req.headers['x-user-id'];
    if (!instructorId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const { data, error } = await supabaseAdmin
      .from('fichas')
      .select('id, numero_ficha, programa, nivel, jornada, region, centro_formacion, duracion_meses, codigo_invitacion')
      .eq('administrador_id', instructorId)
      .order('id', { ascending: false });

    if (error) throw error;
    res.json({ success: true, fichas: data });
  } catch (err) {
    console.error('Error al obtener fichas:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const crearFicha = async (req, res) => {
  try {
    const { numero_ficha, programa, nivel, jornada, region, centro_formacion, duracion_meses } = req.body;
    const administrador_id = req.headers['x-user-id'];

    if (!numero_ficha || !programa || !nivel) {
      return res.status(400).json({ error: 'numero_ficha, programa y nivel son requeridos' });
    }

    const codigo_invitacion = generarCodigo();

    const { data, error } = await supabaseAdmin
      .from('fichas')
      .insert({ numero_ficha, programa, nivel, jornada, region, centro_formacion, duracion_meses, administrador_id, codigo_invitacion })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, ficha: data });
  } catch (err) {
    console.error('Error al crear ficha:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

export const editarFicha = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_ficha, programa, nivel, jornada, region, centro_formacion, duracion_meses } = req.body;
    const instructorId = req.headers['x-user-id'];

    // Verificar que la ficha pertenece al instructor
    const { data: fichaExistente } = await supabaseAdmin
      .from('fichas')
      .select('administrador_id')
      .eq('id', id)
      .single();

    if (!fichaExistente || String(fichaExistente.administrador_id) !== String(instructorId)) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta ficha' });
    }

    const { data, error } = await supabaseAdmin
      .from('fichas')
      .update({ numero_ficha, programa, nivel, jornada, region, centro_formacion, duracion_meses })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, ficha: data });
  } catch (err) {
    console.error('Error al editar ficha:', err);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};
