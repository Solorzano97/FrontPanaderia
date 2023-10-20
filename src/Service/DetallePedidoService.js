import axios from "axios";

class DetallePedidoService {
  baseUrl = "http://localhost:8080/detalle-pedido/all";
  API_URL = "http://localhost:8080/detalle-pedido/save";

  async getAllDetallePedidos() {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createDetallePedido(detallePedido) {
    try {
      const response = await axios.post(this.API_URL, detallePedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateDetallePedido(id, detallePedido) {
    const updateURL = `http://localhost:8080/detalle-pedido/changeDetallePedido/${id}`;
    try {
      const response = await axios.put(updateURL, detallePedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new DetallePedidoService();
