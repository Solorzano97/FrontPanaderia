import React, { useState, useEffect } from "react";
import RecetasService from "../Service/RecetasService";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";

function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [nuevaReceta, setNuevaReceta] = useState({
    idProducto: "",
    descripcionProducto: "",
    tipoProducto: "",
    fechaCreacion: "",
    instrucciones: "",
    tiempoPreparacion: "",
  });

  useEffect(() => {
    obtenerRecetas();
  }, []);

  const obtenerRecetas = async () => {
    try {
      const data = await RecetasService.getAllRecetas();
      console.log("Recetas obtenidas:", data);
      setRecetas(data);
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNuevaReceta({
      ...nuevaReceta,
      [name]: value,
    });
  };

  const handleAddClick = () => {
    setShowAddDialog(true);
  };

  const handleCancelAdd = () => {
    setNuevaReceta({
      idProducto: "",
      descripcionProducto: "",
      tipoProducto: "",
      fechaCreacion: "",
      instrucciones: "",
      tiempoPreparacion: "",
    });
    setShowAddDialog(false);
  };

  const formatDataForService = (data) => {
    return {
      producto: {
        idProducto: data.idProducto,
      },
      descripcionProducto: data.descripcionProducto,
      tipoProducto: data.tipoProducto,
      fechaCreacion: data.fechaCreacion.split('T')[0],
      instrucciones: data.instrucciones,
      tiempoPreparacion: data.tiempoPreparacion,
    };
  };

  const handleSaveAdd = () => {
    const dataForService = formatDataForService(nuevaReceta);

    RecetasService.createReceta(dataForService)
      .then(() => {
        obtenerRecetas();
        setNuevaReceta({
          idProducto: "",
          descripcionProducto: "",
          tipoProducto: "",
          fechaCreacion: "",
          instrucciones: "",
          tiempoPreparacion: "",
        });
        setShowAddDialog(false);
      })
      .catch((error) => {
        console.error("Error al agregar la receta:", error);
      });
  };

  return (
    <div className="container">
      <Button label="Agregar Receta" onClick={handleAddClick} />
      <table className="table">
        <thead>
          <tr>
            <th>ID Receta</th>
            <th>ID Producto</th>
            <th>Descripción Producto</th>
            <th>Tipo Producto</th>
            <th>Fecha Creación</th>
            <th>Instrucciones</th>
            <th>Tiempo Preparación</th>
          </tr>
        </thead>
        <tbody>
          {recetas.map((receta) => (
            <tr key={receta.idReceta}>
              <td>{receta.idReceta}</td>
              <td>{receta.producto.idProducto}</td>
              <td>{receta.descripcionProducto}</td>
              <td>{receta.tipoProducto}</td>
              <td>{receta.fechaCreacion}</td>
              <td>{receta.instrucciones}</td>
              <td>{receta.tiempoPreparacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog
        header="Agregar Nueva Receta"
        visible={showAddDialog}
        style={{ width: "50vw" }}
        onHide={handleCancelAdd}
      >
        <div className="p-grid">
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idProducto"
                name="idProducto"
                value={nuevaReceta.idProducto}
                onChange={handleInputChange}
              />
              <label htmlFor="idProducto">ID Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="descripcionProducto"
                name="descripcionProducto"
                value={nuevaReceta.descripcionProducto}
                onChange={handleInputChange}
              />
              <label htmlFor="descripcionProducto">Descripción Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="tipoProducto"
                name="tipoProducto"
                value={nuevaReceta.tipoProducto}
                onChange={handleInputChange}
              />
              <label htmlFor="tipoProducto">Tipo Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="fechaCreacion"
                name="fechaCreacion"
                value={nuevaReceta.fechaCreacion}
                onChange={handleInputChange}
              />
              <label htmlFor="fechaCreacion">Fecha Creación</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="instrucciones"
                name="instrucciones"
                value={nuevaReceta.instrucciones}
                onChange={handleInputChange}
              />
              <label htmlFor="instrucciones">Instrucciones</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="tiempoPreparacion"
                name="tiempoPreparacion"
                value={nuevaReceta.tiempoPreparacion}
                onChange={handleInputChange}
              />
              <label htmlFor="tiempoPreparacion">Tiempo Preparación</label>
            </span>
          </div>
          <div className="p-col-12">
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveAdd} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Recetas;
