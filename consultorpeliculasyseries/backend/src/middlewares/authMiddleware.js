//#region Imports
import tokenManager from '../utils/tokenManager.js';
//#endregion

//#region Middleware de autenticación
// Middleware que verifica el token JWT enviado en la cabecera Authorization.
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = tokenManager.verifyToken(token);
        req.user = decoded.user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}
//#endregion
