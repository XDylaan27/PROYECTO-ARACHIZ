import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GestionFichas = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // Estilos de maquetación Frontend
  const styles = {
    wrapper: { 
      padding: '40px', 
      background: '#f8fafc', 
      minHeight: '100vh', 
      fontFamily: "'Inter', sans-serif",
      position: 'relative'
    },
    backBtn: { 
      background: '#fff', 
      border: '1px solid #e2e8f0', 
      color: '#64748b', 
      padding: '10px 18px', 
      borderRadius: '12px', 
      cursor: 'pointer', 
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '25px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '35px' 
    },
    title: { fontSize: '2rem', fontWeight: '900', color: '#166534', margin: 0 },
    btnCreate: {
      background: '#84cc16', color: 'white', border: 'none', padding: '14px 28px', 
      borderRadius: '14px', fontWeight: '800', cursor: 'pointer', 
      boxShadow: '0 10px 15px -3px rgba(132, 204, 22, 0.3)'
    },
    cardTable: { 
      background: 'white', 
      borderRadius: '24px', 
      border: '1px solid #e2e8f0', 
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { 
      background: '#f1f5f9', 
      padding: '18px', 
      textAlign: 'left', 
      color: '#475569', 
      fontSize: '0.85rem', 
      fontWeight: '800', 
      textTransform: 'uppercase' 
    },
    td: { padding: '18px', borderTop: '1px solid #f1f5f9', color: '#1e293b' },
    badge: { 
      padding: '6px 14px', 
      borderRadius: '10px', 
      fontSize: '0.8rem', 
      fontWeight: '700', 
      background: '#dcfce7', 
      color: '#166534' 
    },
    // Estilos del Modal
    overlay: { 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 
    },
    modal: { 
      background: 'white', padding: '40px', borderRadius: '30px', 
      width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' 
    },
    input: { 
      width: '100%', padding: '14px', borderRadius: '12px', 
      border: '1px solid #cbd5e1', marginBottom: '15px', boxSizing: 'border-box',
      fontSize: '1rem'
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Botón de Retroceder */}
      <motion.button 
        whileHover={{ x: -5 }}
        style={styles.backBtn} 
        onClick={() => navigate('/dashboard')}
      >
        ⬅ Regresar al Panel
      </motion.button>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Fichas de Formación</h2>
          <p style={{ color: '#64748b', margin: '5px 0 0' }}>Administración de grupos y programas</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          style={styles.btnCreate}
          onClick={() => setShowModal(true)}
        >
          + Crear Ficha
        </motion.button>
      </div>

      <div style={styles.cardTable}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Número de Ficha</th>
              <th style={styles.th}>Programa de Formación</th>
              <th style={styles.th}>Jornada</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Maqueta para el Backend */}
            <tr>
              <td style={styles.td}><b>2874013</b></td>
              <td style={styles.td}>ADSO (Análisis y Desarrollo de Software)</td>
              <td style={styles.td}><span style={styles.badge}>Mañana</span></td>
              <td style={styles.td}>
                <button style={{border:'none', background:'none', cursor:'pointer', fontSize: '1.2rem', marginRight: '10px'}}>✏️</button>
                <button style={{border:'none', background:'none', cursor:'pointer', fontSize: '1.2rem'}}>🗑️</button>
              </td>
            </tr>
            <tr>
              <td style={styles.td}><b>3146013</b></td>
              <td style={styles.td}>Gestión Administrativa</td>
              <td style={styles.td}><span style={{...styles.badge, background: '#fef9c3', color: '#854d0e'}}>Mixta</span></td>
              <td style={styles.td}>
                <button style={{border:'none', background:'none', cursor:'pointer', fontSize: '1.2rem', marginRight: '10px'}}>✏️</button>
                <button style={{border:'none', background:'none', cursor:'pointer', fontSize: '1.2rem'}}>🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Ficha */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={styles.overlay}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              style={styles.modal}
            >
              <h3 style={{ margin: '0 0 25px 0', fontSize: '1.6rem', color: '#1e293b' }}>Registrar Nueva Ficha</h3>
              
              <label style={{display:'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569'}}>Código de la Ficha</label>
              <input style={styles.input} placeholder="Ej: 2874013" />

              <label style={{display:'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569'}}>Programa</label>
              <input style={styles.input} placeholder="Nombre del programa" />

              <label style={{display:'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569'}}>Jornada</label>
              <select style={styles.input}>
                <option>Mañana</option>
                <option>Tarde</option>
                <option>Noche</option>
                <option>Mixta</option>
              </select>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button 
                  onClick={() => setShowModal(false)} 
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button style={{ ...styles.btnCreate, flex: 1, padding: '14px', boxShadow: 'none' }}>
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionFichas;