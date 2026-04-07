import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dash from "./pages/Dash";
import GestionFichas from "./pages/GestionFichas"; 
import GestionMaterias from "./pages/GestionMaterias";
import InfoFicha from "./pages/InfoFicha";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas (Dashboard y CRUDs) */}
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/fichas" element={<GestionFichas />} />
        <Route path="/materias" element={<GestionMaterias />} />
        <Route path="/ficha/:id" element={<InfoFicha />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;