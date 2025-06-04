//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Funciones auxiliares
// Busca resultados según el query
async function fetchSearchResults(query) {
    const res = await fetch(`${BASE_URL}/tmdb/search?query=${encodeURIComponent(query)}&page=1`, {
        headers: {
            ...UtilsService.getAuthHeaders()
        }
    });
    if (!res.ok) throw new Error("Error buscando resultados");
    return await res.json();
}
//#endregion

//#region Servicio
const SearchResultsPageService = {
    fetchSearchResults
};
//#endregion

export default SearchResultsPageService;
