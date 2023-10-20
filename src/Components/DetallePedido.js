import React, { useState, useEffect } from "react";
import DetallePedidoService from "../Service/DetallePedidoService";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "../styles/DetallePedido.css";

function DetallePedido() {
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    idPedido: "",
    idProducto: "",
    cantidad: "",
    direccionEnvio: "",
  });
  const [editingDetalle, setEditingDetalle] = useState(null);

  useEffect(() => {
    obtenerDetallePedidos();
  }, []);

  const obtenerDetallePedidos = async () => {
    try {
      const data = await DetallePedidoService.getAllDetallePedidos();
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
    setShowAddDialog(true);
  };

  const handleEditClick = (detalle) => {
    setEditingDetalle({ ...detalle });
    setShowEditDialog(true);
  };

  const handleCancelAdd = () => {
    setNuevoDetalle({
      idPedido: "",
      idProducto: "",
      cantidad: "",
      direccionEnvio: "",
    });
    setShowAddDialog(false);
  };

  const handleCancelEdit = () => {
    setEditingDetalle(null);
    setShowEditDialog(false);
  };

  const handleSaveAdd = () => {
    const nuevoDetallePedido = {
      pedido: {
        idPedido: parseInt(nuevoDetalle.idPedido),
      },
      producto: {
        idProducto: parseInt(nuevoDetalle.idProducto),
      },
      cantidad: parseInt(nuevoDetalle.cantidad),
      direccionEnvio: nuevoDetalle.direccionEnvio,
    };

    DetallePedidoService.createDetallePedido(nuevoDetallePedido)
      .then((response) => {
        console.log("Detalle de pedido agregado:", response);
        obtenerDetallePedidos();
        setNuevoDetalle({
          idPedido: "",
          idProducto: "",
          cantidad: "",
          direccionEnvio: "",
        });
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

    // Utiliza el servicio para actualizar el detalle
    DetallePedidoService.updateDetallePedido(editingDetalle.idDetalle, editingDetalle)
      .then((response) => {
        console.log("Detalle de pedido actualizado correctamente:", response);
        obtenerDetallePedidos();
        setEditingDetalle(null);
        setShowEditDialog(false);
      })
      .catch((error) => {
        console.error("Error al actualizar el detalle de pedido:", error);
      });
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
              <th>ID Detalle</th>
              <th>ID Pedido</th>
              <th>Nombre Sucursal</th>
              <th>Fecha de Pedido</th>
              <th>Estado</th>
              <th>Nombre Producto</th>
              <th>Cantidad</th>
              <th>Dirección de Envío</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detallePedidos.map((detallePedido) => (
              <tr key={detallePedido.idDetalle}>
                <td>{detallePedido.idDetalle}</td>
                <td>{detallePedido.pedido.idPedido}</td>
                <td>{detallePedido.pedido.sucursal.nombreSucursal}</td>
                <td>{formatearFecha(detallePedido.pedido.fechaPedido)}</td>
                <td>{detallePedido.pedido.estado.descripcion}</td>
                <td>{detallePedido.producto.nombreProducto}</td>
                <td>{detallePedido.cantidad}</td>
                <td>{detallePedido.direccionEnvio}</td>
                <td>
                  <Button
                    label="Editar"
                    icon="pi pi-pencil"
                    onClick={() => handleEditClick(detallePedido)}
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
                id="idPedido"
                name="idPedido"
                value={nuevoDetalle.idPedido}
                onChange={handleInputChange}
              />
              <label htmlFor="idPedido">ID Pedido</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idProducto"
                name="idProducto"
                value={nuevoDetalle.idProducto}
                onChange={handleInputChange}
              />
              <label htmlFor="idProducto">ID Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="cantidad"
                name="cantidad"
                value={nuevoDetalle.cantidad}
                onChange={handleInputChange}
              />
              <label htmlFor="cantidad">Cantidad</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="direccionEnvio"
                name="direccionEnvio"
                value={nuevoDetalle.direccionEnvio}
                onChange={handleInputChange}
              />
              <label htmlFor="direccionEnvio">Dirección de Envío</label>
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
                id="idPedido"
                name="idPedido"
                value={editingDetalle ? editingDetalle.pedido.idPedido : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="idPedido">ID Pedido</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idProducto"
                name="idProducto"
                value={editingDetalle ? editingDetalle.producto.idProducto : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="idProducto">ID Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="cantidad"
                name="cantidad"
                value={editingDetalle ? editingDetalle.cantidad : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="cantidad">Cantidad</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="direccionEnvio"
                name="direccionEnvio"
                value={editingDetalle ? editingDetalle.direccionEnvio : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="direccionEnvio">Dirección de Envío</label>
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

export default DetallePedido;
