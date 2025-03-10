import express from 'express';
import authRoutes from './usersRoutes.js';
import commentRoutes from './commentRoutes.js';

const router = express.Router();

router.use('/user', authRoutes);

router.use('/comments', commentRoutes);

export default router;