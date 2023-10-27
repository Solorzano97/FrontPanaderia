import React from "react";
import { BrowserRouter as Router, Route, Routes  } from "react-router-dom";
import Login from "./Components/Login"; // Importa el componente de inicio de sesión
import Roles from "./Components/Roles"; // Importa el componente de roles
import Recetas from "./Components/Recetas";
import DetallePedido from "./Components/DetallePedido";
import 'bootstrap/dist/css/bootstrap.min.css';
import Pedidos from "./Components/Pedidos";
import Productos from "./Components/Productos";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/detallePedido" element={<DetallePedido />} />
          <Route path="/Pedido" element={<Pedidos />} />
          <Route path="/Productos" element={<Productos />} />
          {/* Otras rutas según sea necesario */}
          <Route index element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
