import { supabaseAdmin } from '../config/supabaseClient.js';

export const getFichasAprendiz = async (req, res) => {
  try {
    const aprendizId = req.headers['x-user-id'];
    if (!aprendizId) return res.status(401).json({ error: 'Usuario no autenticado' });

    const { data, error } = await supabaseAdmin
      .from('fichas_usuarios')
      .select(`
        ficha_id,
        fecha_union,
        fichas (id, numero_ficha, programa, nivel, jornada)
      `)
      .eq('usuario_id', aprendizId)
      .eq('rol_en_ficha', 'aprendiz');

    if (error) throw error;
    const fichas = data.map(item => ({ ...item.fichas, fecha_union: item.fecha_union }));
    res.json({ success: true, fichas });
  } catch (err) {
    console.error('Error al obtener fichas del aprendiz:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const unirseConCodigo = async (req, res) => {
  try {
    const { codigo_invitacion } = req.body;
    const aprendiz_id = req.headers['x-user-id'];

    if (!codigo_invitacion) {
      return res.status(400).json({ error: 'El código de invitación es requerido' });
    }

    // Buscar la ficha con ese código
    const { data: ficha, error: errorFicha } = await supabaseAdmin
      .from('fichas')
      .select('id, numero_ficha, programa')
      .eq('codigo_invitacion', codigo_invitacion.trim().toUpperCase())
      .single();

    if (errorFicha || !ficha) {
      return res.status(404).json({ error: 'Código de invitación inválido' });
    }

    // Verificar que el aprendiz no esté ya en ninguna ficha
    const { data: fichaActual } = await supabaseAdmin
      .from('fichas_usuarios')
      .select('id')
      .eq('usuario_id', aprendiz_id)
      .eq('rol_en_ficha', 'aprendiz')
      .single();

    if (fichaActual) {
      return res.status(409).json({ error: 'Ya estás inscrito en una ficha. Un aprendiz solo puede pertenecer a una ficha.' });
    }

    // Inscribir al aprendiz
    const { error: errorInscripcion } = await supabaseAdmin
      .from('fichas_usuarios')
      .insert({ ficha_id: ficha.id, usuario_id: aprendiz_id, rol_en_ficha: 'aprendiz' });

    if (errorInscripcion) throw errorInscripcion;

    res.json({ success: true, ficha: { id: ficha.id, numero_ficha: ficha.numero_ficha, programa: ficha.programa } });
  } catch (err) {
    console.error('Error al unirse a ficha:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAprendicesByFicha = async (req, res) => {
  try {
    const { ficha_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('fichas_usuarios')
      .select(`
        usuario_id,
        fecha_union,
        usuarios (id, nombre, apellido, documento, email)
      `)
      .eq('ficha_id', ficha_id)
      .eq('rol_en_ficha', 'aprendiz');

    if (error) throw error;

    const aprendices = data.map(item => ({ ...item.usuarios, fecha_union: item.fecha_union }));
    res.json({ success: true, aprendices });
  } catch (err) {
    console.error('Error al obtener aprendices:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
