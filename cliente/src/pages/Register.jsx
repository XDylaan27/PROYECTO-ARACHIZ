import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', documento: '', email: '', password: '', rol: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al registrar');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      padding: '40px 0',
      boxSizing: 'border-box',
    },
    blob: {
      position: 'fixed',
      width: '700px',
      height: '700px',
      background: 'radial-gradient(circle, rgba(132,204,22,0.25) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      zIndex: 0,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.7)',
      padding: '3rem',
      borderRadius: '3rem',
      width: '100%',
      maxWidth: '560px',
      boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
      zIndex: 1,
      textAlign: 'center',
    },
    header: { marginBottom: '2rem' },
    title: { fontSize: '2.2rem', fontWeight: '900', color: '#166534', margin: 0, letterSpacing: '-1.5px' },
    accentBar: { width: '60px', height: '5px', background: '#84cc16', margin: '10px auto', borderRadius: '10px' },
    form: { display: 'grid', gap: '1rem' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    inputWrapper: { position: 'relative' },
    input: {
      width: '100%',
      padding: '1rem 1rem 1rem 3.2rem',
      borderRadius: '1.2rem',
      border: '1.5px solid #e2e8f0',
      background: '#ffffff',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    select: {
      width: '100%',
      padding: '1rem 1rem 1rem 3.2rem',
      borderRadius: '1.2rem',
      border: '1.5px solid #e2e8f0',
      background: '#ffffff',
      fontSize: '0.95rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      appearance: 'none',
      cursor: 'pointer',
    },
    icon: {
      position: 'absolute',
      left: '1.1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      width: '17px',
      pointerEvents: 'none',
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
      marginTop: '0.5rem',
    },
    footer: { marginTop: '1.5rem', color: '#64748b', fontSize: '0.9rem' },
    loginLink: { color: '#84cc16', fontWeight: '700', textDecoration: 'none', cursor: 'pointer', marginLeft: '5px' },
    sectionLabel: { textAlign: 'left', fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem', marginTop: '0.5rem' },
  };

  const focusStyle = (e) => (e.target.style.borderColor = '#84cc16');
  const blurStyle = (e) => (e.target.style.borderColor = '#e2e8f0');

  return (
    <div style={styles.container}>
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

        <form style={styles.form} onSubmit={handleSubmit}>

          {/* Rol */}
          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2z"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            <select name="rol" style={styles.select} onFocus={focusStyle} onBlur={blurStyle} value={form.rol} onChange={handleChange} required>
              <option value="" disabled>Seleccionar rol</option>
              <option value="instructor">Instructor</option>
              <option value="aprendiz">Aprendiz</option>
            </select>
          </div>

          {/* Nombre y Apellido */}
          <div style={styles.row}>
            <div style={styles.inputWrapper}>
              <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input name="nombre" style={styles.input} type="text" placeholder="Nombre" onFocus={focusStyle} onBlur={blurStyle} value={form.nombre} onChange={handleChange} required />
            </div>
            <div style={styles.inputWrapper}>
              <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input name="apellido" style={styles.input} type="text" placeholder="Apellido" onFocus={focusStyle} onBlur={blurStyle} value={form.apellido} onChange={handleChange} required />
            </div>
          </div>

          {/* Documento */}
          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>
            <input name="documento" style={styles.input} type="text" placeholder="Número de documento" onFocus={focusStyle} onBlur={blurStyle} value={form.documento} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input name="email" style={styles.input} type="email" placeholder="Correo electrónico" onFocus={focusStyle} onBlur={blurStyle} value={form.email} onChange={handleChange} required />
          </div>

          {/* Contraseña */}
          <div style={styles.inputWrapper}>
            <svg style={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input name="password" style={styles.input} type="password" placeholder="Contraseña" onFocus={focusStyle} onBlur={blurStyle} value={form.password} onChange={handleChange} required />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>{error}</p>}

          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: '#76b814' }}
            whileTap={{ scale: 0.98 }}
            style={styles.buttonSubmit}
            type="submit"
            disabled={loading}
          >
            {loading ? 'REGISTRANDO...' : 'FINALIZAR REGISTRO'}
          </motion.button>
        </form>

        <div style={styles.footer}>
          ¿Ya tienes una cuenta?
          <span style={styles.loginLink} onClick={() => navigate('/')}>Inicia sesión</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
