import axios from "axios";

class RecetasService {
  baseUrl = "http://localhost:8080/receta/all";
  API_URL = "http://localhost:8080/receta/save";

  async getAllRecetas() {
    try {
      const response = await axios.get(this.baseUrl);
      return response.data.body;
    } catch (error) {
      throw error;
    }
  }

  async createReceta(receta) {
    try {
      const response = await axios.post(this.API_URL, receta);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateReceta(id, receta) {
    const updateURL = `http://localhost:8080/receta/changeReceta/${id}`;
    try {
      const response = await axios.put(updateURL, receta);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new RecetasService();
