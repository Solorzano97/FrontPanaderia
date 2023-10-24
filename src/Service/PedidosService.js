import axios from "axios";

class PedidosService {
  baseUrl = "http://localhost:8080/pedidos/all";
  API_URL = "http://localhost:8080/pedidos/save";
  DETALLE_URL = "http://localhost:8080/pedidos/findDetalle"; // URL para obtener detalles por ID
  API_URL2 = "http://localhost:8080/detalle-pedido/save";


  async getAllPedidos() {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createPedido(pedido) {
    try {
      const response = await axios.post(this.API_URL, pedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updatePedido(id, pedido) {
    const updateURL = `http://localhost:8080/pedidos/changePedido/${id}`;
    try {
      const response = await axios.put(updateURL, pedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getDetallePedido(idPedido) {
    const detalleURL = `${this.DETALLE_URL}/${idPedido}`;
    try {
      const response = await axios.get(detalleURL);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createDetallePedido(detallePedido) {
    try {
      const response = await axios.post(this.API_URL2, detallePedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

}

export default new PedidosService();
