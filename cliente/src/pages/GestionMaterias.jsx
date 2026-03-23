import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 1. Importar

const GestionMaterias = () => {
  const navigate = useNavigate(); // 2. Inicializar
  const [showModal, setShowModal] = useState(false);

  const styles = {
    wrapper: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    backBtn: { 
      background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', 
      display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', marginBottom: '10px' 
    },
    title: { fontSize: '1.8rem', fontWeight: '900', color: '#166534', margin: 0 },
    btnAction: {
      background: '#84cc16', color: 'white', border: 'none', padding: '12px 24px', 
      borderRadius: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(132, 204, 22, 0.3)'
    },
    tableBox: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#f8fafc', padding: '16px', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' },
    td: { padding: '16px', borderTop: '1px solid #f1f5f9', color: '#334155' }
  };

  return (
    <div style={styles.wrapper}>
      {/* BOTÓN VOLVER */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
         Volver al Dashboard
      </button>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Gestión de Materias</h2>
          <p style={{ color: '#64748b' }}>Configuración de asignaturas</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} style={styles.btnAction} onClick={() => setShowModal(true)}>
          + Agregar Materia
        </motion.button>
      </div>

      <div style={styles.tableBox}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={styles.td}><b>Programación Web</b></td>
              <td style={styles.td}>
                <button style={{border:'none', background:'none', cursor:'pointer'}}>✏️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionMaterias;