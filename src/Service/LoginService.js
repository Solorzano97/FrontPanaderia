import axios from "axios";

const baseUrl = "http://localhost:8080"; // Ajusta la URL base de tu servidor

class LoginService {
  async login(username, password) {
    const loginUrl = `${baseUrl}/usuarios/login/username/${username}/password/${password}`;
    
    try {
      const response = await axios.get(loginUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new LoginService();
