import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, BookOpen, Hash } from 'lucide-react';

const DashboardAprendiz = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [fichas, setFichas] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState('');
  const [exitoCodigo, setExitoCodigo] = useState('');

  const cargarFichas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/invitacion/mis-fichas', {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) setFichas(data.fichas);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarFichas(); }, []);

  const handleUnirse = async (e) => {
    e.preventDefault();
    setErrorCodigo('');
    setExitoCodigo('');
    setLoadingCodigo(true);
    try {
      const res = await fetch('http://localhost:3000/api/invitacion/unirse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ codigo_invitacion: codigo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código inválido');
      setExitoCodigo(`Te uniste a la ficha ${data.ficha.numero_ficha} — ${data.ficha.programa}`);
      setCodigo('');
      cargarFichas();
    } catch (err) { setErrorCodigo(err.message); }
    finally { setLoadingCodigo(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#166534', fontWeight: '900', fontSize: '1.5rem' }}>Arachiz</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: '700', display: 'block', color: '#1e293b' }}>{user.nombre} {user.apellido}</span>
            <span style={{ color: '#84cc16', fontSize: '0.8rem', fontWeight: '600' }}>Aprendiz</span>
          </div>
          <button onClick={handleLogout}
            style={{ background: 'none', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Unirse con código */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: '24px', padding: '32px', marginBottom: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Hash color="#84cc16" size={22} />
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Unirse a una Ficha</h2>
          </div>
          <p style={{ color: '#64748b', marginBottom: '20px', marginTop: 0 }}>
            Ingresa el código de invitación que te proporcionó tu instructor.
          </p>
          <form onSubmit={handleUnirse} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Ej: A3F2B1C4"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              required
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none', letterSpacing: '2px', fontWeight: '700' }}
              onFocus={(e) => e.target.style.borderColor = '#84cc16'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loadingCodigo}
              style={{ padding: '12px 24px', background: '#84cc16', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {loadingCodigo ? 'Verificando...' : 'Unirse'}
            </motion.button>
          </form>
          <AnimatePresence>
            {errorCodigo && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '12px', marginBottom: 0 }}>
                {errorCodigo}
              </motion.p>
            )}
            {exitoCodigo && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ color: '#166534', fontSize: '0.9rem', marginTop: '12px', marginBottom: 0, fontWeight: '600' }}>
                ✓ {exitoCodigo}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Mis fichas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <BookOpen color="#84cc16" size={22} />
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Mis Fichas</h2>
          </div>

          {fichas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0', margin: 0 }}>
              Aún no estás inscrito en ninguna ficha. Usa el código de invitación de tu instructor.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fichas.map(ficha => (
                <div key={ficha.id} style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#1e293b' }}>Ficha {ficha.numero_ficha}</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{ficha.programa} · {ficha.nivel}</p>
                  </div>
                  {ficha.jornada && (
                    <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {ficha.jornada}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardAprendiz;
