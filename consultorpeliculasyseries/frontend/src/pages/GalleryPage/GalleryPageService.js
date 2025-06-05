//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Obtención de galería de usuario
// Obtiene la galería del usuario autenticado
async function fetchGallery() {
    const res = await fetch(`${BASE_URL}/api/user/gallery`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.msg || data.message || "Error al cargar tu galería");
    }
    return await res.json();
}
//#endregion

//#region Servicio
const GalleryPageService = {
    fetchGallery
};
//#endregion

export default GalleryPageService;
