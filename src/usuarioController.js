import pool from "./db.js";
import bcrypt from 'bcrypt';

// Función para autenticar al usuario
export const autenticarUsuario = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Consulta la base de datos para verificar las credenciales
    const usuario = await obtenerUsuarioPorNombre(username);

    if (!usuario) {
      
      return res.render('inicio', { message: 'Usuario no encontrado' });
    }

    if (password != usuario.contrasena_encriptada) {
      return res.render('inicio', { message: 'Contraseña incorrecta' });
    }

    // Autenticación exitosa, establecer la sesión
    req.session.usuario = usuario;
    req.session.tipoUsuario = usuario.tipo_usuario;

    // Redireccionar al usuario según su tipo
    if (usuario.tipo_usuario === 'super admin') {
      res.redirect('/Crud-Completo-con-NodeJS-Express-y-MySQL');
    } else if (usuario.tipo_usuario === 'taquillero') {
      res.redirect('/lista-usuarios');
    } else {
      res.render('inicio', { message: 'Tipo de usuario no válido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al autenticar usuario' });
  }
};

// Función para obtener un usuario por nombre
const obtenerUsuarioPorNombre = async (nombre_usuario) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE nombre_usuario = ?", [nombre_usuario]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    console.error(error);
    throw new Error('Error al obtener usuario por nombre');
  }
};

// Agregar un nuevo usuario
export const agregarUsuario = async ({
  nombre_usuario,
  contrasena_encriptada,
  tipo_usuario,
  estado,
}) => {
  try {
    await pool.query(
      "INSERT INTO usuarios (nombre_usuario, contrasena_encriptada, tipo_usuario, estado, created_at) VALUES (?, ?, ?, ?, ?)",
      [nombre_usuario, contrasena_encriptada, tipo_usuario, estado, new Date()]
    );
  } catch (error) {
    throw { status: 500, message: "Error al crear el usuario" };
  }
};

// Obtener todos los usuarios
export const listarUsuarios = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    return rows;
  } catch (error) {
    throw { status: 500, message: "Error al obtener usuarios" };
  }
};

// Obtener detalles de un usuario por ID
export const obtenerDetallesUsuario = async (id) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    if (rows.length === 1) {
      const usuario = rows[0];
      return usuario;
    } else {
      throw { status: 404, message: "Usuario no encontrado" };
    }
  } catch (error) {
    console.error(error);
    throw { status: 500, message: "Error al obtener detalles del usuario" };
  }
};

// Obtener formulario para actualizar usuario seleccionado
export async function obtenerDetallesUsuarioUpdate(id) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id_usuario = ?",
      [id]
    );

    if (rows.length === 1) {
      return rows[0];
    } else {
      throw { status: 404, message: "Usuario no encontrado" };
    }
  } catch (error) {
    console.error(error);
    throw { status: 500, message: "Error al obtener detalles del usuario" };
  }
}
// Actualizar un usuario por ID
export const actualizarUsuario = async (
  id,
  { nombre_usuario, contrasena_encriptada, tipo_usuario, estado }
) => {
  try {
    // Verificar si se proporcionó una nueva contraseña encriptada
    if (contrasena_encriptada) {
      // Actualizar usuario con la nueva contraseña encriptada
      await pool.query(
        "UPDATE usuarios SET nombre_usuario = ?, contrasena_encriptada = ?, tipo_usuario = ?, estado = ? WHERE id_usuario = ?",
        [nombre_usuario, contrasena_encriptada, tipo_usuario, estado, id]
      );
    } else {
      // Si no se proporcionó una nueva contraseña, actualizar sin cambiar la contraseña
      await pool.query(
        "UPDATE usuarios SET nombre_usuario = ?, tipo_usuario = ?, estado = ? WHERE id_usuario = ?",
        [nombre_usuario, tipo_usuario, estado, id]
      );
    }
  } catch (error) {
    throw {
      status: 500,
      message: `Error al actualizar el usuario con ID ${id}`,
    };
  }
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (id) => {
  try {
    await pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [id]);
  } catch (error) {
    throw {
      status: 500,
      message: `Error al eliminar el usuario con ID ${id}`,
    };
  }
};

// Registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
    const { nombre_usuario, contrasena, confirmar_contrasena } = req.body;

    // Verificar si las contraseñas coinciden
    if (contrasena !== confirmar_contrasena) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    try {
        // Generar el hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Aquí deberías guardar 'nombre_usuario' y 'hashedPassword' en tu base de datos
        // Código para guardar en la base de datos...

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};
// usuarioController.js
function filtrarUsuarios() {
  var tipoUsuario = document.getElementById('tipoUsuario').value;
  var estadoUsuario = document.getElementById('estadoUsuario').value;
  var busquedaUsuario = document.getElementById('busquedaUsuario').value.trim().toUpperCase();

  var tabla = document.getElementById('tablaUsuarios');
  var filas = tabla.getElementsByTagName('tr');

  var usuariosEncontrados = false;

  for (var i = 1; i < filas.length; i++) {
      var mostrarFila = true;

      var nombreUsuario = filas[i].getElementsByClassName('nombreUsuario')[0].textContent.trim().toUpperCase();
      var tipoUsuarioFila = filas[i].getElementsByClassName('tipoUsuario')[0].textContent.trim().toUpperCase();
      var estadoUsuarioFila = filas[i].getElementsByClassName('estadoUsuario')[0].textContent.trim().toUpperCase();

      if (tipoUsuario && tipoUsuarioFila !== tipoUsuario) {
          mostrarFila = false;
      }

      if (estadoUsuario && estadoUsuarioFila !== estadoUsuario) {
          mostrarFila = false;
      }

      if (busquedaUsuario && nombreUsuario.indexOf(busquedaUsuario) === -1) {
          mostrarFila = false;
      }

      filas[i].style.display = mostrarFila ? '' : 'none';

      if (mostrarFila) {
          usuariosEncontrados = true;
      }
  }

  if (!usuariosEncontrados) {
      alert('Usuario no encontrado.');
  }
}


