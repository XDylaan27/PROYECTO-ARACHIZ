import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GestionMaterias = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('crear'); // 'crear' | 'editar'

  const styles = {
    wrapper: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    backBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', marginBottom: '10px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '1.8rem', fontWeight: '900', color: '#166534', margin: 0 },
    btnAction: { background: '#84cc16', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(132, 204, 22, 0.3)' },
    tableBox: { background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#f8fafc', padding: '16px', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' },
    td: { padding: '16px', borderTop: '1px solid #f1f5f9', color: '#334155' },
    badge: { padding: '5px 12px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700' },
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
    modal: { background: 'white', padding: '40px', borderRadius: '30px', width: '90%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '700', color: '#475569', fontSize: '0.9rem' },
    input: { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '16px', boxSizing: 'border-box', fontSize: '1rem', outline: 'none' },
    btnDelete: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem', marginLeft: '8px' },
    btnEdit: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.1rem' },
  };

  const focusStyle = (e) => (e.target.style.borderColor = '#84cc16');
  const blurStyle = (e) => (e.target.style.borderColor = '#cbd5e1');

  const openCrear = () => { setModalMode('crear'); setShowModal(true); };
  const openEditar = () => { setModalMode('editar'); setShowModal(true); };

  const badgeStyle = (tipo) =>
    tipo === 'transversal'
      ? { ...styles.badge, background: '#e0f2fe', color: '#0369a1' }
      : { ...styles.badge, background: '#dcfce7', color: '#166534' };

  return (
    <div style={styles.wrapper}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Volver al Dashboard
      </button>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Gestión de Materias</h2>
          <p style={{ color: '#64748b' }}>Configuración de asignaturas</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} style={styles.btnAction} onClick={openCrear}>
          + Agregar Materia
        </motion.button>
      </div>

      <div style={styles.tableBox}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Tipo</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Sin datos hasta conectar con backend */}
            <tr>
              <td colSpan={3} style={{ ...styles.td, textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                No hay materias registradas
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.overlay}>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={styles.modal}>
              <h3 style={{ margin: '0 0 25px 0', fontSize: '1.5rem', color: '#1e293b' }}>
                {modalMode === 'crear' ? 'Agregar Materia' : 'Editar Materia'}
              </h3>

              <label style={styles.label}>Nombre de la Materia</label>
              <input style={styles.input} placeholder="Ej: Programación Web" onFocus={focusStyle} onBlur={blurStyle} />

              <label style={styles.label}>Tipo de Materia</label>
              <select style={styles.input} onFocus={focusStyle} onBlur={blurStyle}>
                <option value="">Seleccionar tipo</option>
                <option value="transversal">Transversal</option>
                <option value="tecnica">Técnica</option>
              </select>

              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #ddd', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button style={{ ...styles.btnAction, flex: 1, padding: '14px', boxShadow: 'none' }}>
                  {modalMode === 'crear' ? 'Guardar' : 'Actualizar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionMaterias;
