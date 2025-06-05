//#region Imports
import { useEffect, useState } from "react";
//#endregion

//#region Funciones auxiliares globales
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

const GlobalSessionWatcher = () => {
    //#region Constantes
    const [expired, setExpired] = useState(false);
    //#endregion

    //#region Eventos
    // Comprueba periódicamente si el token ha expirado y desloguea al usuario si es así
    useEffect(() => {
        let interval;
        function checkToken() {
            const user = localStorage.getItem("user");
            const token = localStorage.getItem("token");
            if (user && token && isTokenExpired(token)) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setExpired(true);
            }
        }
        checkToken();
        interval = setInterval(checkToken, 1000);
        return () => clearInterval(interval);
    }, []);
    // Cuando expira el token muestra un aviso y recarga la página para forzar logout del usuario actual
    useEffect(() => {
        if (expired) {
            alert("Tu sesión ha caducado. Por favor, inicia sesión de nuevo.");
            window.location.reload();
        }
    }, [expired]);
    //#endregion

    // No renderiza nada en la UI ya que solo gestiona la sesión de usuario activo
    return null;
};

export default GlobalSessionWatcher;
