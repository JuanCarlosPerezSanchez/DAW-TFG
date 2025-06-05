//#region Imports
import { useEffect, useState } from "react";
import ContentCard from "../../components/ContentCard/ContentCard";
import Footer from "../../components/Footer/Footer";
import GalleryPageService from "./GalleryPageService";
import GalleriPageDTO from "./GalleryPageDTO";
import UtilsService from "../../services/UtilsService";
import "./GalleryPage.css";
//#endregion

const GalleryPage = () => {
    //#region Constantes
    const FILA_SIZE = 7;
    const [dto, setDto] = useState(() => new GalleriPageDTO());
    const [user, setUser] = useState(() => localStorage.getItem("user"));
    //#endregion

    //#region Eventos
    // Sincroniza el usuario logueado entre pestañas y en la misma pestaña
    useEffect(() => {
        function syncUser() {
            setUser(localStorage.getItem("user"));
        }
        window.addEventListener("storage", syncUser);
        const origRemoveItem = localStorage.removeItem;
        localStorage.removeItem = function(key) {
            origRemoveItem.apply(this, arguments);
            if (key === "user") syncUser();
        };
        return () => {
            window.removeEventListener("storage", syncUser);
            localStorage.removeItem = origRemoveItem;
        };
    }, []);
    // Carga la galería solo si hay usuario logueado
    useEffect(() => {
        const newDto = new GalleriPageDTO();
        if (!user) {
            newDto.items = [];
            newDto.loading = false;
            newDto.error = "";
            setDto({ ...newDto });
            return;
        }
        newDto.loading = true;
        newDto.error = "";
        GalleryPageService.fetchGallery()
            .then(data => { newDto.items = Array.isArray(data) ? data : []; })
            .catch(err => { newDto.error = err.message || "Error al cargar tu galería"; })
            .finally(() => {
                newDto.loading = false;
                setDto({ ...newDto });
            });
    }, [user]);
    //#endregion

    //#region Renderizado
    return (
        <div className="galeria-root">
            <div className="galeria-container">
                {dto.error && (
                    <div className="galeria-error">
                        {dto.error}
                    </div>
                )}
                {!user ? (
                    <div className="galeria-empty">
                        Debes iniciar sesión para ver tu galería.
                    </div>
                ) : dto.loading ? (
                    <div className="galeria-loading">Cargando...</div>
                ) : (dto.items?.length === 0) ? (
                    <div className="galeria-empty">
                        No tienes películas o series guardadas.<br />
                        <span className="galeria-empty-emoji">🎬</span>
                    </div>
                ) : (
                    UtilsService.splitInRows(dto.items, FILA_SIZE).map((fila, idx) => (
                        <div className="galeria-row" key={idx}>
                            {fila.map((item, idx2) =>
                                item && item.id && item.media_type ? (
                                    <div className="galeria-card" key={`${item.media_type}-${item.id}`}>
                                        <ContentCard
                                            id={item.id}
                                            media_type={item.media_type}
                                            image_url={item.poster_path
                                                ? "https://image.tmdb.org/t/p/w500" + item.poster_path
                                                : (item.image_url || "/images/placeholder_image.png")
                                            }
                                            title={item.title || item.name}
                                            overview={item.overview}
                                            onRemoveFromGallery={() => {
                                                const newDto = new GalleriPageDTO();
                                                newDto.items = dto.items.filter(
                                                    x => !(x.id === item.id && x.media_type === item.media_type)
                                                );
                                                newDto.loading = dto.loading;
                                                newDto.error = dto.error;
                                                setDto({ ...newDto });
                                            }}
                                            showRemoveButton
                                        />
                                    </div>
                                ) : (
                                    <div className="galeria-card" key={`empty-${idx2}`} />
                                )
                            )}
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
    //#endregion
};

export default GalleryPage;
