import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FORM_INICIAL = {
  numero_ficha: '', programa: '', nivel: '', jornada: '', region: '', centro_formacion: '', duracion_meses: ''
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
};

const GestionFichas = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [fichas, setFichas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarFichas = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/fichas', {
        headers: { 'x-user-id': user.id }
      });
      const data = await res.json();
      if (data.success) setFichas(data.fichas);
    } catch (err) {
      console.error('Error al cargar fichas:', err);
    }
  };

  useEffect(() => { cargarFichas(); }, []);

  const fichasFiltradas = fichas.filter(f =>
    f.numero_ficha?.toLowerCase().includes(busqueda.toLowerCase()) ||
    f.programa?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/fichas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': user.id },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear ficha');
      setShowModal(false);
      setForm(FORM_INICIAL);
      cargarFichas();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(6px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200,
  };
  const modalStyle = {
    background: 'white', padding: '40px', borderRadius: '28px',
    width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
    maxHeight: '90vh', overflowY: 'auto',
  };
  const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '0.85rem', fontWeight: '600', color: '#475569' };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#166534', margin: 0 }}>Gestión de Fichas</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowModal(true)}
            style={{ background: '#84cc16', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} /> Nueva Ficha
          </motion.button>
        </header>

        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} size={18} />
            <input
              type="text"
              placeholder="Buscar por número o programa..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>
                <th style={{ padding: '15px' }}>NÚMERO</th>
                <th>PROGRAMA</th>
                <th>NIVEL</th>
                <th>JORNADA</th>
                <th style={{ textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {fichasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No hay fichas registradas
                  </td>
                </tr>
              ) : (
                fichasFiltradas.map(ficha => (
                  <tr key={ficha.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{ficha.numero_ficha}</td>
                    <td>{ficha.programa}</td>
                    <td>{ficha.nivel}</td>
                    <td>
                      {ficha.jornada && (
                        <span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
                          {ficha.jornada}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '15px' }}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate(`/fichas/${ficha.id}`)}
                        style={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', padding: '7px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
                      >
                        <Eye size={15} /> Ver más
                      </motion.button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={overlayStyle}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={modalStyle}>
              <h3 style={{ margin: '0 0 24px 0', color: '#1e293b', fontSize: '1.4rem' }}>Nueva Ficha</h3>
              <form onSubmit={handleCrear} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                <div>
                  <label style={labelStyle}>Número de Ficha *</label>
                  <input name="numero_ficha" type="text" value={form.numero_ficha} onChange={handleChange} required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                <div>
                  <label style={labelStyle}>Programa *</label>
                  <input name="programa" type="text" value={form.programa} onChange={handleChange} required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                <div>
                  <label style={labelStyle}>Nivel *</label>
                  <select name="nivel" value={form.nivel} onChange={handleChange} required style={inputStyle}>
                    <option value="">Seleccionar nivel</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Jornada *</label>
                  <select name="jornada" value={form.jornada} onChange={handleChange} required style={inputStyle}>
                    <option value="">Seleccionar jornada</option>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Región *</label>
                  <input name="region" type="text" value={form.region} onChange={handleChange} required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                <div>
                  <label style={labelStyle}>Centro de Formación *</label>
                  <input name="centro_formacion" type="text" value={form.centro_formacion} onChange={handleChange} required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                <div>
                  <label style={labelStyle}>Duración (meses, máx. 30) *</label>
                  <input name="duracion_meses" type="number" min="1" max="30" value={form.duracion_meses} onChange={handleChange} required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#84cc16'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} />
                </div>

                {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <button type="button" onClick={() => { setShowModal(false); setForm(FORM_INICIAL); setError(''); }}
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
    </div>
  );
};

export default GestionFichas;
