import express from "express";
import cors from "cors";
import session from "express-session";
import router from "./src/router.js";
import { generateRandomString } from './secret.js';// Importa la función

const app = express();

// Ejecuta la función para obtener el secreto
const secret = generateRandomString();

// Configuración de express-session
app.use(session({
  secret: secret, // Utiliza el secreto obtenido
  resave: false,
  saveUninitialized: false
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

//Establece el motor de plantillas
app.set("view engine", "ejs");
app.set("views", "./views");

// Carga la página de inicio
app.get("/", (req, res) => {
  res.render("inicio", {});
});

// Usa el enrutador para las rutas relacionadas con estudiantes
app.use("/", router);
// app.js


// Ruta para la página de lista de películas
app.get("/lista-Peliculas", (req, res) => {
  // Aquí puedes renderizar tu vista de lista de películas o realizar otras acciones necesarias
  res.send("Página de lista de películas"); // Solo como ejemplo, debes ajustar esto según tu aplicación
});


const PORT = process.env.PORT || 3600;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://127.0.0.1:${PORT}`);
});
