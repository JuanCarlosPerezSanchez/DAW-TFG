//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestión de registro de usuario
// Llama a la API para registrar un nuevo usuario.
async function registerUser({ email, nameUser, password }) {
    try {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, nameUser, password })
        });
        const text = await res.text();
        let data = {};
        try {
            data = JSON.parse(text);
        } catch {
            return { error: "Respuesta inesperada del servidor. " + (text.length < 200 ? text : text.slice(0, 200) + "...") };
        }
        if (!res.ok) {
            return { error: data.msg || data.message || "Error al registrar el usuario." };
        }
        return data;
    } catch {
        return { error: "No se pudo conectar con el servidor. ¿Está el backend levantado y la URL es correcta?" };
    }
}
// Valida los campos del formulario de registro.
function validateRegisterForm(form) {
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        return "Introduce un correo electrónico válido.";
    }
    if (form.password !== form.confirm) {
        return "Las contraseñas no coinciden.";
    }
    if (!form.nameUser || !form.nameUser.trim()) {
        return "El nombre de usuario es obligatorio.";
    }
    return null;
}
//#endregion

//#region Servicio
const RegisterPageService = {
    registerUser,
    validateRegisterForm
};
//#endregion

export default RegisterPageService;
