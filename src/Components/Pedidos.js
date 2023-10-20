import React, { useState, useEffect } from "react";
import DetallePedidoService from "../Service/DetallePedidoService";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "../styles/DetallePedido.css";
import PedidosService from "../Service/PedidosService";

function Pedidos() {
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    idSucursal: "",
    fechaPedido: "",
    idEstado: "",
  });
  const [editingDetalle, setEditingDetalle] = useState(null);

  useEffect(() => {
    obtenerDetallePedidos();
  }, []);

  const obtenerDetallePedidos = async () => {
    try {
      const data = await PedidosService.getAllPedidos();
      setDetallePedidos(data.body);
    } catch (error) {
      console.error("Error al obtener los detalles de pedido:", error);
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (showAddDialog) {
      setNuevoDetalle({
        ...nuevoDetalle,
        [name]: value,
      });
    } else if (showEditDialog) {
      setEditingDetalle({
        ...editingDetalle,
        [name]: value,
      });
    }
  };

  const handleAddClick = () => {
    setNuevoDetalle({
      idSucursal: "",
      fechaPedido: "",
      idEstado: "",
    });
    setShowAddDialog(true);
  };

  const handleEditClick = (detalle) => {
    setEditingDetalle({ ...detalle });
    setShowEditDialog(true);
  };

  const handleCancelAdd = () => {
    setShowAddDialog(false);
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
  };

  const handleSaveAdd = () => {
    const nuevoDetallePedido = {
      sucursal: {
        idSucursal: parseInt(nuevoDetalle.idSucursal),
      },
      fechaPedido: parseInt(nuevoDetalle.fechaPedido),
      estado: {
        idEstado: parseInt(nuevoDetalle.idEstado),
      }
    };

    PedidosService.createPedido(nuevoDetallePedido)
      .then((response) => {
        console.log("Detalle de pedido agregado:", response);
        obtenerDetallePedidos();
        setShowAddDialog(false);
      })
      .catch((error) => {
        console.error("Error al agregar el detalle de pedido:", error);
      });
  };

  const handleSaveEdit = () => {
    if (!editingDetalle) {
      console.error("Detalle de edición no encontrado.");
      setShowEditDialog(false);
      return;
    }

    PedidosService.updatePedido(editingDetalle.idPedido, editingDetalle)
      .then((response) => {
        console.log("Detalle de pedido actualizado correctamente:", response);
        obtenerDetallePedidos();
        setShowEditDialog(false);
      })
      .catch((error) => {
        console.error("Error al actualizar el detalle de pedido:", error);
      });
  };

  const handleEntregar = (detallePedido) => {
    if (detallePedido && detallePedido.idPedido) {
      const updatedDetallePedido = {
        ...detallePedido,
        estado: {
          idEstado: 2,
          descripcion: 'Entregado',
        },
      };
  
      PedidosService.updatePedido(updatedDetallePedido.idPedido, updatedDetallePedido)
        .then((response) => {
          console.log("Detalle de pedido actualizado a 'Entregado':", response);
          obtenerDetallePedidos();
        })
        .catch((error) => {
          console.error("Error al actualizar el detalle de pedido:", error);
        });
    }
  };

  const formatearFecha = (fecha) => {
    const options = { year: "2-digit", month: "2-digit", day: "2-digit" };
    return new Date(fecha).toLocaleDateString("es-CO", options);
  };

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setMenuVisible(!menuVisible)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${menuVisible ? "show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link to="/roles" className="nav-link active" aria-current="page">
                  Roles
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recetas" className="nav-link">
                  Recetas
                </Link>
              </li>
            </ul>
            <Button
              label="Agregar Detalle"
              icon="pi pi-plus"
              onClick={handleAddClick}
            />
          </div>
        </div>
      </nav>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Detalles de Pedido</h1>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID PEDIDO</th>
              <th>fechaPedido</th>
              <th>Estado</th>
              <th>accion</th>
            </tr>
          </thead>
          <tbody>
            {detallePedidos.map((detallePedido) => (
              <tr key={detallePedido.idPedido}>
                <td>{detallePedido.sucursal.idSucursal}</td>
                <td>{formatearFecha(detallePedido.fechaPedido)}</td>
                <td>{detallePedido.estado.descripcion}</td>
                <td>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    onClick={() => handleEditClick(detallePedido)}
                  />
                  <Button
                    label="Entregar"
                    icon="pi pi-check"
                    onClick={() => handleEntregar(detallePedido)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Dialog header="Agregar Nuevo Detalle" visible={showAddDialog} style={{ width: "50vw" }} onHide={handleCancelAdd}>
        <div className="p-grid">
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idSucursal"
                name="idSucursal"
                value={nuevoDetalle.idSucursal}
                onChange={handleInputChange}
              />
              <label htmlFor="idSucursal">ID Sucursal</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="fechaPedido"
                name="fechaPedido"
                value={nuevoDetalle.fechaPedido}
                onChange={handleInputChange}
              />
              <label htmlFor="fechaPedido">fecha</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idEstado"
                name="idEstado"
                value={nuevoDetalle.idEstado}
                onChange={handleInputChange}
              />
              <label htmlFor="idEstado">ID ESTADO</label>
            </span>
          </div>
          <div className="p-col-12">
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveAdd} />
          </div>
        </div>
      </Dialog>
      <Dialog header="Editar Detalle" visible={showEditDialog} style={{ width: "50vw" }} onHide={handleCancelEdit}>
        <div className="p-grid">
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idSucursal"
                name="idSucursal"
                value={editingDetalle ? editingDetalle.sucursal.idSucursal: ""}
                onChange={handleInputChange}
              />
              <label htmlFor="idSucursal">ID Sucursal</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="fechaPedido"
                name="fechaPedido"
                value={editingDetalle ? editingDetalle.fechaPedido: ""}
                onChange={handleInputChange}
              />
              <label htmlFor="fechaPedido">ID Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idEstado"
                name="idEstado"
                value={editingDetalle ? editingDetalle.idEstado: ""}
                onChange={handleInputChange}
              />
              <label htmlFor="idEstado">id estado</label>
            </span>
          </div>
          <div className="p-col-12">
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveEdit} />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Pedidos;