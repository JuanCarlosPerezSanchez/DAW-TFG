//#region Imports
import jwt from 'jsonwebtoken';
//#endregion

//#region Gestión de tokens JWT
// Genera un token JWT para un usuario
function generateToken(user) {
    return jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: '24h' });
}
// Verifica y decodifica un token JWT
function verifyToken(token) {
    return jwt.verify(token, process.env.SECRET_KEY);
}
//#endregion

//#region Util
const tokenManager = {
    generateToken,
    verifyToken
};
//#endregion

export default tokenManager;
