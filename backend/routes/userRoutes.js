// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas de usuario
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;
