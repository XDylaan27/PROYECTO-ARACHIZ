import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardInstructor from './pages/DashboardInstructor';
import DashboardAprendiz from './pages/DashboardAprendiz';
import GestionFichas from './pages/GestionFichas';
import DetalleFicha from './pages/DetalleFicha';
import ControlAsistencia from './pages/ControlAsistencia';
import Perfil from './pages/Perfil';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardInstructor />} />
        <Route path="/dashboard-aprendiz" element={<DashboardAprendiz />} />
        <Route path="/fichas" element={<GestionFichas />} />
        <Route path="/fichas/:id" element={<DetalleFicha />} />
        <Route path="/asistencia" element={<ControlAsistencia />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;