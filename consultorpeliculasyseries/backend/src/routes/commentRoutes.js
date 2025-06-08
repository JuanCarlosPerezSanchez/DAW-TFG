//#region Imports
import express from 'express';
import commentController from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
//#endregion

//#region Express Router
const router = express.Router();
//#endregion

//#region Rutas
// Crear un comentario (requiere autenticación)
router.post('/', authMiddleware, commentController.createComment);
// Obtener comentarios de una película o serie (público)
router.get('/', commentController.getComments);
// Actualizar un comentario (requiere autenticación)
router.put('/:id', authMiddleware, commentController.updateComment);
// Eliminar un comentario (requiere autenticación)
router.delete('/:id', authMiddleware, commentController.deleteComment);
//#endregion

export default router;
