//#region Funciones auxiliares
// Comprueba si el token JWT ha expirado
function isTokenExpired(token) {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}
//#endregion

//#region Servicio
const RequireAuthPageService = {
    isTokenExpired
};
//#endregion

export default RequireAuthPageService;
