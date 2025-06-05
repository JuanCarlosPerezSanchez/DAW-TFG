import express from 'express';
import { register, login, getUserGallery, addToGallery, deleteFromGallery } from '../controllers/usersAndAuthController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/gallery', authMiddleware, getUserGallery);
router.post('/gallery', authMiddleware, addToGallery);
router.delete('/gallery', authMiddleware, deleteFromGallery);

export default router;