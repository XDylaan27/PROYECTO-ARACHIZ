import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const GestionFichas = () => {
  const [fichas] = useState([
    { id: 1, numero: '2670687', programa: 'ADSO', jornada: 'Mañana' },
    { id: 2, numero: '2670688', programa: 'Multimedia', jornada: 'Tarde' },
  ]);

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '260px', width: 'calc(100% - 260px)', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#166534', margin: 0 }}>Gestión de Fichas</h1>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            style={{ background: '#84cc16', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={20} /> Nueva Ficha
          </motion.button>
        </header>

        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#64748b' }} size={18} />
              <input type="text" placeholder="Buscar por número de ficha..." style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '0.9rem' }}>
                <th style={{ padding: '15px' }}>NÚMERO</th>
                <th>PROGRAMA</th>
                <th>JORNADA</th>
                <th style={{ textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {fichas.map(ficha => (
                <tr key={ficha.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{ficha.numero}</td>
                  <td>{ficha.programa}</td>
                  <td><span style={{ background: '#f0fdf4', color: '#166534', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>{ficha.jornada}</span></td>
                  <td style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '15px' }}>
                    <button style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18} /></button>
                    <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GestionFichas;