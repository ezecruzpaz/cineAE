import express from "express";
import {
  agregarUsuario,
  listarUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  obtenerDetallesUsuario,
  obtenerDetallesUsuarioUpdate,
  autenticarUsuario // Importa la función de autenticación
} from "./usuarioController.js";

const router = express.Router();


// Ruta para procesar el formulario de inicio de sesión


router.get("/Crud-Completo-con-NodeJS-Express-y-MySQL", async (req, res) => {
  try {
    const usuarios = await listarUsuarios();
    res.render("pages/Lis_Usuarios", { usuarios });
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});

// Registrar un nuevo usuario
router.post("/usuarios", async (req, res) => {
  const { nombre_usuario, contrasena_encriptada, tipo_usuario, estado } = req.body;

  try {
    await agregarUsuario({ nombre_usuario, contrasena_encriptada, tipo_usuario, estado });
    res.redirect("/");
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});



// Detalles del usuario
router.get("/detalles/:id", async (req, res) => {
  const usuarioId = req.params.id;

  try {
    const usuario = await obtenerDetallesUsuario(usuarioId);
    res.render("pages/detalles_usuario", { usuario });
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});

// Mostrar formulario para actualizar un usuario
router.get("/formulario-actualizar-usuario/:id", async (req, res) => {
  const usuarioId = req.params.id;

  try {
    const usuario = await obtenerDetallesUsuarioUpdate(usuarioId);

    res.render("pages/update_usuario", { usuario });
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});

// Ruta para actualizar un usuario por ID
router.post("/actualizar-usuario/:id", async (req, res) => {
  const { nombre_usuario, contrasena_encriptada, tipo_usuario, estado } = req.body;
  const id = req.params.id;

  try {
    await actualizarUsuario(id, {
      nombre_usuario,
      contrasena_encriptada,
      tipo_usuario,
      estado,
    });

    res.redirect("/Crud-Completo-con-NodeJS-Express-y-MySQL");
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});

// Ruta para borrar un usuario por ID
router.post("/borrar-usuario/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await eliminarUsuario(id);
    res.redirect("/Crud-Completo-con-NodeJS-Express-y-MySQL");
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});



// Maneja la ruta para la lista de usuarios
router.get('/lista-usuarios', (req, res) => {
  // Aquí renderiza la vista de la lista de usuarios o realiza cualquier otra acción necesaria
  res.render('pages/For_usuarios', {});
});


router.get('/lista-Peliculas', (req, res) => {
  // Aquí renderiza la vista de la lista de usuarios o realiza cualquier otra acción necesaria
  res.render('pages/For_usuarios2', {});
});




router.get("/Crud-Completo-con-NodeJS-Express-y-MySQL", async (req, res) => {
  try {
    const { Tipo, estadoUsuario, busquedaUsuario } = req.query;
    const usuarios = await obtenerUsuariosFiltrados({ tipo: Tipo, estado: estadoUsuario, busqueda: busquedaUsuario });
    res.render("pages/lis_usuarios", { usuarios });
  } catch (error) {
    const { status, message } = error;
    res.status(status || 500).json({ error: message });
  }
});


// Ruta para procesar el formulario de inicio de sesión
router.post("/inicio", async (req, res) => {
  try {
    // Llama a la función de autenticación
    await autenticarUsuario(req, res);
  } catch (error) {
    // Captura errores y renderiza la página de inicio de sesión con un mensaje de error
    const errorMessage = error.message || 'Error al procesar la solicitud';
    res.render('pages/login', { message: errorMessage });
  }
});
router.post("/inicio", async (req, res) => {
  try {
    const { usuario, tipoUsuario } = await autenticarUsuario(req, res);

    // Guarda el tipo de usuario en la sesión
    req.session.tipoUsuario = tipoUsuario;

    // Redirige al usuario según su tipo
    if (tipoUsuario === 'super admin') {
      res.redirect('/pages/Lis_usuarios');
    } else if (tipoUsuario === 'taquillero') {
      res.redirect('/pages/For_usuarios');
    } else {
      res.render('inicio', { message: 'Tipo de usuario no válido' });
    }
  } catch (error) {
    const errorMessage = error.message || 'Error al procesar la solicitud';
    res.render('inicio', { message: errorMessage });
  }
});

// router.js



import salasRouter from "./salasRouter.js";

// Rutas para salas
router.use("/salas", salasRouter); // Usa el enrutador de salas para las rutas relacionadas con las salas




export default router;