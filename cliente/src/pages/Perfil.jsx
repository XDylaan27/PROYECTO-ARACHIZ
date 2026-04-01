import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { User, Mail, ShieldCheck, Camera, Key } from 'lucide-react';

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);

  const styles = {
    layout: { display: 'flex', background: '#f8fafc', minHeight: '100vh' },
    content: { marginLeft: '260px', width: 'calc(100% - 260px)', padding: '60px' },
    card: { 
      background: '#fff', 
      borderRadius: '30px', 
      padding: '40px', 
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e2e8f0'
    },
    avatarContainer: {
      position: 'relative',
      width: '120px',
      height: '120px',
      margin: '0 auto 20px',
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: '40px',
      background: 'linear-gradient(135deg, #84cc16 0%, #166534 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '3rem',
      fontWeight: 'bold'
    },
    editBadge: {
      position: 'absolute',
      bottom: '-5px',
      right: '-5px',
      background: '#fff',
      padding: '8px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      cursor: 'pointer'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginTop: '30px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: { color: '#64748b', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase' },
    dataBox: {
      padding: '15px',
      background: '#f1f5f9',
      borderRadius: '15px',
      color: '#1e293b',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    btnPass: {
      gridColumn: 'span 2',
      marginTop: '20px',
      padding: '15px',
      borderRadius: '15px',
      border: '2px solid #84cc16',
      background: 'transparent',
      color: '#166534',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.content}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.card}
        >
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>D</div> {/* Inicial del usuario */}
            <div style={styles.editBadge}>
              <Camera size={18} color="#64748b" />
            </div>
          </div>

          <h2 style={{ textAlign: 'center', color: '#166534', margin: '0' }}>Dylan Garcia</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: '5px' }}>Instructor Frontend</p>

          <div style={styles.infoGrid}>
            <div style={styles.inputGroup}>
              <span style={styles.label}>Documento</span>
              <div style={styles.dataBox}><User size={18} /> 1094857XXX</div>
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.label}>Correo SENA</span>
              <div style={styles.dataBox}><Mail size={18} /> dylan.dev@sena.edu.co</div>
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.label}>Rol de Usuario</span>
              <div style={styles.dataBox}><ShieldCheck size={18} /> Administrador</div>
            </div>
            <div style={styles.inputGroup}>
              <span style={styles.label}>Estado</span>
              <div style={styles.dataBox}>
                <div style={{ width: '8px', height: '8px', background: '#84cc16', borderRadius: '50%' }} />
                Cuenta Activa
              </div>
            </div>

            <motion.button 
              whileHover={{ backgroundColor: '#f0fdf4' }}
              whileTap={{ scale: 0.98 }}
              style={styles.btnPass}
            >
              <Key size={18} /> Cambiar Contraseña Segura
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Perfil;