import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para el formulario
  const [formData, setFormData] = useState({
    documento: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Éxito: Guardar usuario en localStorage (Simulación de sesión)
        localStorage.setItem('usuarioActivo', JSON.stringify(result.usuario));
        
        // Redirigir al dashboard (aquí luego podrías diferenciar por rol)
        navigate('/dashboard');
      } else {
        // ❌ Error desde el backend (Usuario no encontrado o contraseña incorrecta)
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor. Verifica que esté encendido.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos (Mismos que tenías)
  const styles = {
    container: { height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" },
    blob: { position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(132,204,22,0.3) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 0 },
    card: { background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.6)', padding: '3.5rem', borderRadius: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', zIndex: 1, textAlign: 'center' },
    logo: { fontSize: '3rem', fontWeight: '900', color: '#166534', margin: 0, letterSpacing: '-2px' },
    accentBar: { width: '50px', height: '6px', background: '#84cc16', margin: '12px auto 2.5rem', borderRadius: '10px' },
    inputWrapper: { position: 'relative', marginBottom: '1.2rem' },
    input: { width: '100%', padding: '1.1rem 1rem 1.1rem 3.5rem', borderRadius: '1.2rem', border: '1px solid #e2e8f0', background: '#ffffff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxSizing: 'border-box' },
    icon: { position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', width: '20px' },
    buttonMain: { width: '100%', padding: '1.2rem', background: '#84cc16', color: '#fff', border: 'none', borderRadius: '1.2rem', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(132, 204, 22, 0.4)', marginTop: '1rem', opacity: loading ? 0.7 : 1 },
    buttonGoogle: { width: '100%', padding: '1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '1.5rem', cursor: 'pointer', fontWeight: '600', color: '#475569' },
    link: { display: 'block', marginTop: '1.5rem', color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' },
    errorMsg: { color: '#ef4444', fontSize: '0.9rem', marginTop: '1rem', background: '#fef2f2', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca' }
  };

  return (
    <div style={styles.container}>
      <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} style={{ ...styles.blob, top: '-10%', left: '-10%' }} />
      <motion.div animate={{ x: [0, -40, 0], y: [0, -50, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }} style={{ ...styles.blob, bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(255,255,255,0) 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={styles.card}>
        <h1 style={styles.logo}>Arachiz</h1>
        <div style={styles.accentBar} />
        <p style={{ color: '#64748b', marginBottom: '2.5rem', fontWeight: 500 }}>Bienvenido de nuevo</p>

        <form onSubmit={handleLogin}>
          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input 
              style={styles.input} 
              type="text" 
              name="documento"
              value={formData.documento}
              onChange={handleChange}
              placeholder="Número de documento" 
              onFocus={(e) => (e.target.style.borderColor = '#84cc16')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              required 
            />
          </div>

          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input 
              style={styles.input} 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña" 
              onFocus={(e) => (e.target.style.borderColor = '#84cc16')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
              required 
            />
          </div>

          {error && <div style={styles.errorMsg}>{error}</div>}

          <motion.button 
            whileHover={{ scale: loading ? 1 : 1.03, backgroundColor: loading ? '#84cc16' : '#76b814' }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            style={styles.buttonMain}
            type="submit"
            disabled={loading}
          >
            {loading ? 'VERIFICANDO...' : 'INGRESAR'}
          </motion.button>
        </form>

        <a href="#forgot" style={styles.link}>¿Olvidaste tu contraseña?</a>

        <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', color: '#cbd5e1' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ padding: '0 1rem', fontSize: '0.8rem' }}>o</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <button style={styles.buttonGoogle} disabled>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google (Próximamente)
        </button>

        <motion.button 
          onClick={() => navigate('/register')}
          style={{ ...styles.buttonMain, background: 'transparent', border: '2px solid #84cc16', color: '#84cc16', boxShadow: 'none', marginTop: '1.5rem' }}
          whileHover={{ backgroundColor: 'rgba(132, 204, 22, 0.05)' }}
          type="button"
        >
          REGISTRARSE
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;