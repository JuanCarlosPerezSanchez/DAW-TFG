//#region Imports
import express from 'express';
import authRoutes from './usersRoutes.js';
import commentRoutes from './commentRoutes.js';
import tmdbRoutes from './tmdbRoutes.js';
//#endregion

//#region Express Router
const router = express.Router();
//#endregion

//#region Rutas
// Rutas de autenticación y gestión de usuario
router.use('/user', authRoutes);
// Rutas de comentarios (crear, obtener, actualizar, eliminar)
router.use('/comments', commentRoutes);
// Rutas de consulta a TMDB (películas, series, géneros, etc.)
router.use('/tmdb', tmdbRoutes);
//#endregion

export default router;
