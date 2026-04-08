import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, BookOpen, Hash, ArrowLeft, Info, CheckCircle } from 'lucide-react';

const Header = ({ user, onLogout }) => (
  <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{ margin: 0, color: '#166534', fontWeight: '900', fontSize: '1.5rem' }}>Arachiz</h1>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontWeight: '700', display: 'block', color: '#1e293b' }}>{user.nombre} {user.apellido}</span>
        <span style={{ color: '#84cc16', fontSize: '0.8rem', fontWeight: '600' }}>Aprendiz</span>
      </div>
      <button onClick={onLogout}
        style={{ background: 'none', border: '1px solid #e2e8f0', color: '#64748b', padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', fontSize: '0.85rem' }}>
        <LogOut size={16} /> Salir
      </button>
    </div>
  </div>
);

const DashboardAprendiz = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [fichas, setFichas] = useState(null);       // null=cargando, []=sin ficha
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [sesionAbierta, setSesionAbierta] = useState(null);
  const [yaMarco, setYaMarco] = useState(false);
  const [loadingAsistencia, setLoadingAsistencia] = useState(false);
  const [misRegistros, setMisRegistros] = useState([]);
  const [codigo, setCodigo] = useState('');
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState('');

  const cargarFichas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/invitacion/mis-fichas', {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) {
        setFichas(data.fichas);
        if (data.fichas.length > 0) cargarMaterias(data.fichas[0].id);
      }
    } catch (err) { console.error(err); }
  };

  const cargarMaterias = async (fichaId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/materias?ficha_id=${fichaId}`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) setMaterias(data.materias);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { cargarFichas(); }, []);

  const handleUnirse = async (e) => {
    e.preventDefault();
    setErrorCodigo('');
    setLoadingCodigo(true);
    try {
      const res = await fetch('http://localhost:3000/api/invitacion/unirse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ codigo_invitacion: codigo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Código inválido');
      setCodigo('');
      cargarFichas();
    } catch (err) { setErrorCodigo(err.message); }
    finally { setLoadingCodigo(false); }
  };

  const handleVerMateria = async (materia) => {
    setMateriaSeleccionada(materia);
    setSesionAbierta(null);
    setYaMarco(false);
    setMisRegistros([]);
    try {
      const [resSesion, resRegistros] = await Promise.all([
        fetch(`http://localhost:3000/api/asistencia/sesion-abierta/${materia.id}`, { headers: { 'x-user-id': user.id } }),
        fetch(`http://localhost:3000/api/asistencia/mis-registros/${materia.id}`, { headers: { 'x-user-id': user.id } }),
      ]);
      const [dataSesion, dataRegistros] = await Promise.all([resSesion.json(), resRegistros.json()]);
      if (dataSesion.success) { setSesionAbierta(dataSesion.sesion); setYaMarco(dataSesion.ya_marco || false); }
      if (dataRegistros.success) setMisRegistros(dataRegistros.registros);
    } catch (err) { console.error(err); }
  };

  const handleMarcarAsistencia = async () => {
    if (!sesionAbierta) return;
    setLoadingAsistencia(true);
    try {
      const res = await fetch('http://localhost:3000/api/asistencia/marcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ sesion_id: sesionAbierta.id }),
      });
      if (res.ok) setYaMarco(true);
    } catch (err) { console.error(err); }
    finally { setLoadingAsistencia(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const badgeColor = (tipo) => tipo === 'transversal'
    ? { background: '#e0f2fe', color: '#0369a1' }
    : { background: '#dcfce7', color: '#166534' };

  const formatHora = (ts) => ts ? new Date(ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '';

  // Cargando
  if (fichas === null) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
        <Header user={user} onLogout={handleLogout} />
        <p style={{ textAlign: 'center', marginTop: '80px', color: '#94a3b8' }}>Cargando...</p>
      </div>
    );
  }

  const ficha = fichas[0] || null;

  // Vista detalle de materia
  if (materiaSeleccionada) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
        <Header user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
          <button onClick={() => setMateriaSeleccionada(null)}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowLeft size={18} /> Volver a mis materias
          </button>

          {/* Info materia */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: '24px', padding: '28px 32px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#166534', margin: '0 0 10px', fontWeight: '900', fontSize: '1.5rem' }}>
              {materiaSeleccionada.nombre_materia}
            </h2>
            {materiaSeleccionada.tipo_materia && (
              <span style={{ ...badgeColor(materiaSeleccionada.tipo_materia), padding: '5px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                {materiaSeleccionada.tipo_materia}
              </span>
            )}
            <div style={{ marginTop: '20px', background: '#f8fafc', borderRadius: '14px', padding: '14px 18px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Ficha</span>
              <p style={{ margin: '4px 0 0', fontWeight: '600', color: '#1e293b' }}>
                {ficha?.numero_ficha} — {ficha?.programa}
              </p>
            </div>
          </motion.div>

          {/* Sesión de asistencia */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: 'white', borderRadius: '24px', padding: '28px 32px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#1e293b', fontSize: '1.1rem' }}>Asistencia</h3>

            {!sesionAbierta ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ color: '#94a3b8', margin: 0 }}>No hay ninguna sesión de asistencia abierta en este momento.</p>
              </div>
            ) : yaMarco ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <CheckCircle size={40} color="#166534" style={{ marginBottom: '12px' }} />
                <p style={{ color: '#166534', fontWeight: '700', fontSize: '1.1rem', margin: '0 0 4px' }}>¡Asistencia marcada!</p>
                <p style={{ color: '#4ade80', margin: 0, fontSize: '0.9rem' }}>
                  Sesión abierta desde {formatHora(sesionAbierta.hora_inicio)}
                  {sesionAbierta.observacion && ` · ${sesionAbierta.observacion}`}
                </p>
              </div>
            ) : (
              <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                <p style={{ color: '#854d0e', fontWeight: '700', fontSize: '1rem', margin: '0 0 6px' }}>
                  Sesión abierta desde {formatHora(sesionAbierta.hora_inicio)}
                </p>
                {sesionAbierta.observacion && (
                  <p style={{ color: '#a16207', margin: '0 0 20px', fontSize: '0.9rem' }}>{sesionAbierta.observacion}</p>
                )}
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={handleMarcarAsistencia} disabled={loadingAsistencia}
                  style={{ background: '#166534', color: 'white', border: 'none', padding: '14px 32px', borderRadius: '14px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}>
                  {loadingAsistencia ? 'Marcando...' : '✓ Marcar mi Asistencia'}
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Mi historial en esta materia */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: 'white', borderRadius: '24px', padding: '28px 32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 20px', color: '#1e293b', fontSize: '1.1rem' }}>Mi Historial de Asistencia</h3>
            {misRegistros.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0', margin: 0 }}>No hay sesiones registradas aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {misRegistros.map(r => (
                  <div key={r.id} style={{ background: '#f8fafc', borderRadius: '14px', padding: '14px 18px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: '0 0 3px', fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                        {r.sesion ? new Date(r.sesion.hora_inicio).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        {r.sesion?.hora_inicio && ` · ${formatHora(r.sesion.hora_inicio)}`}
                        {r.sesion?.hora_fin && ` — ${formatHora(r.sesion.hora_fin)}`}
                      </p>
                      {r.sesion?.observacion && <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>{r.sesion.observacion}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {r.estado === 'asistio' && (
                        <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
                          {formatHora(r.hora_marcado)} · {r.metodo}
                        </span>
                      )}
                      <span style={{
                        background: r.estado === 'asistio' ? '#dcfce7' : '#fee2e2',
                        color: r.estado === 'asistio' ? '#166534' : '#dc2626',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700'
                      }}>
                        {r.estado === 'asistio' ? 'Asistió' : 'Falla'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Sin ficha — solo campo de código
  if (!ficha) {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
        <Header user={user} onLogout={handleLogout} />
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#f0fdf4', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Hash color="#84cc16" size={28} />
            </div>
            <h2 style={{ color: '#1e293b', margin: '0 0 8px', fontSize: '1.4rem' }}>Únete a tu ficha</h2>
            <p style={{ color: '#64748b', marginBottom: '28px', marginTop: 0 }}>
              Ingresa el código de invitación que te proporcionó tu instructor.
            </p>
            <form onSubmit={handleUnirse} style={{ display: 'flex', gap: '12px' }}>
              <input type="text" placeholder="Ej: A3F2B1C4" value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())} required
                style={{ flex: 1, padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '1.1rem', outline: 'none', letterSpacing: '3px', fontWeight: '800', textAlign: 'center' }}
                onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loadingCodigo}
                style={{ padding: '14px 24px', background: '#84cc16', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.95rem' }}>
                {loadingCodigo ? 'Verificando...' : 'Unirse'}
              </motion.button>
            </form>
            <AnimatePresence>
              {errorCodigo && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '12px', marginBottom: 0 }}>{errorCodigo}</motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    );
  }

  // Con ficha — dashboard con materias
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: "'Inter', sans-serif" }}>
      <Header user={user} onLogout={handleLogout} />
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Info ficha */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'white', borderRadius: '24px', padding: '24px 28px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Tu Ficha</p>
            <h2 style={{ margin: '0 0 4px', color: '#166534', fontWeight: '900' }}>Ficha {ficha.numero_ficha}</h2>
            <p style={{ margin: 0, color: '#64748b' }}>{ficha.programa} · {ficha.nivel}</p>
          </div>
          {ficha.jornada && (
            <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #bbf7d0' }}>
              {ficha.jornada}
            </span>
          )}
        </motion.div>

        {/* Materias */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: 'white', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <BookOpen color="#84cc16" size={22} />
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Mis Materias</h3>
          </div>

          {materias.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0', margin: 0 }}>
              No hay materias registradas para esta ficha aún.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {materias.map(materia => (
                <div key={materia.id} style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{materia.nombre_materia}</span>
                    {materia.tipo_materia && (
                      <span style={{ ...badgeColor(materia.tipo_materia), padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>
                        {materia.tipo_materia}
                      </span>
                    )}
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleVerMateria(materia)}
                    style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '7px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}>
                    <Info size={14} /> Ver info
                  </motion.button>
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
