const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM seguridad.usuarios');
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM seguridad.usuarios WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol_id } = req.body;
  try {
    const result = await db.query(
      'UPDATE seguridad.usuarios SET nombre = $1, email = $2, rol_id = $3 WHERE id = $4 RETURNING *',
      [nombre, email, rol_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM seguridad.usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
    const validPassword = await bcrypt.compare(password, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    res.status(200).json({
      nombre: user.nombre,
      rol: user.rol ? user.rol.nombre : null
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, nombre, rol_id = 'admin', empresa } = req.body;

  try {
    
    const empresaResult = await db.query(
      `INSERT INTO configuracion.empresa
        (id, nombre_empresa, rif, direccion, telefono, email, fecha_creacion, estado, representante, logo, pais, ciudad, municipio, edo_estado, sector_economico, actividad_economica)
        VALUES (DEFAULT, $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id`,
      [
        empresa.nombre_empresa || '',
        empresa.rif || '',
        empresa.direccion || '',
        empresa.telefono || '',
        empresa.email || '',
        empresa.estado || 'activo',
        empresa.representante || '',
        empresa.logo || '',
        empresa.pais || 'Venezuela',
        empresa.ciudad || '',
        empresa.municipio || '',
        empresa.edo_estado || '',
        empresa.sector_economico || '',
        empresa.actividad_economica || ''
      ]
    );

    const empresaId = empresaResult.rows[0].id;

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuarioResult = await db.query(
      `INSERT INTO seguridad.usuarios
        (id, nombre, email, contraseña, rol_id, fecha_creacion, ultimo_acceso, empresa_id)
        VALUES (DEFAULT, $1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $5)
        RETURNING *`,
      [
        nombre,
        email,
        hashedPassword,
        rol_id,
        empresaId
      ]
    );

    res.status(201).json(usuarioResult.rows[0]);

  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario y empresa', error });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM seguridad.roles');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
};
