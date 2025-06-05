//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestión de detalles
// Llama a la API para obtener los detalles de una película o serie
async function fetchDetails(media_type, id) {
    const res = await fetch(`${BASE_URL}/api/tmdb/${media_type}/${id}`);
    if (!res.ok) throw new Error("No se pudo cargar la información.");
    return await res.json();
}
// Devuelve la fecha de estreno según el tipo de media
function getReleaseDate(detalle, media_type) {
    if (!detalle) return "";
    if (media_type === "movie") return detalle.release_date || "";
    if (media_type === "tv") return detalle.first_air_date || "";
    return detalle.release_date || detalle.first_air_date || "";
}
// Devuelve un color dinámico para el box-shadow según el género principal
function getGenreShadowColor(genres) {
    if (!genres || genres.length === 0) return "rgba(255, 255, 255, 1)";
    const genre = genres[0].toLowerCase().normalize();
    if (genre.includes("terror") || genre.includes("horror")) return "rgba(255,0,0,1)";
    if (genre.includes("western")) return "rgba(205,133,63,1)";
    if (genre.includes("accion")) return "rgba(255,140,0,1)";
    if (genre.includes("aventura") || genre.includes("adventure")) return "rgba(0,191,255,1)";
    if (genre.includes("fantasía") || genre.includes("fantasy")) return "rgba(138,43,226,1)";
    if (genre.includes("comedia") || genre.includes("comedy")) return "rgba(255,215,0,1)";
    if (genre.includes("romance")) return "rgba(255,105,180,1)";
    if (genre.includes("drama")) return "rgba(128,128,128,1)";
    if (genre.includes("ciencia ficción") || genre.includes("science fiction")) return "rgba(0,255,255,1)";
    if (genre.includes("misterio") || genre.includes("mystery")) return "rgba(75,0,130,1)";
    if (genre.includes("crimen") || genre.includes("crime")) return "rgba(139,0,0,1)";
    if (genre.includes("animación") || genre.includes("animation")) return "rgba(0,255,127,1)";
    if (genre.includes("documental") || genre.includes("documentary")) return "rgba(255,255,255,1)";
    if (genre.includes("bélica") || genre.includes("war")) return "rgba(139,69,19,1)";
    if (genre.includes("música") || genre.includes("music")) return "rgba(255,0,255,1)";
    if (genre.includes("familia") || genre.includes("family")) return "rgba(100,149,237,1)";
    if (genre.includes("kids")) return "rgba(255,192,203,1)";
    if (genre.includes("película de tv") || genre.includes("tv movie")) return "rgba(169,169,169,1)";
    if (genre.includes("suspense") || genre.includes("thriller")) return "rgba(178,34,34,1)";
    if (genre.includes("historia") || genre.includes("history")) return "rgba(210,180,140,1)";
    if (genre.includes("news")) return "rgba(0,0,139,1)";
    if (genre.includes("reality")) return "rgba(255,165,0,1)";
    if (genre.includes("soap")) return "rgba(255,218,185,1)";
    if (genre.includes("talk")) return "rgba(255,239,213,1)";
    return "rgba(255, 255, 255, 1)";
}
// Devuelve el reparto principal y el director
function getMainCastAndDirector(detalle) {
    let mainCast = [];
    let director = "";
    if (detalle.credits && detalle.credits.cast) {
        mainCast = detalle.credits.cast.slice(0, 5);
    }
    if (detalle.credits && detalle.credits.crew) {
        const dir = detalle.credits.crew.find(p => p.job === "Director");
        director = dir ? dir.name : "";
    }
    return { mainCast, director };
}
//#endregion

//#region Gestión de tráilers
// Devuelve el tráiler principal en español (si existe)
function getMainTrailerEs(detalle) {
    if (!detalle.videos || !detalle.videos.results.length) return null;
    const isSpanishTitle = name =>
        name.toLowerCase().normalize().includes("español") ||
        name.toLowerCase().normalize().includes("castellano");
    const trailers = detalle.videos.results.filter(
        t => t.site === "YouTube" && isSpanishTitle(t.name)
    );
    return (
        trailers.find(t => t.type === "Trailer" && t.official === true) ||
        trailers.find(t => t.type === "Trailer") ||
        trailers[0]
    );
}
// Devuelve el tráiler principal en inglés (si existe)
function getMainTrailerEn(detalle) {
    if (!detalle.videos_en || !detalle.videos_en.results.length) return null;
    const isEnglish = t => t.iso_639_1 === "en";
    const isYouTube = t => t.site === "YouTube";
    const isTrailerType = t => t.type === "Trailer";
    const isOfficial = t => t.official === true;
    const nameIncludesTrailer = t => t.name && t.name.includes("Trailer");
    const trailers = detalle.videos_en.results.filter(
        t => isYouTube(t) && isEnglish(t)
    );
    return (
        trailers.find(t => isTrailerType(t) && isOfficial(t)) ||
        trailers.find(t => isTrailerType(t) && nameIncludesTrailer(t)) ||
        trailers.find(t => nameIncludesTrailer(t)) ||
        trailers.find(isTrailerType) ||
        trailers[0] ||
        detalle.videos_en.results.find(isEnglish)
    );
}
//#endregion

//#region Plataformas de streaming disponibles
// Devuelve el bloque de plataformas de streaming para España
function getPlatformsBlock(detalle) {
    const providersES = detalle["watch/providers"]?.results?.ES;
    if (!providersES) return null;

    const allTypes = [
        { key: "flatrate", label: "Suscripción" },
        { key: "rent", label: "Alquilar" },
        { key: "buy", label: "Comprar" }
    ];

    let allPlatforms = [];
    allTypes.forEach(type => {
        if (providersES[type.key]) {
            providersES[type.key].forEach(p => {
                allPlatforms.push({
                    ...p,
                    type: type.label,
                    typeKey: type.key,
                    link: providersES.link
                });
            });
        }
    });

    const uniquePlatforms = [];
    const seen = new Set();
    allPlatforms.forEach(p => {
        if (!seen.has(p.provider_id)) {
            uniquePlatforms.push(p);
            seen.add(p.provider_id);
        }
    });

    // Devuelve solo los datos, no JSX
    if (uniquePlatforms.length > 0) {
        return uniquePlatforms;
    }
    return null;
}
//#endregion

//#region Servicio
const DetailsPageService = {
    fetchDetails,
    getReleaseDate,
    getGenreShadowColor,
    getMainCastAndDirector,
    getMainTrailerEs,
    getMainTrailerEn,
    getPlatformsBlock
};
//#endregion

export default DetailsPageService;
