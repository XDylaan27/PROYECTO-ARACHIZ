import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, UserCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Fichas', icon: <Users size={20} />, path: '/fichas' },
    { name: 'Asistencia', icon: <CheckSquare size={20} />, path: '/asistencia' },
    { name: 'Mi Perfil', icon: <UserCircle size={20} />, path: '/perfil' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const styles = {
    sidebar: {
      width: '260px',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
    },
    logo: { fontSize: '1.8rem', fontWeight: '900', color: '#166534', marginBottom: '40px', textAlign: 'center' },
    navItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 18px',
      borderRadius: '14px',
      cursor: 'pointer',
      marginBottom: '8px',
      background: isActive ? 'rgba(132, 204, 22, 0.1)' : 'transparent',
      color: isActive ? '#166534' : '#64748b',
      fontWeight: isActive ? '700' : '500',
    }),
    logout: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Arachiz</h2>
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <motion.div
            key={item.path}
            whileHover={{ x: 5, background: 'rgba(132, 204, 22, 0.05)' }}
            style={styles.navItem(location.pathname === item.path)}
            onClick={() => navigate(item.path)}
          >
            {item.icon} {item.name}
          </motion.div>
        ))}
      </nav>
      <div style={styles.logout} onClick={handleLogout}>
        <LogOut size={20} /> Cerrar Sesión
      </div>
    </div>
  );
};

export default Sidebar;