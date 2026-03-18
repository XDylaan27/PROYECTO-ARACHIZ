import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); 

  const [form, setForm] = useState({
    documento: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos:", form);

    navigate("/dashboard"); 
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Arachiz</h2>
        <p style={styles.subtitle}>Iniciar Sesión</p>

        <input
          type="text"
          name="documento"
          placeholder="Número de documento"
          value={form.documento}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Ingresar
        </button>

        <p style={{ color: "white", marginTop: "10px" }}>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: "#0F172A",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#1E293B",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    color: "#4F46E5",
    textAlign: "center",
  },
  subtitle: {
    color: "#F1F5F9",
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    background: "#4F46E5",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;