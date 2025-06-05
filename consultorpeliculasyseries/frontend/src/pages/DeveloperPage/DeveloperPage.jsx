//#region Imports
import Footer from "../../components/Footer/Footer";
import "./DeveloperPage.css";
//#endregion

//#region Constantes
const CV_ES = "/Curriculum/Currículum en Español.pdf";
const CV_EN = "/Curriculum/Curriculum vitae in English.pdf";
//#endregion

const DesarrolladorPage = () => (
    //#region Renderizado
    <div className="developer-bg">
        <h1 className="developer-title">Sobre el desarrollador</h1>
        <div className="developer-container">
            <div>
                <strong>Nombre:</strong> Juan Carlos Pérez Sánchez<br />
                <strong>Contacto:</strong>
                <ul>
                    <li>Teléfono: 611 607 940</li>
                    <li>Email: jcpersa47@gmail.com</li>
                    <li>Dirección: Av. Altamira 29, bloque 1, 8ºD, Sevilla</li>
                </ul>
            </div>
            <p>
                <strong>Sobre mí:</strong><br />
                Soy un desarrollador web junior con experiencia en el desarrollo de aplicaciones web modernas utilizando tecnologías como React, Node.js y bases de datos relacionales y no relacionales. Me considero una persona proactiva, con gran capacidad de aprendizaje y motivación para afrontar nuevos retos en el sector tecnológico.
            </p>
            <div>
                <strong>Formación académica:</strong>
                <ul>
                    <li>Grado Superior en Desarrollo de Aplicaciones Web (DAW) - Instituto Tecnológico Superior ADA ITS (2023-2025)</li>
                    <li>Grado Medio en Telecomunicaciones - Instituto Tecnológico Superior ADA ITS (2019-2023)</li>
                </ul>
            </div>
            <div>
                <strong>Habilidades técnicas:</strong>
                <ul>
                    <li>Desarrollo Frontend: React, HTML5, CSS3, JavaScript ES6+</li>
                    <li>Desarrollo Backend: Node.js, Express</li>
                    <li>Bases de datos: MySQL, MongoDB</li>
                    <li>Control de versiones: Git, GitHub</li>
                    <li>Consumo de APIs REST</li>
                </ul>
            </div>
            <div>
                <strong>Habilidades personales:</strong>
                <ul>
                    <li>Trabajo en equipo</li>
                    <li>Comunicación efectiva</li>
                    <li>Resolución de problemas</li>
                    <li>Adaptabilidad</li>
                    <li>Responsabilidad</li>
                </ul>
            </div>
            <div>
                <strong>Idiomas:</strong>
                <ul>
                    <li>Español: Nativo</li>
                    <li>Catalán: Nativo</li>
                    <li>Inglés: Nivel intermedio</li>
                </ul>
            </div>
            <div>
                <strong>Otros datos de interés:</strong>
                <ul>
                    <li>Carné de conducir</li>
                    <li>Disponibilidad inmediata</li>
                </ul>
            </div>
            <div className="developer-cv-links">
                <a href={CV_ES}
                    download
                    className="developer-cv-btn">
                    Descargar CV en Español
                </a>
                <a href={CV_EN}
                    download
                    className="developer-cv-btn">
                    Descargar CV en Inglés
                </a>
            </div>
        </div>
        <Footer />
    </div>
    //#endregion
);

export default DesarrolladorPage;
