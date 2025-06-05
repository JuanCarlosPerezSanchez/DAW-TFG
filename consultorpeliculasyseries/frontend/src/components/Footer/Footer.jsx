//#region Imports
import "./Footer.css";
//#endregion

const Footer = () => {
    //#region Renderizado
    return (
        <footer>
            <div className="footer-content">
                <section>
                    <p className="footer-dev">Nombre del desarrollador:<br/>Juan Carlos Pérez Sánchez</p>
                    <p className="footer-copy">&copy; 2025 Consultor de Películas y Series. Todos los derechos reservados.</p>
                </section>
            </div>
        </footer>
    );
    //#endregion
}

export default Footer;
