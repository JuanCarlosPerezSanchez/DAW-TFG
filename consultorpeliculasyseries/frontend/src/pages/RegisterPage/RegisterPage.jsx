//#region Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";
import RegisterPageService from "./RegisterPageService";
import "../../styles/LoginAndRegister.css";
//#endregion

const RegisterPage = () => {
    //#region Constantes
    const [form, setForm] = useState({
        email: "",
        nameUser: "",
        password: "",
        confirm: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    //#endregion

    //#region Funciones auxiliares
    // Maneja los cambios en los campos del formulario
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };
    // Maneja el envío del formulario de registro
    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validaciones de campos (delegadas al servicio)
        const validationError = RegisterPageService.validateRegisterForm(form);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const data = await RegisterPageService.registerUser({
                email: form.email,
                nameUser: form.nameUser,
                password: form.password
            });
            if (data.error) {
                setError(data.error);
            } else {
                setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
                setTimeout(() => navigate("/login"), 1200);
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor. ¿Está el backend levantado y la URL es correcta?");
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
                <input type="text"
                    name="nameUser"
                    placeholder="Nombre de usuario"
                    value={form.nameUser}
                    onChange={handleChange}
                    required
                />
                <input type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />
                <input type="password"
                    name="confirm"
                    placeholder="Confirmar contraseña"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />
                {error && <div className="login-error">{error}</div>}
                {success && <div className="login-success">{success}</div>}
                <button type="submit">Registrarse</button>
            </form>
            <Footer />
        </div>
    );
    //#endregion
};

export default RegisterPage;
