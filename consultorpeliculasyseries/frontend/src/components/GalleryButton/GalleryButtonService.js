//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestión de galería de usuario
// Añade un contenido a la galería del usuario
async function addToGallery({ id, media_type, title, overview, image_url }) {
    const res = await fetch(`${BASE_URL}/api/user/gallery`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...UtilsService.getAuthHeaders()
        },
        body: JSON.stringify({
            id,
            media_type,
            title,
            overview,
            poster_path: image_url ? image_url.replace("https://image.tmdb.org/t/p/w500", "") : ""
        })
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg || data.message || "No se pudo añadir a tu galería");
    }
}
// Elimina un contenido de la galería del usuario
async function removeFromGallery(id, media_type) {
    const res = await fetch(`${BASE_URL}/api/user/gallery`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...UtilsService.getAuthHeaders()
        },
        body: JSON.stringify({ id, media_type })
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg || data.message || "No se pudo eliminar de tu galería");
    }
}
// Comprueba si un contenido(pelicula/serie) está en la galería del usuario
async function checkIfInGallery(id, media_type) {
    const res = await fetch(`${BASE_URL}/api/user/gallery`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data) && data.some(item =>
        String(item.id) === String(id) && item.media_type === media_type
    );
}
//#endregion

//#region Servicio
const GalleryButtonService = {
    addToGallery,
    removeFromGallery,
    checkIfInGallery,
    getAuthHeaders: UtilsService.getAuthHeaders
};
//#endregion

export default GalleryButtonService;
