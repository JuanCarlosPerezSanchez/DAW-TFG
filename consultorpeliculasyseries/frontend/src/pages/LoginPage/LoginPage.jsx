//#region Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import LoginPageService from "./LoginPageService";
import "../../styles/LoginAndRegister.css";
//#endregion

//#region Componente
const LoginPage = () => {
    //#region Constantes
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    //#endregion

    //#region Funciones auxiliares
    // Resetea los mensajes de error y éxito.
    const resetMessages = () => {
        setError("");
        setSuccess("");
    };
    // Limpia los mensajes y actualiza el estado del formulario.
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        resetMessages();
    };
    // Guarda el token y usuario, muestra mensaje y redirige tras login correcto.
    const handleLoginSuccess = (data) => {
        setSuccess("¡Login correcto! Redirigiendo...");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
            navigate("/");
            window.location.reload();
        }, 1000);
    };
    // Muestra el mensaje de error cuando ocurre un error en el login.
    const handleLoginError = (err) => {
        setError(err.message);
    };
    // Maneja el envío del formulario de login (valida, realiza el login y gestiona el resultado).
    const handleSubmit = async e => {
        e.preventDefault();
        resetMessages();

        const validationError = LoginPageService.validateForm(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const data = await LoginPageService.login(form.email, form.password);
            handleLoginSuccess(data);
        } catch (err) {
            handleLoginError(err);
        }
    };
    //#endregion

    //#region Renderizado
    return (
        <div className="login-bg">
            <form className="login-form" onSubmit={handleSubmit}>
                <input type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />
                <input type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                />
                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}
                <button type="submit">Iniciar sesión</button>
                <div className="login-register-link">
                    Si aun no tienes cuenta{" "}
                    <Link to="/register">Regístrate aquí</Link>
                </div>
            </form>
            <Footer />
        </div>
    );
    //#endregion
};

export default LoginPage;
