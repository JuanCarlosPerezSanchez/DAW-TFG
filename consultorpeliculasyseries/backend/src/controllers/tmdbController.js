//#region Imports
import tmdbService from '../services/tmdbService.js';
//#endregion

//#region Gestión de TMDB
// Buscar películas y series por coincidencia de texto
const searchMulti = async (req, res) => {
    try {
        const { query, page = 1 } = req.query;
        const response = await tmdbService.searchMulti(query, page);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching search results' });
    }
};
// Obtener películas populares
const getPopularMovies = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const response = await tmdbService.getPopularMovies(page);
        res.json(response.data);
    } catch (error) {
        console.error('Error en getPopularMovies:', error.message);
        res.status(500).json({ message: 'Error al obtener películas populares de TMDB', detail: error.message });
    }
};
// Obtener series populares
const getPopularSeries = async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const response = await tmdbService.getPopularSeries(page);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching popular series' });
    }
};
// Obtener géneros de películas
const getMovieGenres = async (req, res) => {
    try {
        const response = await tmdbService.getMovieGenres();
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching movie genres' });
    }
};
// Obtener géneros de series
const getTvGenres = async (req, res) => {
    try {
        const response = await tmdbService.getTvGenres();
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching tv genres' });
    }
};
// Descubrir películas o series por género
const discoverByGenre = async (req, res) => {
    try {
        const { type } = req.params;
        const { page = 1, with_genres } = req.query;
        const response = await tmdbService.discoverByGenre(type, page, with_genres);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching discover results' });
    }
};
// Obtener detalles de una película o serie
const getDetails = async (req, res) => {
    try {
        const { type, id } = req.params;
        const data = await tmdbService.getDetails(type, id);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching details' });
    }
};
//#endregion

//#region Controlador
const tmdbController = {
    searchMulti,
    getPopularMovies,
    getPopularSeries,
    getMovieGenres,
    getTvGenres,
    discoverByGenre,
    getDetails
};
//#endregion

export default tmdbController;
