//#region Imports
import { useState, useEffect } from "react";
import GalleryButtonService from "./GalleryButtonService";
import "./GalleryButton.css";
//#endregion

const GalleryButton = ({ id, media_type, image_url, title, overview, showRemoveButton = false, onRemoveFromGallery, added, onAddToGallery }) => {
    //#region Constantes
    const [adding, setAdding] = useState(false);
    const [addedLocal, setAddedLocal] = useState(false);
    const user = localStorage.getItem("user");
    //#endregion

    //#region Eventos
    // Solo consulta a la API si no se pasa la prop 'added'
    useEffect(() => {
        if (typeof added === "boolean") {
            setAddedLocal(added);
            return;
        }
        let ignore = false;
        async function fetchStatus() {
            if (!user) {
                setAddedLocal(false);
                return;
            }
            try {
                const isAdded = await GalleryButtonService.checkIfInGallery(id, media_type);
                if (!ignore) setAddedLocal(isAdded);
            } catch {
                if (!ignore) setAddedLocal(false);
            }
        }
        fetchStatus();
        return () => { ignore = true; };
    }, [id, media_type, user, adding, added]);

    // Si no hay usuario logueado, no se muestra el botón
    if (!user) return null;
    //#endregion

    //#region Manejo de la galería (Añadir/Eliminar media)
    // Maneja el click para añadir o eliminar de la galería
    const handleAddOrRemove = async (e) => {
        e.stopPropagation();
        setAdding(true);
        try {
            if (addedLocal || showRemoveButton) {
                if (onRemoveFromGallery) onRemoveFromGallery();
                await GalleryButtonService.removeFromGallery(id, media_type);
                setAddedLocal(false);
            } else {
                await GalleryButtonService.addToGallery({ id, media_type, title, overview, image_url });
                setAddedLocal(true);
                if (onAddToGallery) onAddToGallery();
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setAdding(false);
        }
    };
    //#endregion

    //#region Renderizado
    return (
        <button onClick={handleAddOrRemove}
                className={`content-card-add-btn${(addedLocal || showRemoveButton) ? " added" : ""}`}
                disabled={adding}
                style={{
                    ...(showRemoveButton || addedLocal ? { background: "#ff3333", color: "#fff" } : {}),
                    userSelect: "none"
                }}>
            {adding
                ? (addedLocal || showRemoveButton ? "Eliminando..." : "Añadiendo...")
                : (addedLocal || showRemoveButton ? "- Mi Galería" : "+ Mi Galería")}
        </button>
    );
    //#endregion
};

export default GalleryButton;
