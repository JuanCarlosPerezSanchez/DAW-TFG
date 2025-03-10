import express from 'express';
import { createComment, getComments, updateComment, deleteComment } from '../controllers/commentController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/createComment', auth, createComment);

router.get('/getComments', auth, getComments);

router.put('/updateComment/:id', auth, updateComment);

router.delete('/deleteComment/:id', auth, deleteComment);

export default router;