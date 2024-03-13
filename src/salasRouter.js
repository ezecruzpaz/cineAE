// salasRouter.js

import express from "express";
import { agregarSala } from "./salaController.js"; // Asegúrate de importar la función para agregar una sala

const router = express.Router();

// Ruta para agregar una nueva sala
router.post("/agregar", agregarSala);

export default router;
