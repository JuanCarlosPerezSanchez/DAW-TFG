//#region Imports
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SearchResultsPageDTO from "./SearchResultsPageDTO";
import SearchResultsPageService from "./SearchResultsPageService";
import "./SearchResultsPage.css";
//#endregion

const SearchResultsPage = () => {
    //#region Constantes
    const { query } = useParams();
    const [dto, setDto] = useState(() => new SearchResultsPageDTO());
    const navigate = useNavigate();
    //#endregion

    //#region Funciones auxiliares
    // Filtra los resultados según el filtro seleccionado
    const filteredResults = dto.results.filter(r =>
        dto.filter === "all" ? true : dto.filter === "movie" ? r.media_type === "movie" : r.media_type === "tv"
    );
    // Cambia el filtro usando propiedades directas
    const handleFilterChange = (filter) => {
        setDto(prev => ({ ...prev, filter }));
    };
    //#endregion

    //#region Eventos
    // Carga los resultados de búsqueda al cambiar la query
    useEffect(() => {
        const newDto = new SearchResultsPageDTO();
        setDto(newDto);

        (async () => {
            newDto.loading = true;
            setDto({ ...newDto });
            try {
                const data = await SearchResultsPageService.fetchSearchResults(query);
                const results = data.results ? data.results.filter(r => r.media_type === "movie" || r.media_type === "tv") : [];
                newDto.results = results;
                newDto.error = null;
            } catch {
                newDto.error = "Error buscando resultados";
            } finally {
                newDto.loading = false;
                setDto({ ...newDto });
            }
        })();
    }, [query]);
    //#endregion

    //#region Renderizado
    return (
        <div className="search-results-bg">
            <div className="search-results-container">
                <div className="search-results-title">
                    Resultados de búsqueda para: <span className="search-results-title-highlight">{query}</span>
                </div>
                <div className="search-results-filters">
                    <button onClick={() => handleFilterChange("all")}
                            className={`search-results-filter-btn${dto.filter === "all" ? " active" : ""}`}>
                        Ver Todo
                    </button>
                    <button onClick={() => handleFilterChange("movie")}
                            className={`search-results-filter-btn${dto.filter === "movie" ? " active" : ""}`}>
                        Películas
                    </button>
                    <button onClick={() => handleFilterChange("tv")}
                            className={`search-results-filter-btn${dto.filter === "tv" ? " active" : ""}`}>
                        Series
                    </button>
                    <span className="search-results-count">
                        {filteredResults.length} títulos
                    </span>
                </div>
                {dto.loading ? (
                    <div className="search-results-loading">Cargando...</div>
                ) : filteredResults.length === 0 ? (
                    <div className="search-results-empty">No se encontraron resultados.</div>
                ) : (
                    <div>
                        {filteredResults.map(result => (
                            <div key={`${result.media_type}-${result.id}`}
                                className="search-result-block">
                                <img src={ result.poster_path || result.profile_path
                                        ? `https://image.tmdb.org/t/p/w300${result.poster_path || result.profile_path}`
                                        : "/images/placeholder_image.png"
                                    }
                                    alt={result.title || result.name}
                                    className="search-result-img"
                                />
                                <div className="search-result-info-block">
                                    <div className="search-result-info-title">
                                        {result.title || result.name}
                                        <span className="search-result-info-title-year">
                                            {result.release_date || result.first_air_date ? `(${(result.release_date || result.first_air_date).slice(0, 4)})` : ""}
                                        </span>
                                    </div>
                                    <div className="search-result-info-type">
                                        {result.media_type === "movie" ? "Película" : result.media_type === "tv" ? "Serie" : ""}
                                    </div>
                                    <div className="search-result-info-overview">
                                        {result.overview ? result.overview.slice(0, 260) + (result.overview.length > 260 ? "..." : "") : "Sinopsis no disponible."}
                                    </div>
                                    <div className="search-result-info-btn-container">
                                        <button onClick={() => navigate(`/detalle/${result.media_type}/${result.id}`)}
                                                className="search-result-info-btn">
                                            Ver detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
    //#endregion
};

export default SearchResultsPage;
