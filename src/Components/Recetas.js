import React, { useState, useEffect } from "react";
import RecetasService from "../Service/RecetasService";
import { Link } from "react-router-dom";
import "../styles/Recetas.css";

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    obtenerRecetas();
  }, []);

  const obtenerRecetas = async () => {
    try {
      const data = await RecetasService.getAllRecetas();
      setRecetas(data.body);
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
    }
  };

  return (
    <div className="recetas-container">
      <div className={`menu ${menuVisible ? "menu-open" : ""}`}>
        <div className="menu-toggle" onClick={() => setMenuVisible(!menuVisible)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <ul className="menu-list">
          <li className="menu-item">
            <Link to="/roles" className="menu-link">
              Roles
            </Link>
          </li>
        </ul>
      </div>
      <div className="recetas-content">
        <h2>Recetas</h2>
        <table className="recetas-table">
          <thead>
            <tr>
              <th>ID Receta</th>
              <th>Nombre Producto</th>
              <th>Descripción Producto</th>
              <th>Tipo Producto</th>
              <th>Fecha de Creación</th>
              <th>Instrucciones</th>
              <th>Tiempo de Preparación</th>
            </tr>
          </thead>
          <tbody>
            {recetas.map((receta) => (
              <tr key={receta.idReceta}>
                <td>{receta.idReceta}</td>
                <td>{receta.producto.nombreProducto}</td>
                <td>{receta.descripcionProducto}</td>
                <td>{receta.tipoProducto}</td>
                <td>{receta.fechaCreacion}</td>
                <td>{receta.instrucciones}</td>
                <td>{receta.tiempoPreparacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Recetas;
