//#region Imports
import express from 'express';
import tmdbController from '../controllers/tmdbController.js';
//#endregion

//#region Express Router
const router = express.Router();
//#endregion

//#region Rutas
// Buscar películas y series por texto
router.get('/search', tmdbController.searchMulti);
// Obtener películas populares
router.get('/movie/popular', tmdbController.getPopularMovies);
// Obtener series populares
router.get('/tv/popular', tmdbController.getPopularSeries);
// Obtener géneros de películas
router.get('/genre/movie/list', tmdbController.getMovieGenres);
// Obtener géneros de series
router.get('/genre/tv/list', tmdbController.getTvGenres);
// Descubrir películas o series por género
router.get('/discover/:type', tmdbController.discoverByGenre);
// Obtener detalles de una película o serie
router.get('/:type/:id', tmdbController.getDetails);
//#endregion

export default router;
