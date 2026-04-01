import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Importamos el Sidebar que arreglaste
import { BookOpen, Users, BarChart3 } from 'lucide-react';

const Dash = () => {
  const navigate = useNavigate();

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      background: '#f1f5f9', // Fondo sutil para que resalten las cards
    },
    mainContent: {
      marginLeft: '260px', // Espacio exacto para el Sidebar
      width: 'calc(100% - 260px)',
      padding: '40px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      background: '#fff',
      padding: '25px',
      borderRadius: '20px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    adminCard: {
      background: '#fff',
      padding: '30px',
      borderRadius: '25px',
      width: '45%',
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
    },
    chartCard: {
      background: '#166534',
      padding: '30px',
      borderRadius: '25px',
      width: '50%',
      color: '#fff',
      textAlign: 'center'
    },
    btnGreen: {
      width: '100%',
      padding: '15px',
      borderRadius: '12px',
      border: 'none',
      marginBottom: '15px',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      color: 'white'
    }
  };

  return (
    <div style={styles.layout}>
      {/* 1. Agregamos el Sidebar aquí */}
      <Sidebar />

      {/* 2. Contenido Principal */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={{ color: '#166534', fontWeight: '900', margin: 0 }}>Arachiz</h1>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: 'bold', display: 'block' }}>Dylan Garcia</span>
            <span style={{ color: '#84cc16', fontSize: '0.8rem' }}>Panel de Control</span>
          </div>
        </header>

        <h2 style={{ marginBottom: '30px' }}>Bienvenido al Sistema</h2>

        {/* Tarjetas de estadísticas */}
        <div style={styles.statsGrid}>
          <motion.div whileHover={{ y: -5 }} style={styles.statCard}>
            <Users color="#84cc16" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>FICHAS REGISTRADAS</span>
            <b style={{ fontSize: '1.5rem' }}>12</b>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} style={styles.statCard}>
            <BookOpen color="#84cc16" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>MATERIAS ACTIVAS</span>
            <b style={{ fontSize: '1.5rem' }}>8</b>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} style={styles.statCard}>
            <BarChart3 color="#84cc16" />
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ASISTENCIAS HOY</span>
            <b style={{ fontSize: '1.5rem' }}>85%</b>
          </motion.div>
        </div>

        {/* Sección de administración y gráfico */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={styles.adminCard}>
            <h3 style={{ color: '#166534', marginBottom: '20px' }}>Administración</h3>
            <button 
              onClick={() => navigate('/materias')}
              style={{ ...styles.btnGreen, background: '#84cc16' }}
            >
              <BookOpen size={18} /> Gestionar Materias
            </button>
            <button 
              onClick={() => navigate('/fichas')}
              style={{ ...styles.btnGreen, background: '#166534' }}
            >
              <Users size={18} /> Gestionar Fichas
            </button>
          </div>

          <div style={styles.chartCard}>
            <h3>Resumen de Actividad</h3>
            <div style={{ margin: '40px 0', fontSize: '3rem' }}>📊</div>
            <p>No hay reportes recientes para mostrar.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dash;