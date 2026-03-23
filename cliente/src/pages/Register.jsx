import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const styles = {
    container: {
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
    },
    blob: {
      position: 'absolute',
      width: '700px',
      height: '700px',
      background: 'radial-gradient(circle, rgba(132,204,22,0.25) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      zIndex: 0,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.7)',
      padding: '3rem',
      borderRadius: '3rem',
      width: '100%',
      maxWidth: '450px',
      boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
      zIndex: 1,
      textAlign: 'center',
    },
    header: {
      marginBottom: '2.5rem',
    },
    title: {
      fontSize: '2.2rem',
      fontWeight: '900',
      color: '#166534',
      margin: 0,
      letterSpacing: '-1.5px',
    },
    accentBar: {
      width: '60px',
      height: '5px',
      background: '#84cc16',
      margin: '10px auto',
      borderRadius: '10px',
    },
    form: {
      display: 'grid',
      gap: '1.2rem',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      width: '100%',
      padding: '1.1rem 1rem 1.1rem 3.5rem',
      borderRadius: '1.2rem',
      border: '1.5px solid #e2e8f0',
      background: '#ffffff',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    icon: {
      position: 'absolute',
      left: '1.2rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      width: '18px',
    },
    buttonSubmit: {
      width: '100%',
      padding: '1.2rem',
      background: '#84cc16',
      color: '#fff',
      border: 'none',
      borderRadius: '1.2rem',
      fontWeight: '800',
      fontSize: '1rem',
      cursor: 'pointer',
      boxShadow: '0 12px 24px -8px rgba(132, 204, 22, 0.5)',
      marginTop: '1rem',
    },
    footer: {
      marginTop: '2rem',
      color: '#64748b',
      fontSize: '0.9rem',
    },
    loginLink: {
      color: '#84cc16',
      fontWeight: '700',
      textDecoration: 'none',
      cursor: 'pointer',
      marginLeft: '5px',
    }
  };

  return (
    <div style={styles.container}>
      {/* Elementos Decorativos Animados */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ ...styles.blob, top: '-15%', right: '-10%' }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 1 }}
        style={{ ...styles.blob, bottom: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(255,255,255,0) 70%)' }} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={styles.card}
      >
        <div style={styles.header}>
          <h1 style={styles.title}>Arachiz</h1>
          <div style={styles.accentBar} />
          <p style={{ color: '#64748b', fontWeight: 500 }}>Crea tu cuenta institucional</p>
        </div>

        <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input 
              style={styles.input} 
              type="text" 
              placeholder="Nombre completo" 
              onFocus={(e) => e.target.style.borderColor = '#84cc16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input 
              style={styles.input} 
              type="email" 
              placeholder="Correo electrónico" 
              onFocus={(e) => e.target.style.borderColor = '#84cc16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              style={styles.input} 
              type="password" 
              placeholder="Contraseña" 
              onFocus={(e) => e.target.style.borderColor = '#84cc16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: '#76b814' }}
            whileTap={{ scale: 0.98 }}
            style={styles.buttonSubmit}
            onClick={() => navigate('/')}
          >
            FINALIZAR REGISTRO
          </motion.button>
        </form>

        <div style={styles.footer}>
          ¿Ya tienes una cuenta? 
          <span style={styles.loginLink} onClick={() => navigate('/')}>
            Inicia sesión
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;