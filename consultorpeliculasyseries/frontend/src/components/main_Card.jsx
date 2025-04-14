import React from 'react';

function ContentCard({ titulo, anio }) {
    return (
        <div className="content-card">
            <h3>{titulo}</h3>
            <p>Año de lanzamiento: {anio}</p>
            <a href="https://www.justwatch.com/es/serie/adolescencia"><img src="https://images.justwatch.com/poster/328945432/s332/adolescencia.avif, https://images.justwatch.com/poster/328945432/s332/adolescencia.avif" alt="" /></a>
        </div>
    );
}

export default ContentCard;