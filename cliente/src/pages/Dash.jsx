const Dash = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Bienvenido a Arachiz</h1>

      <div style={styles.cards}>
        <div style={styles.card}>
          <h3>Fichas</h3>
          <p>3 activas</p>
        </div>

        <div style={styles.card}>
          <h3>Materias</h3>
          <p>5 registradas</p>
        </div>

        <div style={styles.card}>
          <h3>Asistencias</h3>
          <p>90%</p>
        </div>
      </div>

      <h2 style={styles.subtitle}>Accesos rápidos</h2>

      <div style={styles.actions}>
        <button style={styles.button}>Registrar asistencia</button>
        <button style={styles.button}>Ver horario</button>
        <button style={styles.button}>Ver excusas</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#0F172A",
    minHeight: "100vh",
    padding: "30px",
    color: "#F1F5F9",
  },
  title: {
    color: "#5c1dad",
    marginBottom: "20px",
  },
  subtitle: {
    marginTop: "30px",
    marginBottom: "10px",
  },
  cards: {
    display: "flex",
    gap: "20px",
  },
  card: {
    background: "#1E293B",
    padding: "20px",
    borderRadius: "12px",
    flex: 1,
    textAlign: "center",
  },
  actions: {
    display: "flex",
    gap: "15px",
    marginTop: "20px",
  },
  button: {
    background: "#661cbb",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "white",
  },
};

export default Dash;