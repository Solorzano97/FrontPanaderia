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
import ProductosService from "../Service/ProductosService";

function Productos() {
  const [detallePedidos, setDetallePedidos] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddDialog2, setShowAddDialog2] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [nuevoDetalle, setNuevoDetalle] = useState({
    nombreProducto: "",
    tipo: "",
    stock: "",
  });




  const [nuevoDetalle2, setNuevoDetalle2] = useState({
    nombreProducto: "",
    tipo: "",
    stock: "",
  });






  const [editingDetalle, setEditingDetalle] = useState(null);

  const [showDetalleDialog, setShowDetalleDialog] = useState(false);
  const [detallePedidoData, setDetallePedidoData] = useState(null);

  useEffect(() => {
    obtenerDetallePedidos();
  }, []);

  const obtenerDetallePedidos = async () => {
    try {
      const data = await ProductosService.getAllProductos();
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








  const handleInputChange2 = (event) => {
    const { name, value } = event.target;
    if (showAddDialog2) {
      setNuevoDetalle2({
        ...nuevoDetalle2,
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
      nombreProducto: "",
      tipo: "",
      stock: "",
    });
    setShowAddDialog(true);
  };










  const handleAddDetalleClick = () => {
    setNuevoDetalle2({
      nombreProducto: "",
      tipo: "",
      stock: "",
    });
    setShowAddDialog2(true);
  };










  const handleEditClick = (detalle) => {
    setEditingDetalle({ ...detalle });
    setShowEditDialog(true);
  };

  const handleDetalleClick = async (idPedido) => {
    try {
      const response = await PedidosService.getDetallePedido(idPedido);
      console.log("Detalles del pedido:", response);
      
      if (Array.isArray(response.body) && response.body.length > 0) {
        setDetallePedidoData(response.body);
        setShowDetalleDialog(true);
      } else {
        setDetallePedidoData([]);
        setShowDetalleDialog(true);
      }
    } catch (error) {
      console.error("Error al obtener los detalles del pedido:", error);
    }
  };
  
  

  const handleEntregar = (detallePedido) => {
    if (detallePedido && detallePedido.idPedido) {
      const updatedDetallePedido = {
        ...detallePedido,
        estado: {
          idEstado: 2,
          descripcion: 'entregado',
        },
      };

      PedidosService.updateProducto(updatedDetallePedido.idProducto, updatedDetallePedido)
        .then((response) => {
           if (response.status === 400) {
          console.error("Stock insuficiente");
        }
          console.log("Detalle de pedido actualizado a 'Entregado':", response);
          obtenerDetallePedidos();
        })
        .catch((error) => {
          console.error("Error al actualizar el detalle de pedido:", error);
        });
    }
  };

  const handleCancelAdd = () => {
    setShowAddDialog(false);
  };


  const handleCancelAdd2 = () => {
    setShowAddDialog(false);
  };

  const handleCancelEdit = () => {
    setShowEditDialog(false);
  };

  const handleSaveAdd = () => {
    const nuevoDetallePedido = {

      nombreProducto: nuevoDetalle.nombreProducto,
      tipo: nuevoDetalle.tipo,
      stock: parseInt(nuevoDetalle.stock),
      
    };

    ProductosService.createProducto(nuevoDetallePedido)
      .then((response) => {
        console.log("Detalle de pedido agregado:", response);
        obtenerDetallePedidos();
        setShowAddDialog(false);
      })
      .catch((error) => {
        console.error("Error al agregar el detalle de pedido:", error);
      });
  };








  const handleSaveAddDetalle = () => {
    console.log();
    const nuevoDetallePedido2 = {
      nombreProducto : nuevoDetalle2.nombreProducto,
      tipo: nuevoDetalle2.tipo,
      stock : nuevoDetalle2.stock
    };
    console.log('enviara esto joder ' , nuevoDetallePedido2);
    ProductosService.createProducto(nuevoDetallePedido2)
      .then((response) => {
        console.log("Detalle de pedido agregado:", response);
        obtenerDetallePedidos();
        setNuevoDetalle2({
          nombreProducto: "",
          tipo: "",
          stock: ""
        });
        setShowAddDialog2(false);
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

    ProductosService.updateProducto(editingDetalle.idProducto, editingDetalle)
      .then((response) => {
        console.log("Detalle de pedido actualizado correctamente:", response);
        obtenerDetallePedidos();
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
                <Link to="/detallePedido" className="nav-link active" aria-current="page">
                  Detalle pedidos
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/recetas" className="nav-link">
                  Recetas
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/pedido" className="nav-link">
                  Pedidos
                </Link>
              </li>
            </ul>
            <Button
              label="Agregar Producto"
              icon="pi pi-plus"
              onClick={handleAddClick}
            />
          </div>
        </div>
      </nav>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Productos</h1>
        </div>
        <table className="table">
          <thead>
            <tr>
            <th>Id Pedido</th>
              <th>Nombre Producto</th>
              <th>tipo</th>
              <th>stock</th>
              <th>acciones</th>
            </tr>
          </thead>
          <tbody>
            {detallePedidos.map((detallePedido) => (
              <tr key={detallePedido.idProducto}>
                <td>{detallePedido.idProducto}</td>
                <td>{detallePedido.nombreProducto}</td>
                <td>{detallePedido.tipo}</td>
                <td>{detallePedido.stock}</td>
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
      <Dialog header="Agregar Nuevo producto" visible={showAddDialog} style={{ width: "50vw" }} onHide={handleCancelAdd}>
        <div className="p-grid">
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="nombreProducto"
                name="nombreProducto"
                value={nuevoDetalle.nombreProducto}
                onChange={handleInputChange}
              />
              <label htmlFor="nombreProducto">Nombre Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="tipo"
                name="tipo"
                value={nuevoDetalle.tipo}
                onChange={handleInputChange}
              />
              <label htmlFor="tipo">Tipo</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="stock"
                name="stock"
                value={nuevoDetalle.stock}
                onChange={handleInputChange}
              />
              <label htmlFor="stock">Stock</label>
            </span>
          </div>
          <div className="p-col-12">
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveAdd} />
          </div>
        </div>
      </Dialog>












      <Dialog header="Agregar Nuevo pedido" visible={showAddDialog2} style={{ width: "50vw" }} onHide={handleCancelAdd2}>
        <div className="p-grid">
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idPedido"
                name="idPedido"
                value={nuevoDetalle2.idPedido}
                onChange={handleInputChange2}
              />
              <label htmlFor="idPedido">ID Pedido</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="idProducto"
                name="idProducto"
                value={nuevoDetalle2.idProducto}
                onChange={handleInputChange2}
              />
              <label htmlFor="idProducto">Id Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="cantidad"
                name="cantidad"
                value={nuevoDetalle2.cantidad}
                onChange={handleInputChange2}
              />
              <label htmlFor="cantidad">cantidad</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="direccionEnvio"
                name="direccionEnvio"
                value={nuevoDetalle2.direccionEnvio}
                onChange={handleInputChange2}
              />
              <label htmlFor="direccionEnvio">Direccion Envio</label>
            </span>
          </div>
          <div className="p-col-12">
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveAddDetalle} />
          </div>
        </div>
      </Dialog>
















      
      <Dialog header="Editar Detalle" visible={showEditDialog} style={{ width: "50vw" }} onHide={handleCancelEdit}>
        <div className="p-grid">
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="nombreProducto"
                name="nombreProducto"
                value={editingDetalle ? editingDetalle.nombreProducto : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="nombreProducto">Nombre Producto</label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="tipo"
                name="tipo"
                value={editingDetalle ? editingDetalle.tipo : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="tipo">Tipo </label>
            </span>
          </div>
          <div className="p-col-12">
            <span className="p-float-label">
              <InputText
                id="stock"
                name="stock"
                value={editingDetalle ? editingDetalle.stock : ""}
                onChange={handleInputChange}
              />
              <label htmlFor="stock">stock</label>
            </span>
          </div>
          <div className="p-col-12">
            <Button label="Guardar" icon="pi pi-check" onClick={handleSaveEdit} />
          </div>
        </div>
      </Dialog>
      <Dialog header="Detalles del Pedido" visible={showDetalleDialog} style={{ width: "50vw" }} onHide={() => setShowDetalleDialog(false)}>
  <div className="p-grid">
    <div className="p-col-12">
      <h2>Detalles del Pedido</h2>
      {detallePedidoData ? (
        <ul>
          {detallePedidoData.map((detallePedido, index) => (
            <li key={index}>
              <p>ID de Pedido: {detallePedido.idDetalle}</p>
              <p>Producto: {detallePedido.producto ? detallePedido.producto.nombreProducto : "No disponible"}</p>
              <p>Cantidad: {detallePedido.cantidad}</p>
              <p>Dirección de Envío: {detallePedido.direccionEnvio}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron detalles de pedido.</p>
      )}
    </div>
  </div>
</Dialog>

    </div>
  );
}

export default Productos;
