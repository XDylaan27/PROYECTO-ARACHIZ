import { supabase } from '../config/database.js';

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