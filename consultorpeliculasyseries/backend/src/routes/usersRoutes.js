//#region Imports
import express from 'express';
import usersAndAuthController from '../controllers/usersAndAuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
//#endregion

//#region Express Router
const router = express.Router();
//#endregion

//#region Rutas
// Registrar un nuevo usuario
router.post('/register', usersAndAuthController.register);
// Login de usuario
router.post('/login', usersAndAuthController.login);
// Obtener galería del usuario autenticado
router.get('/gallery', authMiddleware, usersAndAuthController.getUserGallery);
// Añadir contenido a la galería del usuario autenticado
router.post('/gallery', authMiddleware, usersAndAuthController.addToGallery);
// Eliminar contenido de la galería del usuario autenticado
router.delete('/gallery', authMiddleware, usersAndAuthController.deleteFromGallery);
//#endregion

export default router;
