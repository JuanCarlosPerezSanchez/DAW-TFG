//#region Imports
import bcrypt from 'bcryptjs';
//#endregion

//#region Gestión de hash de contraseñas
// Hashea una contraseña usando bcrypt
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}
// Compara una contraseña con su hash
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
//#endregion

//#region Util
const hashPasswordManager = {
    hashPassword,
    comparePassword
};
//#endregion

export default hashPasswordManager;
