import { supabase } from '../config/database.js';

export const obtenerFichaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validación básica
    if (!id) {
      return res.status(400).json({ error: 'Se requiere un ID válido' });
    }

    console.log(`🔍 Buscando ficha con ID: ${id} (tipo: ${typeof id})`);

    // Consulta a Supabase
    // .eq('id', id) funciona bien incluso si id es string, Supabase hace el cast
    const { data, error } = await supabase
      .from('fichas')
      .select('*')
      .eq('id', id)
      .single(); // .single() espera exactamente un resultado

    // Manejo de errores de Supabase
    if (error) {
      console.error('Error de Supabase:', error);
      // Si el error es PGRST116 (no rows returned), significa que no existe
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ficha no encontrada en la base de datos' });
      }
      throw error;
    }

    // Si data es null (a veces pasa si no hay error pero tampoco datos)
    if (!data) {
      return res.status(404).json({ error: 'Ficha no encontrada' });
    }

    // Éxito
    console.log('✅ Ficha encontrada:', data.numero_ficha);
    res.status(200).json(data);

  } catch (error) {
    console.error('Error interno al obtener ficha:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const crearFicha = async (req, res) => {
    try {
        const { numero_ficha, programa, nivel, region, centro_formacion, jornada, duracion_meses, codigo_invitacion, administrador_id } = req.body;

        if (!numero_ficha || !programa || !nivel) {
            return res.status(400).json({ 
                error: 'Faltan datos obligatorios', 
                detalles: 'Se requiere número de ficha, programa y nivel' 
            });
        }

        const { data, error } = await supabase
            .from('fichas')
            .insert([{ 
                numero_ficha, 
                programa, 
                nivel, 
                region, 
                centro_formacion, 
                jornada, 
                duracion_meses, 
                codigo_invitacion, 
                administrador_id 
            }])
            .select(); 

        if (error) {
            console.error('Error de Supabase:', error);
            
            if (error.code === '23505') { 
                return res.status(409).json({ error: 'Ya existe una ficha con ese número o código de invitación.' });
            }
            throw error;
        }

        
        res.status(201).json({ 
            mensaje: 'Ficha creada exitosamente', 
            data: data[0] 
        });

    } catch (error) {
        console.error('Error interno al crear ficha:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


export const obtenerFichas = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('fichas')
            .select('*');

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener fichas' });
    }
};

// servidor/src/controllers/fichasController.js

// ... tus otras funciones (crearFicha, obtenerFichas) ...

// NUEVA FUNCIÓN: Obtener una sola ficha por ID