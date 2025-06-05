//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestion de la API
async function fetchPopularMovies(page = 1) {
    const res = await fetch(`${BASE_URL}/tmdb/movie/popular?page=${page}`, {
        headers: {
            ...UtilsService.getAuthHeaders()
        }
    });
    if (!res.ok) throw new Error("Error cargando películas populares");
    return await res.json();
}
// Obtiene películas por géneros y página (una sola petición)
async function fetchMoviesByGenres(genresArray, page = 1) {
    if (!genresArray.length) return [];
    const withGenres = genresArray.join(",");
    const res = await fetch(`${BASE_URL}/tmdb/discover/movie?page=${page}&with_genres=${withGenres}`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    const data = await res.json();
    return data.results || [];
}
// Obtiene películas por géneros y varias páginas (una sola petición por página)
async function fetchMoviesByGenresMultiplePages(genresArray, pages = [1, 2]) {
    if (!genresArray.length) return [];
    const withGenres = genresArray.join(",");
    const promises = pages.map(page =>
        fetch(`${BASE_URL}/tmdb/discover/movie?page=${page}&with_genres=${withGenres}`, {
            headers: { ...UtilsService.getAuthHeaders() }
        }).then(res => res.json())
    );
    const results = await Promise.all(promises);
    return results.flatMap((data) => data.results || []);
}
// Obtiene la galería del usuario autenticado
async function fetchUserGallery() {
    const res = await fetch(`${BASE_URL}/user/gallery`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    if (!res.ok) return [];
    return await res.json();
}
//#endregion

//#region Servicio
const MoviesPageService = {
    fetchPopularMovies,
    fetchMoviesByGenres,
    fetchMoviesByGenresMultiplePages,
    fetchUserGallery
};
//#endregion

export default MoviesPageService;
