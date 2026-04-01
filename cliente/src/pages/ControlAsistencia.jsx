import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ControlAsistencia = () => {
  const navigate = useNavigate();

  const styles = {
    wrapper: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
    title: { fontSize: '2rem', fontWeight: '900', color: '#166534', marginBottom: '30px' },
    filterBar: { background: 'white', padding: '20px', borderRadius: '20px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' },
    select: { padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', minWidth: '200px' },
    listCard: { background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #e2e8f0' },
    item: { display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', padding: '15px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' },
    btnPresente: { background: '#dcfce7', color: '#166534', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
  };

  return (
    <div style={styles.wrapper}>
      <motion.button whileHover={{ x: -5 }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 'bold', marginBottom: '20px' }} onClick={() => navigate('/dashboard')}>
        ⬅ Volver
      </motion.button>
      
      <h2 style={styles.title}>Pase de Lista</h2>

      <div style={styles.filterBar}>
        <select style={styles.select}>
          <option>Seleccionar Ficha</option>
          <option>2687351 - ADSO</option>
        </select>
        <input type="date" style={styles.select} />
        <motion.button whileTap={{ scale: 0.95 }} style={{ background: '#84cc16', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold' }}>
          Cargar Lista
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.listCard}>
        <div style={{ ...styles.item, fontWeight: '800', color: '#64748b', fontSize: '0.8rem' }}>
          <span>DOCUMENTO</span>
          <span>NOMBRE DEL APRENDIZ</span>
          <span>ESTADO</span>
        </div>

        {/* Ejemplo de aprendiz en lista */}
        <motion.div whileHover={{ background: '#f8fafc' }} style={styles.item}>
          <span>1094XXXXXX</span>
          <span style={{ fontWeight: '600' }}>Dylan Garcia</span>
          <div>
            <motion.button whileTap={{ scale: 0.9 }} style={styles.btnPresente}>Presente ✓</motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ControlAsistencia;