//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestión de login
// Realiza la petición de login al backend.
async function login(email, password) {
    const url = BASE_URL.endsWith("/")
        ? `${BASE_URL}user/login`
        : `${BASE_URL}/user/login`;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const text = await res.text();
    let data = {};
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            "Respuesta inesperada del servidor. " +
            (text.length < 200 ? text : text.slice(0, 200) + "...")
        );
    }

    if (!res.ok) {
        throw new Error(data.msg || data.message || "Usuario o contraseña incorrectos.");
    }
    return data;
}
// Valida el formulario de login.
function validateForm(form) {
    if (!form.email.trim() || !form.password) {
        return "Rellena todos los campos.";
    }
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!isEmail) {
        return "Introduce un correo electrónico válido.";
    }
    return null;
}
//#endregion

//#region Servicio
const LoginPageService = {
    validateForm,
    login
};
//#endregion

export default LoginPageService;
