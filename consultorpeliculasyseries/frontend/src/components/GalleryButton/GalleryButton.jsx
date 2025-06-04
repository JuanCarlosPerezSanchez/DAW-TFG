//#region Imports
import { useState, useEffect } from "react";
import GalleryButtonService from "./GalleryButtonService";
import "./GalleryButton.css";
//#endregion

const GalleryButton = ({ id, media_type, image_url, title, overview, showRemoveButton = false, onRemoveFromGallery }) => {
    //#region Constantes
    const [adding, setAdding] = useState(false);
    const [added, setAdded] = useState(false);
    const user = localStorage.getItem("user");
    //#endregion

    //#region Eventos
    // Evento que detecta si al montar el componente o cambiar id/media_type/user/adding, consulta si el contenido está en la galería
    useEffect(() => {
        let ignore = false;
        async function fetchStatus() {
            if (!user) {
                setAdded(false);
                return;
            }
            try {
                const isAdded = await GalleryButtonService.checkIfInGallery(id, media_type);
                if (!ignore) setAdded(isAdded);
            } catch {
                if (!ignore) setAdded(false);
            }
        }
        fetchStatus();
    }, [id, media_type, user, adding]);

    // Si no hay usuario logueado, no se muestra el botón
    if (!user) return null;
    //#endregion

    //#region Manejo de la galería (Añadir/Eliminar media)
    // Maneja el click para añadir o eliminar de la galería
    const handleAddOrRemove = async (e) => {
        e.stopPropagation();
        setAdding(true);
        try {
            if (added || showRemoveButton) {
                if (onRemoveFromGallery) onRemoveFromGallery();
                await GalleryButtonService.removeFromGallery(id, media_type);
                setAdded(false);
            } else {
                await GalleryButtonService.addToGallery({ id, media_type, title, overview, image_url });
                setAdded(true);
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
                className={`content-card-add-btn${(added || showRemoveButton) ? " added" : ""}`}
                disabled={adding}
                style={{
                    // Si está añadido o es botón de eliminar, cambia el color a rojo
                    ...(showRemoveButton || added ? { background: "#ff3333", color: "#fff" } : {}),
                    userSelect: "none"
                }}>
            {adding
                ? (added || showRemoveButton ? "Eliminando..." : "Añadiendo...")
                : (added || showRemoveButton ? "- Mi Galería" : "+ Mi Galería")}
        </button>
    );
    //#endregion
};

export default GalleryButton;
