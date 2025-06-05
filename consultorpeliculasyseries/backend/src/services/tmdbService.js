//#region Imports
import dotenv from 'dotenv';
import axios from 'axios';
//#endregion

dotenv.config();

//#region Constantes
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;
//#endregion

//#region Gestión de llamadas a la API de TMDB
// Buscar películas y series por coincidencia de texto
async function searchMulti(query, page = 1) {
    return axios.get(`${BASE_URL}/search/multi`, {
        params: {
            api_key: API_KEY,
            language: 'es-ES',
            query,
            page,
            include_adult: true
        }
    });
}
// Obtener películas populares
async function getPopularMovies(page = 1) {
    return axios.get(`${BASE_URL}/movie/popular`, {
        params: {
            api_key: API_KEY,
            language: 'es-ES',
            page,
            append_to_response: 'videos,watch/providers,credits'
        }
    });
}
// Obtener series populares
async function getPopularSeries(page = 1) {
    return axios.get(`${BASE_URL}/tv/popular`, {
        params: {
            api_key: API_KEY,
            language: 'es-ES',
            page,
            append_to_response: 'videos,watch/providers,credits'
        }
    });
}
// Obtener géneros de películas
async function getMovieGenres() {
    return axios.get(`${BASE_URL}/genre/movie/list`, {
        params: { api_key: API_KEY, language: 'es-ES' }
    });
}
// Obtener géneros de series
async function getTvGenres() {
    return axios.get(`${BASE_URL}/genre/tv/list`, {
        params: { api_key: API_KEY, language: 'es-ES' }
    });
}
// Descubrir películas o series por género
async function discoverByGenre(type, page = 1, with_genres) {
    return axios.get(`${BASE_URL}/discover/${type}`, {
        params: {
            api_key: API_KEY,
            language: 'es-ES',
            page,
            with_genres,
            append_to_response: 'videos,watch/providers,credits'
        }
    });
}
// Obtener detalles de una película o serie (incluye videos en español e inglés)
async function getDetails(type, id) {
    // Español con append_to_response
    const responseEs = await axios.get(`${BASE_URL}/${type}/${id}`, {
        params: {
            api_key: API_KEY,
            language: 'es-ES',
            append_to_response: 'videos,credits,watch/providers',
        }
    });
    // Solo videos en inglés
    const responseEn = await axios.get(`${BASE_URL}/${type}/${id}/videos`, {
        params: {
            api_key: API_KEY,
            language: 'en-US',
        }
    });
    return {
        ...responseEs.data,
        videos_en: responseEn.data
    };
}
//#endregion

//#region Servicio
const tmdbService = {
    searchMulti,
    getPopularMovies,
    getPopularSeries,
    getMovieGenres,
    getTvGenres,
    discoverByGenre,
    getDetails
};
//#endregion

export default tmdbService;
