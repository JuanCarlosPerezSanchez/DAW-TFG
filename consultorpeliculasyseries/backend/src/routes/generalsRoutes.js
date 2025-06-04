import express from 'express';
import authRoutes from './usersRoutes.js';
import commentRoutes from './commentRoutes.js';
import tmdbRoutes from './tmdbRoutes.js'; // asegúrate de que existe

const router = express.Router();

router.use('/user', authRoutes);
router.use('/comments', commentRoutes);
router.use('/tmdb', tmdbRoutes); // sin auth

export default router;