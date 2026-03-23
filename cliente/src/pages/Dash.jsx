import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 1. Importamos el hook de navegación

const Dash = () => {
  const navigate = useNavigate(); // 2. Inicializamos el navegador

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100vw',
      background: '#f1f5f9',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden',
    },
    blob: {
      position: 'absolute',
      width: '600px',
      height: '600px',
      background: 'radial-gradient(circle, rgba(132,204,22,0.1) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      zIndex: 0,
    },
    navbar: {
      height: '80px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 50px',
      borderBottom: '1px solid #e2e8f0',
      zIndex: 10,
    },
    logo: { fontSize: '1.8rem', fontWeight: '900', color: '#166534', margin: 0, cursor: 'pointer' },
    userBox: { textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' },
    mainContent: { flex: 1, padding: '40px', zIndex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', marginBottom: '40px' },
    card: { background: 'white', padding: '25px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' },
    btnPrimary: {
      width: '100%', padding: '15px', background: '#84cc16', color: 'white', border: 'none', 
      borderRadius: '16px', fontWeight: '800', cursor: 'pointer', marginBottom: '15px', fontSize: '1rem'
    },
    btnSecondary: {
      width: '100%', padding: '15px', background: '#166534', color: 'white', border: 'none', 
      borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Decoración de fondo */}
      <div style={{ ...styles.blob, top: '-10%', right: '-10%' }} />
      <div style={{ ...styles.blob, bottom: '-10%', left: '-10%', background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, rgba(255,255,255,0) 70%)' }} />

      <header style={styles.navbar}>
        <h1 style={styles.logo} onClick={() => navigate('/dashboard')}>Arachiz</h1>
        <div style={styles.userBox}>
          <div>
            <div style={{ fontWeight: '800', color: '#1e293b' }}>Usuario</div>
            <div style={{ fontSize: '0.8rem', color: '#84cc16', fontWeight: 'bold' }}>Panel de Control</div>
          </div>
          <button 
            onClick={() => navigate('/')} 
            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '8px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Salir
          </button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ color: '#0f172a', marginBottom: '30px' }}>Bienvenido al Sistema</h2>

          {/* Estadísticas Rápidas */}
          <div style={styles.grid}>
            <StatCard icon="🆔" label="Fichas Registradas" val="--" />
            <StatCard icon="📚" label="Materias Activas" val="--" />
            <StatCard icon="✅" label="Asistencias Hoy" val="--" />
          </div>

          {/* Menú de Navegación a CRUDs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div style={{ ...styles.card, textAlign: 'left' }}>
              <h3 style={{ marginTop: 0, color: '#166534' }}>Administración</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>
                Accede a los módulos de gestión para configurar el sistema.
              </p>
              
              {/* BOTONES CON NAVEGACIÓN */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.btnPrimary}
                onClick={() => navigate('/materias')} // Navega a Materias
              >
                📚 Gestionar Materias
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={styles.btnSecondary}
                onClick={() => navigate('/fichas')} // Navega a Fichas
              >
                🆔 Gestionar Fichas
              </motion.button>
            </div>

            <div style={{ ...styles.card, background: '#166534', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3>Resumen de Actividad</h3>
              <p style={{ opacity: 0.8 }}>No hay reportes recientes para mostrar.</p>
              <div style={{ fontSize: '3rem', marginTop: '10px' }}>📊</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// Componente auxiliar para las tarjetitas de arriba
const StatCard = ({ icon, label, val }) => (
  <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
    <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{icon}</div>
    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1e293b' }}>{val}</div>
    <div style={{ color: '#64748b', fontWeight: '600', fontSize: '0.8rem', textTransform: 'uppercase' }}>{label}</div>
  </div>
);

export default Dash;