//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestion de géneros
// Obtiene y combina los géneros de películas y series, eliminando duplicados
async function fetchAllGenres() {
    const [movieRes, tvRes] = await Promise.all([
        fetch(`${BASE_URL}/tmdb/genre/movie/list`),
        fetch(`${BASE_URL}/tmdb/genre/tv/list`)
    ]);
    const movieData = await movieRes.json();
    const tvData = await tvRes.json();
    const mergedGenres = [...(movieData.genres || []), ...(tvData.genres || [])];
    // Elimina duplicados por id
    return Array.from(new Map(mergedGenres.map((g) => [g.id, g])).values());
}
//#endregion

//#region Servicio
const AppService = {
    fetchAllGenres
};
//#endregion

export default AppService;
