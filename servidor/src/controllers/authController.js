// servidor/src/controllers/authController.js
import { supabase } from '../config/database.js';
import bcrypt from 'bcrypt';

// REGISTER (RF01)
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, documento, email, password, rol } = req.body;

    // Validaciones básicas (RF61, RF62)
    if (!nombre || !apellido || !documento || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // 1. Verificar si el usuario ya existe por documento o email (RF63)
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .or(`documento.eq.${documento},email.eq.${email}`)
      .single();

    if (existingUser) {
      return res.status(409).json({ 
        error: 'El usuario ya existe. El documento o correo ya están registrados.' 
      });
    }

    // 2. Cifrar contraseña (RNF05) - ¡Importante hacerlo siempre!
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insertar en la base de datos
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ 
        nombre, 
        apellido, 
        documento, 
        email, 
        password_hash: passwordHash, // Guardamos el hash, no la password real
        rol: rol || 'aprendiz' // Por defecto aprendiz si no se especifica
      }])
      .select('id, nombre, apellido, rol'); // Devolvemos datos sin la contraseña

    if (error) throw error;

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente', 
      usuario: data[0] 
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar.' });
  }
};

// LOGIN (RF02, RF74) - Versión simplificada sin tokens complejos aún
export const iniciarSesion = async (req, res) => {
  try {
    const { documento, password } = req.body;

    if (!documento || !password) {
      return res.status(400).json({ error: 'Documento y contraseña requeridos.' });
    }

    // 1. Buscar usuario por documento
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('documento', documento)
      .single();

    if (error || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // 2. Comparar contraseñas (La que envían vs la hasheada en BD)
    const match = await bcrypt.compare(password, usuario.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // 3. Éxito (Por ahora devolvemos los datos básicos)
    // En el futuro aquí generaríamos un JWT
    res.status(200).json({ 
      mensaje: 'Inicio de sesión exitoso', 
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};