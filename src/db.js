import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "102004", // Coloca tu contraseña de MySQL
  database: "Login",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
