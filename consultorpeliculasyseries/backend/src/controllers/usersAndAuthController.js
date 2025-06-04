import User from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/hashPasswordManager.js';
import { generateToken } from '../utils/tokenManager.js';
import Gallery from '../models/Gallery.js';

const register = async (req, res) => {
    const { nameUser, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Ese correo electronico ya está registrado' });
        }

        const hashedPassword = await hashPassword(password);

        user = new User({ nameUser, email, password: hashedPassword });
        await user.save();

        const payload = { user: { id: user._id, nameUser: user.nameUser, email: user.email } };
        const token = generateToken(payload.user);
        res.status(201).json({ token, user: { id: user._id, nameUser: user.nameUser, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Correo incorrecto' });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        const payload = { user: { id: user._id, nameUser: user.nameUser, email: user.email } };
        const token = generateToken(payload.user);
        res.json({ token, user: { id: user._id, nameUser: user.nameUser, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const addToGallery = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, media_type, title, name, overview, poster_path } = req.body;
        const exists = await Gallery.findOne({ userId, id, media_type });
        if (exists) {
            return res.status(400).json({ msg: 'Ya está en tu galería' });
        }
        const item = new Gallery({
            userId,
            id,
            media_type,
            title,
            name,
            overview,
            poster_path
        });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ msg: 'Error al guardar en galería' });
    }
};

const getUserGallery = async (req, res) => {
    try {
        const userId = req.user.id;
        const items = await Gallery.find({ userId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ msg: 'Error al obtener la galería del usuario' });
    }
};

const deleteFromGallery = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, media_type } = req.body;
        const result = await Gallery.findOneAndDelete({ userId, id, media_type });
        if (!result) {
            return res.status(404).json({ msg: 'No se encontró el elemento en tu galería' });
        }
        res.json({ msg: 'Eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ msg: 'No se pudo eliminar de tu galería' });
    }
};

export { register, login, getUserGallery, addToGallery, deleteFromGallery };