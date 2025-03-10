import { verifyToken } from '../utils/auth.js';

const auth = (req, res, next) => {
    const token = req.header('userToken');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth;