//#region Imports
import { useEffect, useState, useRef } from "react";
import ContentCard from "../../components/ContentCard/ContentCard";
import HomePageDTO from "./HomePageDTO";
import HomePageService from "./HomePageService";
import UtilsService from "../../services/UtilsService";
import GalleryButtonService from "../../components/GalleryButton/GalleryButtonService";
import "./HomePage.css";
//#endregion

const HomePage = ({ selectedGenres }) => {
  //#region Constantes
  const [dto, setDto] = useState(() => new HomePageDTO());
  const containerRef = useRef();
  const [galleryIds, setGalleryIds] = useState([]);
  //#endregion

  //#region Funciones auxiliares
  const getGenresArray = () => {
    if (selectedGenres.includes("0")) return [];
    return selectedGenres;
  };
  // Carga la galería del usuario
  const fetchGalleryIds = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setGalleryIds([]);
      return;
    }
    try {
      const BASE_URL = process.env.REACT_APP_API_BASE_URL;
      const res = await fetch(`${BASE_URL}/api/user/gallery`, {
        headers: { ...GalleryButtonService.getAuthHeaders() }
      });
      if (!res.ok) {
        setGalleryIds([]);
        return;
      }
      const data = await res.json();
      setGalleryIds(Array.isArray(data) ? data.map(item => `${item.media_type}-${item.id}`) : []);
    } catch {
      setGalleryIds([]);
    }
  };
  //#endregion

  //#region Eventos
  // Carga inicial y cuando cambian los filtros
  useEffect(() => {
    const newDto = new HomePageDTO();
    setDto(newDto);

    (async () => {
      newDto.setLoading(true);
      try {
        let items = [];
        let hasMore = true;
        if (selectedGenres.includes("0")) {
          const [movieData, tvData] = await Promise.all([
            HomePageService.fetchPopularMovies(1),
            HomePageService.fetchPopularSeries(1)
          ]);
          items = UtilsService.getUniqueByMediaTypeAndId([
            ...(movieData.results || []),
            ...(tvData.results || [])
          ]);
          hasMore = (movieData.page < movieData.total_pages) || (tvData.page < tvData.total_pages);
        } else {
          const genresArray = getGenresArray();
          const [movieResults, tvResults] = await Promise.all([
            HomePageService.fetchByGenres("movie", genresArray, 1),
            HomePageService.fetchByGenres("tv", genresArray, 1)
          ]);
          items = [...movieResults, ...tvResults];
          hasMore = items.length > 0;
        }
        newDto.setItems(items);
        newDto.setPage(1);
        newDto.setHasMore(hasMore);
        newDto.setError(null);
      } catch {
        newDto.setError("Error cargando contenido");
      } finally {
        newDto.setLoading(false);
        setDto({ ...newDto });
      }
    })();
    // eslint-disable-next-line
  }, [selectedGenres]);
  // Scroll infinito que carga más contenido al llegar al final de la página
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { bottom } = containerRef.current.getBoundingClientRect();
      if (
        bottom - window.innerHeight < 200 &&
        !dto.loading &&
        dto.hasMore
      ) {
        setDto(prev => {
          if (prev.loading) return prev;
          const updated = new HomePageDTO();
          Object.assign(updated, prev);
          updated.setPage(prev.page + 1);
          return updated;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dto.loading, dto.hasMore]);
  // Carga más contenido al cambiar de página
  useEffect(() => {
    if (dto.page === 1) return;
    let cancelled = false;
    (async () => {
      const updatedDto = new HomePageDTO();
      Object.assign(updatedDto, dto);
      updatedDto.setLoading(true);
      try {
        let items = [];
        let hasMore = true;
        if (selectedGenres.includes("0")) {
          const [movieData, tvData] = await Promise.all([
            HomePageService.fetchPopularMovies(dto.page),
            HomePageService.fetchPopularSeries(dto.page)
          ]);
          items = UtilsService.getUniqueByMediaTypeAndId([
            ...(movieData.results || []),
            ...(tvData.results || [])
          ]);
          hasMore = (movieData.page < movieData.total_pages) || (tvData.page < tvData.total_pages);
        } else {
          const genresArray = getGenresArray();
          const [movieResults, tvResults] = await Promise.all([
            HomePageService.fetchByGenres("movie", genresArray, dto.page),
            HomePageService.fetchByGenres("tv", genresArray, dto.page)
          ]);
          items = [...movieResults, ...tvResults];
          hasMore = items.length > 0;
        }
        updatedDto.addItems(items);
        updatedDto.setHasMore(hasMore);
        updatedDto.setError(null);
      } catch {
        updatedDto.setError("Error cargando contenido");
      } finally {
        updatedDto.setLoading(false);
        if (!cancelled) setDto({ ...updatedDto });
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [dto.page, selectedGenres]);
  // Carga la galería al montar y cuando cambia el usuario
  useEffect(() => {
    fetchGalleryIds();
    const sync = () => fetchGalleryIds();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  //#endregion

  //#region Renderizado
  return (
    <main className="home-main" ref={containerRef}>
      {dto.error && (
        <div className="home-error">
          {dto.error}
        </div>
      )}
      {UtilsService.splitInRows(dto.items, 7).map((fila, idx) => (
        <div className="home-row" key={idx}>
          {fila.map((item, idx2) =>
            item ? (
              <div
                className="home-card"
                key={`${item.media_type || (item.first_air_date ? "tv" : "movie")}-${item.id}`}>
                <ContentCard
                  id={item.id}
                  image_url={
                    item.poster_path ? "https://image.tmdb.org/t/p/w500" + item.poster_path : null
                  }
                  title={item.title || item.name}
                  overview={item.overview}
                  media_type={
                    item.media_type
                      ? item.media_type
                      : item.first_air_date
                      ? "tv"
                      : "movie"
                  }
                  addedToGallery={galleryIds.includes(`${item.media_type || (item.first_air_date ? "tv" : "movie")}-${item.id}`)}
                  onAddToGallery={() => {
                    const key = `${item.media_type || (item.first_air_date ? "tv" : "movie")}-${item.id}`;
                    setGalleryIds(prev => prev.includes(key) ? prev : [...prev, key]);
                  }}
                  onRemoveFromGallery={() => {
                    const key = `${item.media_type || (item.first_air_date ? "tv" : "movie")}-${item.id}`;
                    setGalleryIds(prev => prev.filter(k => k !== key));
                  }}
                />
              </div>
            ) : (
              <div
                className="home-card"
                key={`empty-${idx2}`}
              />
            )
          )}
        </div>
      ))}
      {dto.loading && (
        <div className="home-loading">Cargando más...</div>
      )}
    </main>
  );
  //#endregion
};

export default HomePage;
