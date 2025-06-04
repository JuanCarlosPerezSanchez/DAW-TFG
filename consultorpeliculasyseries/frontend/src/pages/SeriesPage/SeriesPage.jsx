//#region Imports
import { useEffect, useState, useRef } from "react";
import ContentCard from "../../components/ContentCard/ContentCard";
import SeriesPageDTO from "./SeriesPageDTO";
import SeriesPageService from "./SeriesPageService";
import UtilsService from "../../services/UtilsService";
import "./SeriesPage.css";
//#endregion

const SeriesPage = ({ selectedGenres }) => {
    //#region Constantes
    const FILA_SIZE = 7;
    const [dto, setDto] = useState(() => new SeriesPageDTO());
    const containerRef = useRef();
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
    }, [dto.loading, dto.page, dto.hasMore]);
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
                                    addedToGallery={serie.addedToGallery}
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
