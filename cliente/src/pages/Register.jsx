import { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    tipo: "aprendiz",
    nombre: "",
    documento: "",
    correo: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    console.log("Registro:", form);
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Crear Cuenta</h2>

        <select name="tipo" value={form.tipo} onChange={handleChange} style={styles.input}>
          <option value="aprendiz">Aprendiz</option>
          <option value="instructor">Instructor</option>
        </select>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="documento"
          placeholder="Documento"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="correo"
          placeholder="Correo"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar contraseña"
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Registrarse
        </button>
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
    width: "320px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
  },
  input: {
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  },
  button: {
    background: "#661cbb",
    color: "#fff",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
};

export default Register;