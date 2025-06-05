import express from 'express';
import { createComment, getComments, updateComment, deleteComment } from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/comments
router.post('/', authMiddleware, createComment);

// GET /api/comments?media_type=movie&media_id=123
router.get('/', getComments);

// PUT /api/comments/:id
router.put('/:id', authMiddleware, updateComment);

// DELETE /api/comments/:id
router.delete('/:id', authMiddleware, deleteComment);

export default router;