//#region Imports
import { useEffect, useState } from "react";
import RequireAuthPageService from "./RequireAuthPageService";
import Footer from "../../components/Footer/Footer";
import "./RequireAuthPage.css";
//#endregion

const RequireAuthPage = ({ children }) => {
    //#region Constantes
    const [expired, setExpired] = useState(false);
    //#endregion

    //#region Eventos
    // Comprueba expiración de sesión al montar el componente
    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (user && token && RequireAuthPageService.isTokenExpired(token)) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setExpired(true);
        }
    }, []);
    //#endregion

    //#region Renderizado
    const user = localStorage.getItem("user");
    if (!user || expired) {
        return (
            <div>
                <div className="require-auth-outer">
                    <div className="require-auth-inner">
                        {expired
                            ? "Tu sesión ha caducado. Por favor, inicia sesión de nuevo."
                            : "Debes iniciar sesión para tener acceso a esta página."
                        }
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
    return children;
    //#endregion
};

export default RequireAuthPage;
