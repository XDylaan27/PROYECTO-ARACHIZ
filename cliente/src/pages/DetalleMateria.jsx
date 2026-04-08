import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, StopCircle, ChevronDown, ChevronUp, Users, Clock, Search } from 'lucide-react';

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200,
};
const inputBase = {
  padding: '9px 12px', borderRadius: '10px', border: '1px solid #e2e8f0',
  fontSize: '0.88rem', outline: 'none', background: 'white',
};

const DetalleMateria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [materia, setMateria] = useState(null);
  const [sesiones, setSesiones] = useState([]);
  const [sesionAbierta, setSesionAbierta] = useState(null);
  const [sesionExpandida, setSesionExpandida] = useState(null);
  const [registrosSesion, setRegistrosSesion] = useState({});
  const [busquedaRegistro, setBusquedaRegistro] = useState({});
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroHoraDesde, setFiltroHoraDesde] = useState('');
  const [filtroHoraHasta, setFiltroHoraHasta] = useState('');
  const [observacion, setObservacion] = useState('');
  const [showModalAbrir, setShowModalAbrir] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarMateria = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/materias/${id}`, { headers: { 'x-user-id': user.id } });
      const data = await res.json();
      if (data.success) setMateria(data.materia);
    } catch (err) { console.error(err); }
  }, [id]);

  const cargarSesiones = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/asistencia/sesiones/materia/${id}`, { headers: { 'x-user-id': user.id } });
      const data = await res.json();
      if (data.success) {
        setSesiones(data.sesiones);
        setSesionAbierta(data.sesiones.find(s => s.estado === 'abierta') || null);
      }
    } catch (err) { console.error(err); }
  }, [id]);

  useEffect(() => { cargarMateria(); cargarSesiones(); }, [cargarMateria, cargarSesiones]);

  const handleAbrirSesion = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/asistencia/sesiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ materia_id: id, observacion: observacion || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al abrir sesión');
      setShowModalAbrir(false); setObservacion(''); cargarSesiones();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCerrarSesion = async () => {
    if (!sesionAbierta) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/asistencia/sesiones/${sesionAbierta.id}/cerrar`, {
        method: 'PUT', headers: { 'x-user-id': user.id },
      });
      if (!res.ok) throw new Error();
      cargarSesiones();
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleSesion = async (sesionId) => {
    if (sesionExpandida === sesionId) { setSesionExpandida(null); return; }
    setSesionExpandida(sesionId);
    if (registrosSesion[sesionId]) return;
    try {
      const res = await fetch(`http://localhost:3000/api/asistencia/sesiones/${sesionId}/registros`, { headers: { 'x-user-id': user.id } });
      const data = await res.json();
      if (data.success) setRegistrosSesion(prev => ({ ...prev, [sesionId]: data.registros }));
    } catch (err) { console.error(err); }
  };

  const badgeColor = (tipo) => tipo === 'transversal'
    ? { background: '#e0f2fe', color: '#0369a1' }
    : { background: '#dcfce7', color: '#166534' };

  const formatHora = (ts) => ts ? new Date(ts).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) : '-';
  const formatFecha = (ts) => ts ? new Date(ts).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const getFechaISO = (ts) => ts ? new Date(ts).toISOString().slice(0, 10) : '';
  const getHoraNum = (ts) => ts ? new Date(ts).getHours() * 60 + new Date(ts).getMinutes() : 0;
  const horaToMin = (h) => { if (!h) return null; const [hh, mm] = h.split(':').map(Number); return hh * 60 + mm; };

  const sesionesFiltradas = sesiones.filter(s => {
    if (filtroFecha && getFechaISO(s.hora_inicio) !== filtroFecha) return false;
    const desde = horaToMin(filtroHoraDesde);
    const hasta = horaToMin(filtroHoraHasta);
    const horaS = getHoraNum(s.hora_inicio);
    if (desde !== null && horaS < desde) return false;
    if (hasta !== null && horaS > hasta) return false;
    return true;
  });

  const filtrarRegistros = (sesionId, registros) => {
    const q = (busquedaRegistro[sesionId] || '').toLowerCase();
    if (!q) return registros;
    return registros.filter(r =>
      r.nombre?.toLowerCase().includes(q) ||
      r.apellido?.toLowerCase().includes(q) ||
      r.documento?.toLowerCase().includes(q) ||
      r.estado?.toLowerCase().includes(q)
    );
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px' }}>

        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Volver
        </button>

        {/* Info materia */}
        {materia && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: '24px', padding: '28px 32px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ color: '#166534', margin: '0 0 8px', fontWeight: '900', fontSize: '1.7rem' }}>{materia.nombre_materia}</h1>
              {materia.tipo_materia && (
                <span style={{ ...badgeColor(materia.tipo_materia), padding: '5px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                  {materia.tipo_materia}
                </span>
              )}
            </div>
            {sesionAbierta ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '12px', padding: '8px 16px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#eab308', borderRadius: '50%', display: 'inline-block' }} />
                  <span style={{ color: '#854d0e', fontWeight: '700', fontSize: '0.85rem' }}>Sesión abierta</span>
                  <span style={{ color: '#a16207', fontSize: '0.8rem' }}>desde {formatHora(sesionAbierta.hora_inicio)}</span>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleCerrarSesion} disabled={loading}
                  style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                  <StopCircle size={18} /> Cerrar Sesión
                </motion.button>
              </div>
            ) : (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setError(''); setShowModalAbrir(true); }}
                style={{ background: '#84cc16', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                <PlayCircle size={18} /> Abrir Sesión de Asistencia
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Historial de sesiones */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '28px 32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock color="#84cc16" size={22} />
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Historial de Sesiones</h2>
            </div>
            {/* Filtros */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <input type="date" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}
                style={inputBase} title="Filtrar por fecha"
                onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              <input type="time" value={filtroHoraDesde} onChange={(e) => setFiltroHoraDesde(e.target.value)}
                style={{ ...inputBase, minWidth: '110px' }} placeholder="Desde" title="Hora desde"
                onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              <input type="time" value={filtroHoraHasta} onChange={(e) => setFiltroHoraHasta(e.target.value)}
                style={{ ...inputBase, minWidth: '110px' }} placeholder="Hasta" title="Hora hasta"
                onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
              {(filtroFecha || filtroHoraDesde || filtroHoraHasta) && (
                <button onClick={() => { setFiltroFecha(''); setFiltroHoraDesde(''); setFiltroHoraHasta(''); }}
                  style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: '#64748b', fontSize: '0.82rem', fontWeight: '600' }}>
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {sesionesFiltradas.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0', margin: 0 }}>
              {sesiones.length === 0 ? 'No hay sesiones registradas aún.' : 'No hay sesiones con ese filtro.'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sesionesFiltradas.map(sesion => (
                <div key={sesion.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                  <div onClick={() => sesion.estado === 'cerrada' && toggleSesion(sesion.id)}
                    style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: sesion.estado === 'cerrada' ? 'pointer' : 'default', background: sesionExpandida === sesion.id ? '#f8fafc' : 'white' }}>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: '700', color: '#1e293b', fontSize: '0.95rem' }}>
                        {formatFecha(sesion.hora_inicio)} · {formatHora(sesion.hora_inicio)}
                        {sesion.hora_fin && ` — ${formatHora(sesion.hora_fin)}`}
                      </p>
                      {sesion.observacion && <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{sesion.observacion}</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {sesion.estado === 'abierta' ? (
                        <span style={{ background: '#fef9c3', color: '#854d0e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid #fde047' }}>Abierta</span>
                      ) : (
                        <>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Asistencia</span>
                            <p style={{ margin: 0, fontWeight: '800', color: '#166534', fontSize: '1rem' }}>
                              {sesion.total_asistieron}/{sesion.total_aprendices}
                            </p>
                          </div>
                          <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid #bbf7d0' }}>Cerrada</span>
                          {sesionExpandida === sesion.id ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                        </>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {sesionExpandida === sesion.id && registrosSesion[sesion.id] && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ borderTop: '1px solid #f1f5f9', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Users size={16} color="#84cc16" />
                              <span style={{ fontWeight: '700', color: '#475569', fontSize: '0.85rem' }}>REGISTROS</span>
                            </div>
                            {/* Buscador dentro de la sesión */}
                            <div style={{ position: 'relative' }}>
                              <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={15} />
                              <input type="text" placeholder="Buscar aprendiz..."
                                value={busquedaRegistro[sesion.id] || ''}
                                onChange={(e) => setBusquedaRegistro(prev => ({ ...prev, [sesion.id]: e.target.value }))}
                                style={{ ...inputBase, paddingLeft: '32px', minWidth: '200px' }}
                                onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                            </div>
                          </div>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                              <tr style={{ color: '#94a3b8', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                                <th style={{ padding: '8px 12px', fontWeight: '600' }}>APRENDIZ</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600' }}>DOCUMENTO</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600' }}>ESTADO</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600' }}>MÉTODO</th>
                                <th style={{ padding: '8px 12px', fontWeight: '600' }}>HORA</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtrarRegistros(sesion.id, registrosSesion[sesion.id]).length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '16px 12px', textAlign: 'center', color: '#94a3b8' }}>Sin resultados</td></tr>
                              ) : (
                                filtrarRegistros(sesion.id, registrosSesion[sesion.id]).map(r => (
                                  <tr key={`${r.documento}-${sesion.id}`} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '10px 12px', fontWeight: '600', color: '#1e293b' }}>{r.nombre} {r.apellido}</td>
                                    <td style={{ padding: '10px 12px', color: '#64748b' }}>{r.documento}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                      <span style={{
                                        background: r.estado === 'asistio' ? '#dcfce7' : '#fee2e2',
                                        color: r.estado === 'asistio' ? '#166534' : '#dc2626',
                                        padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700'
                                      }}>
                                        {r.estado === 'asistio' ? 'Asistió' : 'Falla'}
                                      </span>
                                    </td>
                                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '0.85rem', textTransform: 'capitalize' }}>
                                      {r.estado === 'asistio' ? r.metodo : '—'}
                                    </td>
                                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '0.85rem' }}>{formatHora(r.hora_marcado)}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showModalAbrir && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              style={{ background: 'white', padding: '40px', borderRadius: '28px', width: '90%', maxWidth: '420px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)' }}>
              <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '1.3rem' }}>Abrir Sesión de Asistencia</h3>
              <p style={{ color: '#64748b', marginBottom: '24px', marginTop: 0, fontSize: '0.9rem' }}>
                Los aprendices podrán marcar asistencia mientras la sesión esté abierta.
              </p>
              <form onSubmit={handleAbrirSesion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>Observación (opcional)</label>
                  <input type="text" value={observacion} onChange={(e) => setObservacion(e.target.value)}
                    placeholder="Ej: Clase de repaso, Parcial..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => { setShowModalAbrir(false); setObservacion(''); setError(''); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#84cc16', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Abriendo...' : 'Abrir Sesión'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetalleMateria;
