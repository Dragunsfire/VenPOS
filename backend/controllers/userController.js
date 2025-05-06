// backend/controllers/userController.js

const db = require('../db');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

exports.createUser = async (req, res) => {
  const { email, password, nombre } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO users (email, password, nombre) VALUES ($1, $2, $3) RETURNING *',
      [email, password, nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error });
  }
};

// Puedes agregar más controladores según las necesidades
