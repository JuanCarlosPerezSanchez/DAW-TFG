//#region Imports
import Footer from "../../components/Footer/Footer";
import "./AboutTheWebPage.css";
//#endregion

const SobreLaWebPage = () => (
    //#region Renderizado
    <div className="aboutweb-bg">
        <h1 className="aboutweb-title">Sobre la web</h1>
        <div className="aboutweb-container">
            <p>
                Esta web está diseñada para los amantes del cine y las series, permitiendo consultar información detallada sobre películas y series de televisión de manera sencilla y visual.
            </p>
            <p>
                <strong>Objetivo:</strong> Ofrecer una plataforma intuitiva donde los usuarios puedan descubrir, buscar y gestionar información sobre sus películas y series favoritas, así como crear su propia galería personal.
            </p>
            <div>
                <strong>Funcionalidades principales:</strong>
                <ul>
                    <li>Explora películas y series populares, filtrando por género.</li>
                    <li>Busca títulos específicos mediante el buscador integrado.</li>
                    <li>Consulta detalles completos de cada título: sinopsis, reparto, tráilers, plataformas de streaming, etc.</li>
                    <li>Guarda tus películas y series favoritas en tu galería personal (requiere registro).</li>
                    <li>Deja comentarios y reseñas en cada ficha de contenido.</li>
                    <li>Interfaz moderna, adaptable y fácil de usar.</li>
                </ul>
            </div>
        </div>
        <Footer />
    </div>
    //#endregion
);

export default SobreLaWebPage;
