import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
// Asegúrate de tener instalados: npm install framer-motion react-router-dom

const InfoFicha = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el ID de la ficha desde la URL (ej: /ficha/1)
  
  // Estados
  const [ficha, setFicha] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Estado del formulario de materia
  const [formData, setFormData] = useState({
    nombre_materia: '',
    tipo_materia: 'tecnica', // default
    ficha_id: id,
    instructor_creador_id: 1 // TODO: Obtener del usuario logueado (localStorage)
  });

  // 1. Cargar información de la Ficha y sus Materias al montar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // A. Cargar datos de la ficha (necesitarás un endpoint GET /api/fichas/:id)
        // Por ahora simulamos o usamos el mismo endpoint de todas filtrando luego si no tienes el de detalle
        const resFicha = await fetch(`http://localhost:3000/api/fichas/${id}`);
        if (resFicha.ok) {
          const dataFicha = await resFicha.json();
          setFicha(dataFicha); // Asumiendo que la API devuelve el objeto directo o tomamos data[0]
        }

        // B. Cargar materias de esta ficha
        const resMaterias = await fetch(`http://localhost:3000/api/materias?ficha_id=${id}`);
        if (resMaterias.ok) {
          const dataMaterias = await resMaterias.json();
          setMaterias(dataMaterias);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };

    if (id) cargarDatos();
  }, [id]);

  // 2. Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Crear Materia
  const handleCrearMateria = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('✅ Materia creada exitosamente');
        setShowModal(false);
        // Recargar lista de materias
        const res = await fetch(`http://localhost:3000/api/materias?ficha_id=${id}`);
        const data = await res.json();
        setMaterias(data);
        // Limpiar form
        setFormData({ ...formData, nombre_materia: '', tipo_materia: 'tecnica' });
      } else {
        const err = await response.json();
        alert('❌ Error: ' + err.error);
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  // 4. Eliminar Materia
  const handleEliminarMateria = async (materiaId) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta materia?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/materias/${materiaId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('🗑️ Materia eliminada');
        // Recargar lista
        const res = await fetch(`http://localhost:3000/api/materias?ficha_id=${id}`);
        const data = await res.json();
        setMaterias(data);
      } else {
        alert('❌ No se pudo eliminar');
      }
    } catch (error) {
      alert('❌ Error de conexión');
    }
  };

  if (cargando) return <div className="flex justify-center items-center h-screen text-gray-500">Cargando información de la ficha...</div>;
  if (!ficha) return <div className="text-center text-red-500 mt-10">Ficha no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Botón Volver */}
      <button 
        onClick={() => navigate('/dashboard')} // O a la lista de fichas
        className="mb-6 flex items-center text-gray-600 hover:text-green-600 transition-colors font-medium"
      >
        ← Volver al Dashboard
      </button>

      {/* HEADER DE LA FICHA (Tarjeta de Información) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide mb-2">
              {ficha.nivel}
            </span>
            <h1 className="text-3xl font-black text-gray-800 mb-1">Ficha {ficha.numero_ficha}</h1>
            <p className="text-lg text-gray-600 font-medium">{ficha.programa}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Centro de Formación</p>
            <p className="font-semibold text-gray-800">{ficha.centro_formacion || 'No especificado'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Regional</p>
            <p className="text-gray-700 font-medium">{ficha.region || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Jornada</p>
            <p className="text-gray-700 font-medium">{ficha.jornada || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Duración</p>
            <p className="text-gray-700 font-medium">{ficha.duracion_meses ? `${ficha.duracion_meses} meses` : '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Código Invitación</p>
            <p className="text-gray-700 font-mono bg-gray-100 inline-block px-2 py-1 rounded">{ficha.codigo_invitacion || '---'}</p>
          </div>
        </div>
      </motion.div>

      {/* SECCIÓN DE MATERIAS */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Materias de la Ficha</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-500/30 transition-all flex items-center gap-2"
        >
          <span className="text-xl">+</span> Agregar Materia
        </motion.button>
      </div>

      {/* TABLA DE MATERIAS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {materias.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-lg">No hay materias registradas en esta ficha aún.</p>
            <p className="text-sm mt-2">¡Sé el primero en agregar una!</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <tr>
                <th className="p-4">Nombre de la Materia</th>
                <th className="p-4">Tipo</th>
                <th className="p-4">Instructor Creador</th> {/* Podrías hacer join para traer el nombre */}
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {materias.map((materia) => (
                <tr key={materia.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-800">{materia.nombre_materia}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      materia.tipo_materia === 'tecnica' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {materia.tipo_materia}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">ID: {materia.instructor_creador_id}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleEliminarMateria(materia.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                      title="Eliminar materia"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DE CREAR MATERIA */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Evitar cerrar al hacer click dentro
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Nueva Materia</h3>
                <p className="text-sm text-gray-500">Agregando a la ficha {ficha.numero_ficha}</p>
              </div>
              
              <form onSubmit={handleCrearMateria} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la Materia</label>
                  <input
                    type="text"
                    name="nombre_materia"
                    value={formData.nombre_materia}
                    onChange={handleChange}
                    placeholder="Ej: Programación Web Avanzada"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Materia</label>
                  <select
                    name="tipo_materia"
                    value={formData.tipo_materia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-white"
                  >
                    <option value="tecnica">Técnica (Específica del programa)</option>
                    <option value="transversal">Transversal (Común a varios programas)</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all"
                  >
                    Guardar Materia
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoFicha;