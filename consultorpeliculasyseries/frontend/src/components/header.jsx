import React from "react";

const Header = () => {
    return (
        <header>
            <div style={{ display: 'flex'}}>
                <section style={{ flex: '10%', alignItems: 'left' }}>
                    <img src="https://images.justwatch.com/poster/328945432/s332/adolescencia.avif" alt="Logo" />
                </section>
                <aside style={{ flex: '90%' }}>
                    <h2>¿Qué estás buscando?</h2>
                    <p>Explora nuestras recomendaciones personalizadas.</p>
                </aside>
            </div>
        </header>
    );
}