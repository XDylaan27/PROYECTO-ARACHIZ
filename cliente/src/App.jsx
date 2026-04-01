import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dash from './pages/Dash';
import GestionFichas from './pages/GestionFichas';
import GestionMaterias from './pages/GestionMaterias';
import ControlAsistencia from './pages/ControlAsistencia';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/fichas" element={<GestionFichas />} />
        <Route path="/materias" element={<GestionMaterias />} />
        <Route path="/asistencia" element={<ControlAsistencia />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;