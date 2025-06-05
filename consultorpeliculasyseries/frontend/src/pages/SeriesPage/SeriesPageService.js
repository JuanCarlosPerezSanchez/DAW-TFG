//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestion de obtencion de medias segin los géneros
// Obtiene series populares (paginadas)
async function fetchPopularSeries(page = 1) {
    const res = await fetch(`${BASE_URL}/api/tmdb/tv/popular?page=${page}`, {
        headers: { ...UtilsService.getAuthHeaders() }
    });
    if (!res.ok) throw new Error("Error cargando series populares");
    return await res.json();
}
// Obtiene series por géneros y páginas indicadas (una sola petición por página)
async function fetchByGenres(genresArray, pages) {
    if (!genresArray.length) return [];
    const withGenres = genresArray.join(",");
    const promises = pages.map(page =>
        fetch(`${BASE_URL}/api/tmdb/discover/tv?page=${page}&with_genres=${withGenres}`, {
            headers: { ...UtilsService.getAuthHeaders() }
        }).then(res => res.json())
    );
    const results = await Promise.all(promises);
    return results.flatMap((data) => data.results || []);
}
//#endregion

//#region Funciones auxiliares
// Obtiene las series iniciales según los géneros seleccionados
async function fetchInitialSeries(selectedGenres) {
    if (selectedGenres.includes("0")) {
        const [data1, data2] = await Promise.all([
            fetchPopularSeries(1),
            fetchPopularSeries(2)
        ]);
        const series = [...(data1.results || []), ...(data2.results || [])].filter(s => (s.media_type === "tv" || !s.media_type));
        const hasMore = data2.page < data2.total_pages;
        return { series, hasMore };
    } else {
        const genresArray = selectedGenres.includes("0") ? [] : selectedGenres;
        const combinedResults = await fetchByGenres(genresArray, [1, 2]);
        const series = combinedResults.filter(s => (s.media_type === "tv" || !s.media_type));
        const hasMore = series.length > 0;
        return { series, hasMore };
    }
}
// Obtiene más series para scroll infinito según los géneros seleccionados y la página
async function fetchMoreSeries(selectedGenres, page) {
    if (selectedGenres.includes("0")) {
        const [dataA, dataB] = await Promise.all([
            fetchPopularSeries(page - 1),
            fetchPopularSeries(page)
        ]);
        const series = [...(dataA.results || []), ...(dataB.results || [])].filter(s => (s.media_type === "tv" || !s.media_type));
        const hasMore = dataB.page < dataB.total_pages;
        return { series, hasMore };
    } else {
        const genresArray = selectedGenres.includes("0") ? [] : selectedGenres;
        const combinedResults = await fetchByGenres(genresArray, [page - 1, page]);
        const series = combinedResults.filter(s => (s.media_type === "tv" || !s.media_type));
        const hasMore = series.length > 0;
        return { series, hasMore };
    }
}
//#endregion

//#region Servicio
const SeriesPageService = {
    fetchInitialSeries,
    fetchMoreSeries
};
//#endregion

export default SeriesPageService;
