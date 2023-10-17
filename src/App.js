import React from "react";
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
import Login from "./Components/Login"; // Importa el componente de inicio de sesión
import Roles from "./Components/Roles"; // Importa el componente de roles
import Recetas from "./Components/Recetas";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/recetas" element={<Recetas />} />
          {/* Otras rutas según sea necesario */}
          <Route index element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
