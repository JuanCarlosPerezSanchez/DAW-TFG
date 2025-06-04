import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL;

//#region searchMulti
export const searchMulti = async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY is not configured on the backend' });
    }
    try {
        const { query, page = 1 } = req.query;
        const response = await axios.get(`${BASE_URL}/search/multi`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                query,
                page,
                include_adult: true
            }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching search results' });
    }
};
//#endregion

//#region getPopularMovies
export const getPopularMovies = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        // Incluye videos y providers en la respuesta
        const response = await axios.get(`${BASE_URL}/movie/popular`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                page,
                append_to_response: 'videos,watch/providers,credits'
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error en getPopularMovies:', error.message);
        res.status(500).json({ message: 'Error al obtener películas populares de TMDB', detail: error.message });
    }
};
//#endregion

//#region getPopularSeries
export const getPopularSeries = async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY is not configured on the backend' });
    }
    try {
        const { page = 1 } = req.query;
        // Incluye videos y providers en la respuesta
        const response = await axios.get(`${BASE_URL}/tv/popular`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                page,
                append_to_response: 'videos,watch/providers,credits'
            }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching popular series' });
    }
};
//#endregion

//#region getMovieGenres
export const getMovieGenres = async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY is not configured on the backend' });
    }
    try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
            params: { api_key: API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching movie genres' });
    }
};
//#endregion

//#region getTvGenres
export const getTvGenres = async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY is not configured on the backend' });
    }
    try {
        const response = await axios.get(`${BASE_URL}/genre/tv/list`, {
            params: { api_key: API_KEY, language: 'es-ES' }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching tv genres' });
    }
};
//#endregion

//#region discoverByGenre
export const discoverByGenre = async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY is not configured on the backend' });
    }
    try {
        const { type } = req.params; // movie or tv
        const { page = 1, with_genres } = req.query;
        // Incluye videos y providers en la respuesta
        const response = await axios.get(`${BASE_URL}/discover/${type}`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                page,
                with_genres,
                append_to_response: 'videos,watch/providers,credits'
            }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discover results' });
    }
};
//#endregion

//#region getDetails
export const getDetails = async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: 'API_KEY is not configured on the backend' });
    }
    try {
        const { type, id } = req.params; // type: movie or tv

        // 1. Petición en español (con append_to_response)
        const responseEs = await axios.get(`${BASE_URL}/${type}/${id}`, {
            params: {
                api_key: API_KEY,
                language: 'es-ES',
                append_to_response: 'videos,credits,watch/providers'
            }
        });

        // 2. Petición solo de videos en inglés
        const responseEn = await axios.get(`${BASE_URL}/${type}/${id}/videos`, {
            params: {
                api_key: API_KEY,
                language: 'en-US'
            }
        });

        // 3. Añade los vídeos en inglés como propiedad extra
        const data = {
            ...responseEs.data,
            videos_en: responseEn.data // videos_en.results = array de vídeos en inglés
        };

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching details' });
    }
};
//#endregion



