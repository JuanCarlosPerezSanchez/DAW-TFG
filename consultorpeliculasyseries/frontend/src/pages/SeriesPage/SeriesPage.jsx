//#region Imports
import { useEffect, useState, useRef } from "react";
import ContentCard from "../../components/ContentCard/ContentCard";
import SeriesPageDTO from "./SeriesPageDTO";
import SeriesPageService from "./SeriesPageService";
import UtilsService from "../../services/UtilsService";
import GalleryButtonService from "../../components/GalleryButton/GalleryButtonService";
import "./SeriesPage.css";
//#endregion

const SeriesPage = ({ selectedGenres }) => {
    //#region Constantes
    const FILA_SIZE = 7;
    const [dto, setDto] = useState(() => new SeriesPageDTO());
    const containerRef = useRef();
    const [galleryIds, setGalleryIds] = useState([]);
    //#endregion

    //#region Efectos
    // Carga inicial y cuando cambian los filtros
    useEffect(() => {
        const newDto = new SeriesPageDTO();
        setDto(newDto);

        (async () => {
            newDto.setLoading(true);
            try {
                const { series, hasMore } = await SeriesPageService.fetchInitialSeries(selectedGenres);
                newDto.setSeries(series);
                newDto.setPage(2);
                newDto.setHasMore(hasMore);
                newDto.setError(null);
            } catch {
                newDto.setError("Error cargando series");
            } finally {
                newDto.setLoading(false);
                setDto({ ...newDto });
            }
        })();
        // eslint-disable-next-line
    }, [selectedGenres]);
    // Scroll infinito para cargar más series al llegar al final
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
                        if (prev.loading) return prev;
                        const updated = new SeriesPageDTO();
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
    // Cargar más series al cambiar de página
    useEffect(() => {
        if (dto.page <= 2) return;
        let cancelled = false;
        (async () => {
            const updatedDto = new SeriesPageDTO();
            Object.assign(updatedDto, dto);
            updatedDto.setLoading(true);
            try {
                const { series, hasMore } = await SeriesPageService.fetchMoreSeries(selectedGenres, dto.page);
                updatedDto.addSeries(series);
                updatedDto.setHasMore(hasMore);
                updatedDto.setError(null);
            } catch {
                updatedDto.setError("Error cargando series");
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
        fetchGalleryIds();
        const sync = () => fetchGalleryIds();
        window.addEventListener("storage", sync);
        return () => window.removeEventListener("storage", sync);
    }, []);
    //#endregion

    //#region Renderizado
    return (
        <main className="series-main" ref={containerRef}>
            {dto.error && (
                <div className="series-error">
                    {dto.error}
                </div>
            )}
            {UtilsService.splitInRows(dto.series, FILA_SIZE).map((fila, idx) => (
                <div className="series-row" key={idx}>
                    {fila.map((serie, idx2) =>
                        serie ? (
                            <div
                                className="series-card"
                                key={`serie-${serie.id}-${serie.name?.replace(/\s/g, "") || ""}-${idx2}`}
                            >
                                <ContentCard
                                    id={serie.id}
                                    image_url={
                                        serie.poster_path ? "https://image.tmdb.org/t/p/w500" + serie.poster_path : null
                                    }
                                    title={serie.name}
                                    overview={serie.overview}
                                    media_type={serie.media_type || "tv"}
                                    addedToGallery={galleryIds.includes(`${serie.media_type || "tv"}-${serie.id}`)}
                                    trailer={
                                        serie.videos?.results?.find(
                                            v => v.site === "YouTube" && v.type === "Trailer"
                                        )
                                    }
                                    credits={serie.credits}
                                    platforms={serie["watch/providers"]}
                                />
                            </div>
                        ) : (
                            <div className="series-card" key={`empty-${idx2}`} />
                        )
                    )}
                </div>
            ))}
            {dto.loading && (
                <div className="series-loading">Cargando más...</div>
            )}
        </main>
    );
    //#endregion
};

export default SeriesPage;
