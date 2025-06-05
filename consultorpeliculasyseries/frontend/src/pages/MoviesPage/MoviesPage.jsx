//#region Imports
import { useEffect, useState, useRef } from "react";
import ContentCard from "../../components/ContentCard/ContentCard";
import MoviesPageDTO from "./MoviesPageDTO";
import MoviesPageService from "./MoviesPageService";
import UtilsService from "../../services/UtilsService";
import "./MoviesPage.css";
//#endregion

const MoviesPage = ({ selectedGenres }) => {
  //#region Constantes
  const FILA_SIZE = 7;
  const [dto, setDto] = useState(() => new MoviesPageDTO());
  const [gallerySet, setGallerySet] = useState(new Set());
  const containerRef = useRef();
  //#endregion

  //#region Funciones auxiliares
  // Devuelve el array de géneros seleccionados (vacío si "0" está seleccionado)
  const getGenresArray = () => {
    if (selectedGenres.includes("0")) return [];
    return selectedGenres;
  };
  //#endregion

  //#region Eventos
  // Carga la galería del usuario una sola vez por página
  useEffect(() => {
    async function fetchGallery() {
      const user = localStorage.getItem("user");
      if (!user) {
        setGallerySet(new Set());
        return;
      }
      try {
        const data = await MoviesPageService.fetchUserGallery();
        setGallerySet(new Set(data.map(item => `${item.media_type}-${item.id}`)));
      } catch {
        setGallerySet(new Set());
      }
    }
    fetchGallery();
  }, []);
  // Carga inicial y cuando cambian los filtros
  useEffect(() => {
    const newDto = new MoviesPageDTO();
    setDto(newDto);

    (async () => {
      newDto.setLoading(true);
      try {
        let movies = [];
        let hasMore = true;
        if (selectedGenres.includes("0")) {
          // Cargar página 1 y 2 para mostrar 40 películas de primeras
          const [data1, data2] = await Promise.all([
            MoviesPageService.fetchPopularMovies(1),
            MoviesPageService.fetchPopularMovies(2)
          ]);
          movies = [...(data1.results || []), ...(data2.results || [])];
          hasMore = data2.page < data2.total_pages;
        } else {
          const genresArray = getGenresArray();
          // Cargar página 1 y 2 con todos los géneros seleccionados (una sola petición por página)
          const combinedResults = await MoviesPageService.fetchMoviesByGenresMultiplePages(genresArray, [1, 2]);
          movies = combinedResults.filter(m => (m.media_type === "movie" || !m.media_type));
          hasMore = movies.length > 0;
        }
        // Marca si cada película está en la galería
        movies = movies.map(m => ({
          ...m,
          addedToGallery: gallerySet.has(`${m.media_type || "movie"}-${m.id}`)
        }));
        newDto.setMovies(movies);
        newDto.setPage(2); // Ya hemos cargado hasta la página 2
        newDto.setHasMore(hasMore);
        newDto.setError(null);
      } catch {
        newDto.setError("Error cargando películas");
      } finally {
        newDto.setLoading(false);
        setDto({ ...newDto });
      }
    })();
    // eslint-disable-next-line
  }, [selectedGenres, gallerySet]);
  // Scroll infinito
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!containerRef.current) {
          ticking = false;
          return;
        }
        const { bottom } = containerRef.current.getBoundingClientRect();
        if (
          bottom - window.innerHeight < 200 &&
          !dto.loading &&
          dto.hasMore
        ) {
          setDto(prev => {
            // Evita incrementar la página si ya está cargando
            if (prev.loading) return prev;
            const updated = new MoviesPageDTO();
            Object.assign(updated, prev);
            updated.setPage(prev.page + 2);
            return updated;
          });
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dto.loading, dto.hasMore]);
  // Cargar más al cambiar de página
  useEffect(() => {
    if (dto.page <= 2) return;
    let cancelled = false;
    (async () => {
      const updatedDto = new MoviesPageDTO();
      Object.assign(updatedDto, dto);
      updatedDto.setLoading(true);
      try {
        let movies = [];
        let hasMore = true;
        if (selectedGenres.includes("0")) {
          const [dataA, dataB] = await Promise.all([
            MoviesPageService.fetchPopularMovies(dto.page - 1),
            MoviesPageService.fetchPopularMovies(dto.page)
          ]);
          movies = [...(dataA.results || []), ...(dataB.results || [])];
          hasMore = dataB.page < dataB.total_pages;
        } else {
          const genresArray = getGenresArray();
          const combinedResults = await MoviesPageService.fetchMoviesByGenresMultiplePages(genresArray, [dto.page - 1, dto.page]);
          movies = combinedResults.filter(m => (m.media_type === "movie" || !m.media_type));
          hasMore = movies.length > 0;
        }
        updatedDto.addMovies(movies);
        updatedDto.setHasMore(hasMore);
        updatedDto.setError(null);
      } catch {
        updatedDto.setError("Error cargando películas");
      } finally {
        updatedDto.setLoading(false);
        if (!cancelled) setDto({ ...updatedDto });
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [dto.page, selectedGenres]);
  //#endregion

  //#region Renderizado
  return (
    <main className="movies-main" ref={containerRef}>
      {dto.error && (
        <div className="movies-error">
          {dto.error}
        </div>
      )}
      {UtilsService.splitInRows(dto.movies, FILA_SIZE).map((fila, idx) => (
        <div className="movies-row" key={idx}>
          {fila.map((movie, idx2) =>
            movie ? (
              <div
                className="movies-card"
                key={`movie-${movie.id}-${movie.title?.replace(/\s/g, "") || ""}-${idx2}`}>
                <ContentCard id={movie.id}
                            image_url={
                              movie.poster_path ? "https://image.tmdb.org/t/p/w500" + movie.poster_path : null
                            }
                            title={movie.title}
                            overview={movie.overview}
                            media_type={movie.media_type || "movie"}
                            addedToGallery={movie.addedToGallery}
                            trailer={
                              movie.videos?.results?.find(
                                v => v.site === "YouTube" && v.type === "Trailer"
                              )
                            }
                            credits={movie.credits}
                            platforms={movie["watch/providers"]}
                />
              </div>
            ) : (
              <div className="movies-card" key={`empty-${idx2}`} />
            )
          )}
        </div>
      ))}
      {dto.loading && (
        <div className="movies-loading">Cargando más...</div>
      )}
    </main>
  );
  //#endregion
};

export default MoviesPage;
