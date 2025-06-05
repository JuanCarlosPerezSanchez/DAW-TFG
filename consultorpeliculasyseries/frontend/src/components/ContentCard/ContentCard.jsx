//#region Imports
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GalleriButton from "../GalleryButton/GalleryButton";
import "./ContentCard.css";
//#endregion

const ContentCard = ({ image_url, id, media_type, title, overview, onRemoveFromGallery, showRemoveButton, addedToGallery, onAddToGallery }) => {
    //#region Constantes
    const navigate = useNavigate();
    const imageSrc = image_url ? image_url : "/images/placeholder_image.png";
    const [hovered, setHovered] = useState(false);
    const user = localStorage.getItem("user");
    //#endregion

    //#region Renderizado
    return (
        <div className={`content-card${hovered ? " hovered" : ""}`}
            onClick={() => navigate(`/detalle/${media_type}/${id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}>
            <img
                src={imageSrc}
                alt="Portada"
                className="content-card-img"
                loading="lazy"
            />
            <div className={`content-card-overlay${hovered && user ? " show" : ""}`}>
                {user && hovered && (
                    <GalleriButton
                        id={id}
                        media_type={media_type}
                        image_url={image_url}
                        title={title}
                        overview={overview}
                        showRemoveButton={showRemoveButton}
                        onRemoveFromGallery={onRemoveFromGallery}
                        added={addedToGallery}
                        onAddToGallery={onAddToGallery}
                    />
                )}
            </div>
        </div>
    );
    //#endregion
};

export default ContentCard;
