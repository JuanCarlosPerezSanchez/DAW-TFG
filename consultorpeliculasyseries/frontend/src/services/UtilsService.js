//#region Funciones auxiliares
// Devuelve los headers de autenticación si hay token
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}
// Divide un array en filas de tamaño fijo, rellenando con null si es necesario
function splitInRows(items, size) {
    const filas = [];
    for (let i = 0; i < (items?.length || 0); i += size) {
        const fila = items.slice(i, i + size);
        while (fila.length < size) fila.push(null);
        filas.push(fila);
    }
    return filas;
}
// Elimina duplicados por media_type y id de un array de objetos.
function getUniqueByMediaTypeAndId(arr) {
    const seen = new Set();
    return arr.filter(item => {
        const type = item.media_type ? item.media_type : (item.first_air_date ? "tv" : "movie");
        const key = `${type}-${item.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}
// Obtiene el usuario del localStorage (null si no hay)
function getUserFromStorage() {
    const userData = localStorage.getItem("user");
    if (!userData || userData === "undefined" || userData === "null") return null;
    try {
        const parsed = JSON.parse(userData);
        if (typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    } catch {}
    return null;
}
// Filtra resultados de búsqueda y solo guarda peliculas y series excluyendo personas
function filterSearchResults(data) {
    return data.results
        ? data.results.filter(r => r.media_type === "movie" || r.media_type === "tv")
        : [];
}
// Formatea fecha y hora a string legible
function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const pad = n => n.toString().padStart(2, "0");
    const hora = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const fecha = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    return `${fecha} - ${hora}`;
}
// Fuerza salto de línea cada N caracteres sin cortar palabras
function wrapText(text, maxLen = 60) {
    if (!text) return "";
    const words = text.split(" ");
    let lines = [];
    let line = "";
    words.forEach(word => {
        if ((line + word).length > maxLen) {
            lines.push(line.trim());
            line = "";
        }
        line += word + " ";
    });
    if (line.trim()) lines.push(line.trim());
    return lines.join("\n");
}
//#endregion

//#region Servicio
const UtilsService = {
    splitInRows,
    getAuthHeaders,
    getUniqueByMediaTypeAndId,
    getUserFromStorage,
    filterSearchResults,
    formatDate,
    wrapText
};
//#endregion

export default UtilsService;
