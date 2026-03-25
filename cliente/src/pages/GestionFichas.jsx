import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GestionFichas = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  
  // Estado para la lista de fichas (Lectura)
  const [fichas, setFichas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estado para el formulario (Escritura)
  // NOTA: administrador_id está fijo en 1 para pruebas. En producción vendrá del Login.
  const [formData, setFormData] = useState({
    numero_ficha: '',
    programa: '',
    nivel: '',
    region: '',
    centro_formacion: '',
    jornada: '',
    duracion_meses: '',
    codigo_invitacion: '', // Podrías generarlo automático luego
    administrador_id: 1 
  });

  const [error, setError] = useState(null);

  // 1. Cargar fichas al montar el componente (READ)
  useEffect(() => {
    const cargarFichas = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/fichas');
        if (!response.ok) throw new Error('Error al cargar fichas');
        
        const data = await response.json();
        setFichas(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las fichas. Verifica que el servidor esté activo.');
      } finally {
        setCargando(false);
      }
    };

    cargarFichas();
  }, []);

  // 2. Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Enviar formulario (CREATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validación básica
    if (!formData.numero_ficha || !formData.programa || !formData.nivel) {
      alert('Por favor completa los campos obligatorios (Número, Programa, Nivel)');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/fichas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ ¡Ficha creada exitosamente!');
        setShowModal(false);
        
        // Recargar la lista para mostrar la nueva ficha sin recargar la página
        const updatedResponse = await fetch('http://localhost:3000/api/fichas');
        const updatedData = await updatedResponse.json();
        setFichas(updatedData);

        // Limpiar formulario
        setFormData({
          numero_ficha: '',
          programa: '',
          nivel: '',
          region: '',
          centro_formacion: '',
          jornada: '',
          duracion_meses: '',
          codigo_invitacion: '',
          administrador_id: 1
        });
      } else {
        alert('❌ Error: ' + (result.error || 'No se pudo crear la ficha'));
      }
    } catch (err) {
      console.error(err);
      alert('❌ Error de conexión con el servidor');
    }
  };

  const styles = {
    wrapper: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative' },
    backBtn: { background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' },
    title: { fontSize: '2rem', fontWeight: '900', color: '#166534', margin: 0 },
    btnCreate: { background: '#84cc16', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(132, 204, 22, 0.3)' },
    cardTable: { background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#f1f5f9', padding: '18px', textAlign: 'left', color: '#475569', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase' },
    td: { padding: '18px', borderTop: '1px solid #f1f5f9', color: '#1e293b' },
    badge: { padding: '6px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '700', background: '#dcfce7', color: '#166534' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
    modal: { background: 'white', padding: '40px', borderRadius: '30px', width: '90%', maxWidth: '560px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '700', color: '#475569', fontSize: '0.9rem' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '16px', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
    errorMsg: { color: '#ef4444', fontSize: '0.9rem', marginTop: '10px', textAlign: 'center' }
  };

  const focusStyle = (e) => (e.target.style.borderColor = '#84cc16');
  const blurStyle = (e) => (e.target.style.borderColor = '#cbd5e1');

  return (
    <div style={styles.wrapper}>
      <motion.button whileHover={{ x: -5 }} style={styles.backBtn} onClick={() => navigate('/dashboard')}>
        ⬅ Regresar al Panel
      </motion.button>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Fichas de Formación</h2>
          <p style={{ color: '#64748b', margin: '5px 0 0' }}>Administración de grupos y programas</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.btnCreate} onClick={() => setShowModal(true)}>
          + Crear Ficha
        </motion.button>
      </div>

      <div style={styles.cardTable}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Número</th>
              <th style={styles.th}>Programa</th>
              <th style={styles.th}>Nivel</th>
              <th style={styles.th}>Regional</th>
              <th style={styles.th}>Centro</th>
              <th style={styles.th}>Jornada</th>
              <th style={styles.th}>Duración</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={8} style={{ ...styles.td, textAlign: 'center', padding: '40px' }}>
                  Cargando fichas...
                </td>
              </tr>
            ) : fichas.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                  No hay fichas registradas. ¡Crea la primera!
                </td>
              </tr>
            ) : (
              fichas.map((ficha) => (
                <tr key={ficha.id}>
                  <td style={{ ...styles.td, fontWeight: 'bold' }}>{ficha.numero_ficha}</td>
                  <td style={styles.td}>{ficha.programa}</td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{ficha.nivel}</span>
                  </td>
                  <td style={styles.td}>{ficha.region || '-'}</td>
                  <td style={styles.td}>{ficha.centro_formacion || '-'}</td>
                  <td style={styles.td}>{ficha.jornada || '-'}</td>
                  <td style={styles.td}>{ficha.duracion_meses ? `${ficha.duracion_meses} meses` : '-'}</td>
                  <td style={styles.td}>
                    <button style={{ background: 'none', border: 'none', color: '#84cc16', cursor: 'pointer', fontWeight: 'bold' }}>
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.modal}>
              <h3 style={{ margin: '0 0 25px 0', fontSize: '1.6rem', color: '#1e293b' }}>Registrar Nueva Ficha</h3>

              <form onSubmit={handleSubmit}>
                <div style={styles.row}>
                  <div>
                    <label style={styles.label}>Número de Ficha *</label>
                    <input 
                      style={styles.input} 
                      name="numero_ficha"
                      value={formData.numero_ficha}
                      onChange={handleChange}
                      placeholder="Ej: 2874013" 
                      onFocus={focusStyle} 
                      onBlur={blurStyle} 
                      required
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Programa *</label>
                    <input 
                      style={styles.input} 
                      name="programa"
                      value={formData.programa}
                      onChange={handleChange}
                      placeholder="Nombre del programa" 
                      onFocus={focusStyle} 
                      onBlur={blurStyle} 
                      required
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <div>
                    <label style={styles.label}>Nivel *</label>
                    <select 
                      style={styles.input} 
                      name="nivel"
                      value={formData.nivel}
                      onChange={handleChange}
                      onFocus={focusStyle} 
                      onBlur={blurStyle}
                      required
                    >
                      <option value="">Seleccionar nivel</option>
                      <option value="Técnico">Técnico</option>
                      <option value="Tecnólogo">Tecnólogo</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Jornada</label>
                    <select 
                      style={styles.input} 
                      name="jornada"
                      value={formData.jornada}
                      onChange={handleChange}
                      onFocus={focusStyle} 
                      onBlur={blurStyle}
                    >
                      <option value="">Seleccionar jornada</option>
                      <option value="Mañana">Mañana</option>
                      <option value="Tarde">Tarde</option>
                      <option value="Noche">Noche</option>
                    </select>
                  </div>
                </div>

                <div style={styles.row}>
                  <div>
                    <label style={styles.label}>Regional</label>
                    <input 
                      style={styles.input} 
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      placeholder="Ej: Regional Tolima" 
                      onFocus={focusStyle} 
                      onBlur={blurStyle} 
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Centro de Formación</label>
                    <input 
                      style={styles.input} 
                      name="centro_formacion"
                      value={formData.centro_formacion}
                      onChange={handleChange}
                      placeholder="Nombre del centro" 
                      onFocus={focusStyle} 
                      onBlur={blurStyle} 
                    />
                  </div>
                </div>

                <div>
                  <label style={styles.label}>Duración (meses)</label>
                  <input 
                    style={styles.input} 
                    type="number" 
                    name="duracion_meses"
                    value={formData.duracion_meses}
                    onChange={handleChange}
                    placeholder="Ej: 24" 
                    min="1" 
                    onFocus={focusStyle} 
                    onBlur={blurStyle} 
                  />
                </div>

                {error && <p style={styles.errorMsg}>{error}</p>}

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)} 
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    style={{ ...styles.btnCreate, flex: 1, padding: '14px', boxShadow: 'none' }}
                  >
                    Guardar Ficha
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

export default GestionFichas;