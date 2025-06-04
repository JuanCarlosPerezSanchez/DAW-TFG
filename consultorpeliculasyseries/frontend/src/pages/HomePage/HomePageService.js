//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Obtención de datos media
// Obtiene películas populares (paginadas)
async function fetchPopularMovies(page = 1) {
    const res = await fetch(`${BASE_URL}/tmdb/movie/popular?page=${page}`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    if (!res.ok) throw new Error("Error cargando películas populares");
    return await res.json();
}
// Obtiene series populares (paginadas)
async function fetchPopularSeries(page = 1) {
    const res = await fetch(`${BASE_URL}/tmdb/tv/popular?page=${page}`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    if (!res.ok) throw new Error("Error cargando series populares");
    return await res.json();
}
// Obtiene resultados por género (paginados, una sola petición por tipo)
async function fetchByGenres(type, genresArray, page = 1) {
    if (!genresArray.length) return [];
    const withGenres = genresArray.join(",");
    const res = await fetch(`${BASE_URL}/tmdb/discover/${type}?page=${page}&with_genres=${withGenres}`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    const data = await res.json();
    return data.results || [];
}
//#endregion

//#region Servicio
const HomePageService = {
    fetchPopularMovies,
    fetchPopularSeries,
    fetchByGenres
};
//#endregion

export default HomePageService;
