import Comment from '../models/Comment.js';

// Crear un comentario
const createComment = async (req, res) => {
    // Recoge media_type, media_id, comment, createdAt del body
    const { media_type, media_id, comment, createdAt } = req.body;
    try {
        const newComment = new Comment({
            userId: req.user.id,
            media_type,
            media_id,
            text: comment,
            createdAt: createdAt || new Date()
        });
        await newComment.save();
        // Devuelve también el nombre del usuario
        await newComment.populate('userId', 'nameUser');
        res.status(201).json({
            _id: newComment._id,
            userName: newComment.userId.nameUser,
            userId: newComment.userId._id,
            text: newComment.text,
            createdAt: newComment.createdAt,
            media_type: newComment.media_type,
            media_id: newComment.media_id
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Obtener comentarios de una película/serie concreta
const getComments = async (req, res) => {
    try {
        // Filtra por media_type y media_id
        const { media_type, media_id } = req.query;
        const filter = {};
        if (media_type) filter.media_type = media_type;
        if (media_id) filter.media_id = media_id;

        const comments = await Comment.find(filter)
            .populate('userId', 'nameUser')
            .sort({ createdAt: 1 });

        const restructured = comments.map(comment => ({
            _id: comment._id,
            userName: comment.userId?.nameUser || 'Usuario',
            userId: comment.userId?._id,
            text: comment.text,
            createdAt: comment.createdAt,
            media_type: comment.media_type,
            media_id: comment.media_id
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