import Comment from '../models/Comment.js';

// Crear un comentario
const createComment = async (req, res) => {
    const { text } = req.body;
    try {
        const newComment = new Comment({ userId: req.user.id, text });
        await newComment.save();
        res.json(newComment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Obtener todos los comentarios
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('userId', 'name');

        const restructured = comments.map(comment => ({
            userName: comment.userId.name,
            text: comment.text
        }));

        res.json(restructured);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Actualizar un comentario
const updateComment = async (req, res) => {
    const { text } = req.body;
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ msg: 'El comentario que buscas no existe' });
        }

        if (comment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado' });
        }

        comment.text = text;
        await comment.save();

        res.json(comment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Eliminar un comentario
const deleteComment = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ msg: 'El cometario que buscas no existe' });
        }

        if (comment.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Usuario no autorizado' });
        }

        await comment.remove();
        res.json({ msg: 'El cometario ha sido eliminado correctamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export { createComment, getComments, updateComment, deleteComment };