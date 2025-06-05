//#region Imports
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DetailsPageDTO from "./DetailsPageDTO";
import DetailsPageService from "./DetailsPageService";
import CommentsChat from "../../components/CommentsChat/CommentsChat";
import "./DetailsPage.css";
//#endregion

const DetailsPage = () => {
    //#region Constantes
    const { id, media_type } = useParams();
    const [dto, setDto] = useState(() => new DetailsPageDTO());
    const [trailerModal, setTrailerModal] = useState({ open: false, key: null, lang: null, title: "" });
    //#endregion
    
    //#region Eventos
    // Evento: carga los detalles de la película/serie al montar o cambiar id/media_type
    useEffect(() => {
        const newDto = new DetailsPageDTO();
        newDto.setLoading(true);
        (async () => {
            try {
                const data = await DetailsPageService.fetchDetails(media_type, id);
                newDto.setDetalle(data);
                newDto.setError(null);
            } catch {
                newDto.setError("No se pudo cargar la información. Puede que el tipo de contenido sea incorrecto o la API key no sea válida.");
            } finally {
                newDto.setLoading(false);
                setDto({ ...newDto });
            }
        })();
    }, [id, media_type]);
    // Mostrar mensaje de error si ocurre un error al cargar los detalles
    if (dto.error) return <div className="details-error">{dto.error}</div>;
    // Mostrar mensaje de carga mientras se obtienen los detalles o si aún no existen
    if (dto.loading || !dto.detalle) return <div className="details-loading">Cargando...</div>;

    //#region Constantes post eventos
    const detalle = dto.detalle;
    const isMovie = media_type === "movie";
    const title = isMovie ? detalle.title : detalle.name;
    const originalTitle = isMovie ? detalle.original_title : detalle.original_name;
    const releaseDate = DetailsPageService.getReleaseDate(detalle, media_type);
    const genres = detalle.genres?.map(g => g.name).join(", ") || "Sin género";
    const duration = isMovie ? detalle.runtime : detalle.episode_run_time?.[0];
    const country = detalle.production_countries?.map(c => c.name).join(", ") || "Desconocido";
    const age = detalle.adult ? "18+" : detalle.adult === false ? "13" : "N/A";
    const vote = detalle.vote_average ? detalle.vote_average.toFixed(1) : "N/A";
    const { mainCast, director } = DetailsPageService.getMainCastAndDirector(detalle);
    const mainTrailerEs = DetailsPageService.getMainTrailerEs(detalle);
    const mainTrailerEn = DetailsPageService.getMainTrailerEn(detalle);
    const platformsBlock = DetailsPageService.getPlatformsBlock(detalle);
    const genreNames = detalle.genres?.map(g => g.name) || [];
    const imgShadowColor = DetailsPageService.getGenreShadowColor(genreNames);
    //#endregion
    
    //#endregion

    //#region Funciones auxiliares
    // Obtener usuario logueado
    const user = (() => {
        try {
            const raw = localStorage.getItem("user");
            if (raw && raw !== "undefined" && raw !== "null") {
                const parsed = JSON.parse(raw);
                if (typeof parsed === "object" && !Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch {}
        return null;
    })();
    // Mostrar tráiler español solo si no es igual al inglés ni está repetido en videos_en
    const showTrailerEs = !!mainTrailerEs && !(
            (mainTrailerEn && mainTrailerEs.key && mainTrailerEn.key && mainTrailerEs.key === mainTrailerEn.key) ||
            (detalle.videos_en?.results?.some(v => v.key === mainTrailerEs.key))
    );
    //#endregion

    //#region Renderizado
    return (
        <main className="details-main">
            <div className="details-top-spacer" />
            <div className="details-card">
                {/* Columna izquierda: imagen grande + info técnica */}
                <div className="details-left">
                    <img src={detalle.poster_path ? `https://image.tmdb.org/t/p/w500${detalle.poster_path}` : "/images/placeholder_image.png"}
                        alt={title}
                        className="details-img"
                        style={{ boxShadow: `0 6px 400px ${imgShadowColor}`, userSelect: "none" }}
                    />
                    {/* boxShadow dinámico se mantiene inline, el resto va a CSS */}
                    <div className="details-left-info">
                        <div className="details-left-info-row">
                            <h1 className="details-left-info-label">Director:</h1>
                            <p className="details-left-info-value">{director || "Director desconocido"}</p>
                        </div>
                        <div className="details-left-info-row">
                            <h2 className="details-left-info-label">Calificación:</h2>
                            <p className="details-left-info-value">{vote} / 10</p>
                        </div>
                        <div className="details-left-info-row">
                            <h3 className="details-left-info-label">Géneros:</h3>
                            <p className="details-left-info-value">{genres}</p>
                        </div>
                        <div className="details-left-info-row">
                            <h4 className="details-left-info-label">Duración:</h4>
                            <p className="details-left-info-value">{duration ? `${duration} min` : "N/D"}</p>
                        </div>
                        <div className="details-left-info-row">
                            <h5 className="details-left-info-label">Clasificación por edades:</h5>
                            <p className="details-left-info-value">{age}</p>
                        </div>
                        <div className="details-left-info-row">
                            <h6 className="details-left-info-label">País de producción:</h6>
                            <p className="details-left-info-value">{country}</p>
                        </div>
                    </div>
                </div>
                {/* Columna derecha: título, original, sinopsis, plataformas, reparto, tráilers */}
                <div className="details-right">
                    <div className="details-title">
                        {title}
                        {releaseDate && (
                            <span className="details-release-date">
                                ({releaseDate.slice(0, 4)})
                            </span>
                        )}
                    </div>
                    {originalTitle && originalTitle !== title && (
                        <div className="details-original-title">
                            Título original: {originalTitle}
                        </div>
                    )}
                    {/* Badge tipo botón pequeño, compacto, solo alrededor del texto */}
                    <span className="details-type-badge">
                        {media_type === "movie" ? "Película" : media_type === "tv" ? "Serie" : ""}
                    </span>
                    <div className="details-section">
                        <strong>Sinopsis:</strong>
                        <br />
                        {detalle.overview || "Sinopsis no disponible."}
                    </div>
                    {/* Plataformas */}
                    {platformsBlock && (
                        <div>
                            <div className="details-platforms-title">
                                Disponible en:
                            </div>
                            <div className="details-platforms-list">
                                {platformsBlock.map(platform => (
                                    <a key={platform.provider_id}
                                        href={platform.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`${platform.provider_name} (${platform.type})`}>
                                        <img src={`https://image.tmdb.org/t/p/w92${platform.logo_path}`}
                                            alt={platform.provider_name}
                                            className="details-platform-logo"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Reparto principal con imágenes */}
                    {mainCast.length > 0 && (
                        <div className="details-cast-section">
                            <strong>Reparto principal:</strong>
                            <div className="details-cast-list">
                                {mainCast.map(actor => (
                                    <div className="details-cast-item" key={actor.id}>
                                        <img className="details-cast-img"
                                            src={actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w92${actor.profile_path}`
                                                : "/images/placeholder_image.png"}
                                            alt={actor.name}
                                        />
                                        <div className="details-cast-name">{actor.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Tráilers: uno al lado del otro */}
                    {(showTrailerEs && mainTrailerEs) || mainTrailerEn ? (
                        <div className="details-trailers-row">
                            {showTrailerEs && mainTrailerEs && (
                                <div className="details-trailer-section">
                                    <div>
                                        <strong>Tráiler (Español):</strong>
                                        <div className="trailer-thumb-container"
                                            onClick={() => setTrailerModal({
                                                    open: true,
                                                    key: mainTrailerEs.key,
                                                    lang: "es",
                                                    title: "Tráiler (Español)"
                                                    })
                                                }>
                                            <iframe src={`https://www.youtube.com/embed/${mainTrailerEs.key}`}
                                                    title="Tráiler Español"
                                                    allowFullScreen
                                                    className="trailer-thumb"
                                                    tabIndex={0}>
                                            </iframe>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {mainTrailerEn && (
                                <div className="details-trailer-section">
                                    <div>
                                        <strong>Tráiler (Inglés):</strong>
                                        <div className="trailer-thumb-container"
                                            onClick={() => setTrailerModal({
                                                    open: true,
                                                    key: mainTrailerEn.key,
                                                    lang: "en",
                                                    title: "Tráiler (Inglés)"
                                                    })
                                                }>
                                            <iframe src={`https://www.youtube.com/embed/${mainTrailerEn.key}`}
                                                    title="Tráiler Inglés"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="trailer-thumb"
                                                    tabIndex={0}>
                                            </iframe>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                    {/* Chat de comentarios */}
                    <CommentsChat media_type={media_type} media_id={id} user={user} />
                </div>
            </div>
            {/* Modal de tráiler grande */}
            {trailerModal.open && (
                <div className="trailer-modal-overlay" onClick={() => setTrailerModal({ open: false, key: null, lang: null, title: "" })}>
                    <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="trailer-modal-close" onClick={() => setTrailerModal({ open: false, key: null, lang: null, title: "" })}>×</button>
                        <div className="trailer-modal-title">{trailerModal.title}</div>
                        <iframe src={`https://www.youtube.com/embed/${trailerModal.key}?autoplay=1`}
                                title={trailerModal.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="trailer-modal-iframe"
                        ></iframe>
                    </div>
                </div>
            )}
        </main>
    );
    //#endregion
};

export default DetailsPage;
