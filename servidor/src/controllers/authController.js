import { supabaseAdmin } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const { nombre, apellido, documento, email, password, rol } = req.body;

    if (!nombre || !apellido || !documento || !email || !password || !rol) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el documento ya existe
    const { data: existe } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('documento', documento)
      .single();

    if (existe) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese documento' });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const { data: nuevoUsuario, error } = await supabaseAdmin
      .from('usuarios')
      .insert({ nombre, apellido, documento, email, password_hash, rol })
      .select('id, nombre, apellido, documento, email, rol')
      .single();

    if (error) {
      console.error('Error al crear usuario:', error);
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }

    res.status(201).json({ success: true, user: nuevoUsuario });

  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { documento, password } = req.body;

    if (!documento || !password) {
      return res.status(400).json({ error: 'Documento y contraseña son requeridos' });
    }

    // Buscar usuario en la tabla 'usuarios' por documento
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre, apellido, documento, email, password_hash, rol')
      .eq('documento', documento)
      .single();

    if (error || !usuario) {
      console.error('Error al buscar usuario:', error);
      return res.status(401).json({ error: 'Documento o contraseña incorrectos' });
    }

    // Verificar contraseña con bcrypt
    const validPassword = await bcrypt.compare(password, usuario.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Documento o contraseña incorrectos' });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        documento: usuario.documento,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};