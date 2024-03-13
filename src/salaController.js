// salaController.js

import db from './db.js';

export const agregarSala = async (req, res) => {
    try {
        const { nombreSala, sinopsisSala, duracionSala, generoSala, imagenSala, precioSala } = req.body;
        const query = 'INSERT INTO Salas (nombre_sala, pelicula, horario) VALUES (?, ?, ?)';
        await db.query(query, [nombreSala, sinopsisSala, duracionSala, generoSala, imagenSala, precioSala]);

        // Redirigir solo después de agregar la sala correctamente
        res.redirect('/lista-Peliculas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
};
