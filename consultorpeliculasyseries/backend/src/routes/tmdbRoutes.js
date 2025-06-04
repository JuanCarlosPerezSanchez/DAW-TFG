import express from 'express';
import * as tmdbController from '../controllers/tmdbController.js';
const router = express.Router();

// Rutas para búsqueda
router.get('/search', tmdbController.searchMulti);

// Rutas para obtener películas y series populares
router.get('/movie/popular', tmdbController.getPopularMovies);
router.get('/tv/popular', tmdbController.getPopularSeries);

// Rutas para obtener géneros
router.get('/genre/movie/list', tmdbController.getMovieGenres);
router.get('/genre/tv/list', tmdbController.getTvGenres);

// Ruta para descubrir por género
router.get('/discover/:type', tmdbController.discoverByGenre);

// Rutas para detalles
router.get('/:type/:id', tmdbController.getDetails);

export default router;
