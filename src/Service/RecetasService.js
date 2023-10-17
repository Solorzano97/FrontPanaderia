import Axios from "axios";

const baseURL = "http://localhost:8080"; // Reemplaza con la URL real de tu backend

const RecetasService = {
  getAllRecetas: async () => {
    try {
      const response = await Axios.get(`${baseURL}/receta/all`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
      throw error;
    }
  },
};

export default RecetasService;
