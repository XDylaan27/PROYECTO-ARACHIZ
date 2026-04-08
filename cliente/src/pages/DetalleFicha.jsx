import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, BookOpen, Trash2, Edit, Users, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FORM_MATERIA_INICIAL = { nombre_materia: '', tipo_materia: '' };

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)',
  display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200,
};
const modalBase = {
  background: 'white', padding: '40px', borderRadius: '28px',
  width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
  maxHeight: '90vh', overflowY: 'auto',
};

const DetalleFicha = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [ficha, setFicha] = useState(null);
  const [materias, setMaterias] = useState([]);
  const [aprendices, setAprendices] = useState([]);
  const [showModalMateria, setShowModalMateria] = useState(false);
  const [showModalEditar, setShowModalEditar] = useState(false);
  const [formMateria, setFormMateria] = useState(FORM_MATERIA_INICIAL);
  const [formEditar, setFormEditar] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  const cargarFicha = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/fichas/${id}`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) {
        setFicha(data.ficha);
        setFormEditar({
          numero_ficha: data.ficha.numero_ficha,
          programa: data.ficha.programa,
          nivel: data.ficha.nivel,
          jornada: data.ficha.jornada || '',
          region: data.ficha.region || '',
          centro_formacion: data.ficha.centro_formacion || '',
          duracion_meses: data.ficha.duracion_meses || '',
        });
      }
    } catch (err) { console.error('Error al cargar ficha:', err); }
  };

  const cargarMaterias = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/materias?ficha_id=${id}`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) setMaterias(data.materias);
    } catch (err) { console.error('Error al cargar materias:', err); }
  };

  const cargarAprendices = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/invitacion/aprendices/${id}`, {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) setAprendices(data.aprendices);
    } catch (err) { console.error('Error al cargar aprendices:', err); }
  };

  useEffect(() => {
    cargarFicha();
    cargarMaterias();
    cargarAprendices();
  }, [id]);

  const handleCrearMateria = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/materias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify({ ...formMateria, ficha_id: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear materia');
      setShowModalMateria(false);
      setFormMateria(FORM_MATERIA_INICIAL);
      cargarMaterias();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleEditarFicha = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/fichas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(formEditar),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al editar ficha');
      setShowModalEditar(false);
      cargarFicha();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(ficha.codigo_invitacion);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const badgeColor = (tipo) => tipo === 'transversal'
    ? { background: '#e0f2fe', color: '#0369a1' }
    : { background: '#dcfce7', color: '#166534' };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px' }}>

        <button onClick={() => navigate('/fichas')}
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ← Volver a Fichas
        </button>

        {/* Info de la ficha */}
        {ficha && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'white', borderRadius: '24px', padding: '30px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ color: '#166534', margin: '0 0 6px 0', fontSize: '1.8rem', fontWeight: '900' }}>
                  Ficha {ficha.numero_ficha}
                </h1>
                <p style={{ color: '#64748b', margin: 0, fontSize: '1rem' }}>{ficha.programa}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {ficha.jornada && (
                  <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', border: '1px solid #bbf7d0' }}>
                    {ficha.jornada}
                  </span>
                )}
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setError(''); setShowModalEditar(true); }}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <Edit size={15} /> Editar
                </motion.button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginTop: '24px' }}>
              {[
                { label: 'Nivel', value: ficha.nivel },
                { label: 'Región', value: ficha.region },
                { label: 'Centro de Formación', value: ficha.centro_formacion },
                { label: 'Duración', value: ficha.duracion_meses ? `${ficha.duracion_meses} meses` : null },
              ].filter(item => item.value).map(item => (
                <div key={item.label} style={{ background: '#f8fafc', borderRadius: '14px', padding: '14px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>{item.label}</span>
                  <p style={{ margin: '4px 0 0', fontWeight: '600', color: '#1e293b' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Código de invitación */}
            {ficha.codigo_invitacion && (
              <div style={{ marginTop: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '700', textTransform: 'uppercase' }}>Código de Invitación</span>
                  <p style={{ margin: '4px 0 0', fontWeight: '800', color: '#166534', fontSize: '1.3rem', letterSpacing: '3px' }}>{ficha.codigo_invitacion}</p>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={copiarCodigo}
                  style={{ background: copiado ? '#166534' : 'white', color: copiado ? 'white' : '#166534', border: '1px solid #166534', padding: '8px 16px', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', transition: 'all 0.2s' }}>
                  {copiado ? <><Check size={15} /> Copiado</> : <><Copy size={15} /> Copiar</>}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Materias */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', marginBottom: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BookOpen color="#84cc16" size={22} />
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Materias</h2>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setError(''); setShowModalMateria(true); }}
              style={{ background: '#84cc16', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
              <Plus size={16} /> Agregar Materia
            </motion.button>
          </div>

          {materias.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>No hay materias registradas para esta ficha</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 16px' }}>NOMBRE</th>
                  <th>TIPO</th>
                  <th style={{ textAlign: 'center' }}>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {materias.map(materia => (
                  <tr key={materia.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{materia.nombre_materia}</td>
                    <td>
                      {materia.tipo_materia && (
                        <span style={{ ...badgeColor(materia.tipo_materia), padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>
                          {materia.tipo_materia}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '14px' }}>
                      <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Aprendices */}
        <div style={{ background: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Users color="#84cc16" size={22} />
            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.2rem' }}>Aprendices ({aprendices.length})</h2>
          </div>

          {aprendices.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>Ningún aprendiz se ha unido aún. Comparte el código de invitación.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 16px' }}>NOMBRE</th>
                  <th>DOCUMENTO</th>
                  <th>EMAIL</th>
                  <th>FECHA DE UNIÓN</th>
                </tr>
              </thead>
              <tbody>
                {aprendices.map(a => (
                  <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{a.nombre} {a.apellido}</td>
                    <td>{a.documento}</td>
                    <td style={{ color: '#64748b' }}>{a.email}</td>
                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      {a.fecha_union ? new Date(a.fecha_union).toLocaleDateString('es-CO') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Modal agregar materia */}
      <AnimatePresence>
        {showModalMateria && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ ...modalBase, maxWidth: '440px' }}>
              <h3 style={{ margin: '0 0 24px 0', color: '#1e293b', fontSize: '1.3rem' }}>Agregar Materia</h3>
              <form onSubmit={handleCrearMateria} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Nombre de la Materia *</label>
                  <input name="nombre_materia" type="text" value={formMateria.nombre_materia}
                    onChange={(e) => setFormMateria({ ...formMateria, nombre_materia: e.target.value })}
                    required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Tipo de Materia</label>
                  <select name="tipo_materia" value={formMateria.tipo_materia}
                    onChange={(e) => setFormMateria({ ...formMateria, tipo_materia: e.target.value })} style={inputStyle}>
                    <option value="">Seleccionar tipo</option>
                    <option value="transversal">Transversal</option>
                    <option value="tecnica">Técnica</option>
                  </select>
                </div>
                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => { setShowModalMateria(false); setFormMateria(FORM_MATERIA_INICIAL); setError(''); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#84cc16', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal editar ficha */}
      <AnimatePresence>
        {showModalEditar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={modalBase}>
              <h3 style={{ margin: '0 0 24px 0', color: '#1e293b', fontSize: '1.3rem' }}>Editar Ficha</h3>
              <form onSubmit={handleEditarFicha} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Número de Ficha *</label>
                  <input name="numero_ficha" type="text" value={formEditar.numero_ficha}
                    onChange={(e) => setFormEditar({ ...formEditar, numero_ficha: e.target.value })}
                    required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Programa *</label>
                  <input name="programa" type="text" value={formEditar.programa}
                    onChange={(e) => setFormEditar({ ...formEditar, programa: e.target.value })}
                    required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Nivel *</label>
                  <select value={formEditar.nivel} onChange={(e) => setFormEditar({ ...formEditar, nivel: e.target.value })} required style={inputStyle}>
                    <option value="">Seleccionar nivel</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Jornada</label>
                  <select value={formEditar.jornada} onChange={(e) => setFormEditar({ ...formEditar, jornada: e.target.value })} style={inputStyle}>
                    <option value="">Seleccionar jornada</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Región</label>
                  <input type="text" value={formEditar.region}
                    onChange={(e) => setFormEditar({ ...formEditar, region: e.target.value })} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Centro de Formación</label>
                  <input type="text" value={formEditar.centro_formacion}
                    onChange={(e) => setFormEditar({ ...formEditar, centro_formacion: e.target.value })} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Duración (meses, máx. 30)</label>
                  <input type="number" min="1" max="30" value={formEditar.duracion_meses}
                    onChange={(e) => setFormEditar({ ...formEditar, duracion_meses: e.target.value })} style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>
                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => { setShowModalEditar(false); setError(''); }}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={loading}
                    style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: '#84cc16', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Guardando...' : 'Actualizar'}
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

export default DetalleFicha;
