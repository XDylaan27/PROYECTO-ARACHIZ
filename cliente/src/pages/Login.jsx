import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Search } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Estilos Pro (CSS-in-JS)
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
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(132,204,22,0.3) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      zIndex: 0,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      padding: '3rem',
      borderRadius: '2.5rem',
      width: '90%',
      maxWidth: '400px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      zIndex: 1,
      textAlign: 'center',
    },
    logo: {
      fontSize: '3rem',
      fontWeight: '900',
      color: '#166534',
      margin: 0,
      letterSpacing: '-2px',
    },
    accentBar: {
      width: '50px',
      height: '6px',
      background: '#84cc16',
      margin: '12px auto 2rem',
      borderRadius: '10px',
    },
    inputWrapper: {
      position: 'relative',
      marginBottom: '1.2rem',
    },
    input: {
      width: '100%',
      padding: '1.1rem 1rem 1.1rem 3.5rem',
      borderRadius: '1.2rem',
      border: '1px solid #e2e8f0',
      background: '#ffffff',
      fontSize: '1rem',
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
    },
    buttonMain: {
      width: '100%',
      padding: '1.2rem',
      background: '#84cc16',
      color: '#fff',
      border: 'none',
      borderRadius: '1.2rem',
      fontWeight: '800',
      fontSize: '1rem',
      cursor: 'pointer',
      boxShadow: '0 10px 20px -5px rgba(132, 204, 22, 0.4)',
      marginTop: '1rem',
    },
    btnGoogle: {
      width: '100%',
      padding: '1rem',
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
      marginTop: '1.5rem',
      cursor: 'pointer',
      fontWeight: '600',
      color: '#475569',
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Navega a tu archivo Dash.jsx
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      {/* Manchas animadas de fondo */}
      <motion.div 
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{ ...styles.blob, top: '-10%', left: '-10%' }} 
      />
      <motion.div 
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        style={{ ...styles.blob, bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(22,101,52,0.15) 0%, rgba(255,255,255,0) 70%)' }} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <h1 style={styles.logo}>Arachiz</h1>
        <div style={styles.accentBar} />
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>SISTEMA DE GESTIÓN</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputWrapper}>
            <User size={20} style={styles.icon} />
            <input 
              style={styles.input} 
              type="text" 
              placeholder="Número de documento" 
              required 
              onFocus={(e) => e.target.style.borderColor = '#84cc16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={styles.inputWrapper}>
            <Lock size={20} style={styles.icon} />
            <input 
              style={styles.input} 
              type="password" 
              placeholder="Contraseña" 
              required 
              onFocus={(e) => e.target.style.borderColor = '#84cc16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={styles.buttonMain}
            type="submit"
          >
            INGRESAR
          </motion.button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>o continúe con</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <button style={styles.btnGoogle}>
          <search size={18} color="#4285F4" /> Google
        </button>

        <button 
          onClick={() => navigate('/register')}
          style={{ ...styles.buttonMain, background: 'none', color: '#166534', boxShadow: 'none', border: '1px solid #166534', marginTop: '1rem' }}
        >
          REGISTRARSE
        </button>
      </motion.div>
    </div>
  );
};

export default Login;