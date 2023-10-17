import React, { useState } from "react";
import LoginService from "../Service/LoginService";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Importa el archivo de estilo CSS

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Estado para el mensaje de error
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await LoginService.login(username, password);

      if (response && response.body) {
        navigate("/recetas");
      } else {
        setError("Usuario o contraseña inválidos"); // Establece el mensaje de error
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>} {/* Muestra el mensaje de error si existe */}
        <div className="input-group">
          <label className="input-label">Nombre de usuario</label>
          <input
            type="text"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label className="input-label">Contraseña</label>
          <input
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
