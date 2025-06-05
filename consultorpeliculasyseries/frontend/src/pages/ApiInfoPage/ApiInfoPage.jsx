//#region Imports
import Footer from "../../components/Footer/Footer";
import "./ApiInfoPage.css";
//#endregion

const ApiInfoPage = () => (
    //#region Renderizado
    <div className="apiinfo-bg">
        <h1 className="apiinfo-title">The Movie Database (TMDB)</h1>
        <div className="apiinfo-container">
            <p>
                Esta web utiliza la API de <strong>The Movie Database (TMDB)</strong> para obtener información actualizada sobre películas y series, incluyendo detalles, géneros, reparto, tráilers y plataformas de streaming.
            </p>
            <p>
                <strong>¿Qué es TMDB?</strong><br />
                TMDB es una plataforma abierta y colaborativa que proporciona datos sobre películas, series, actores, tráilers, imágenes y mucho más, utilizada por miles de aplicaciones y webs en todo el mundo.
            </p>
            <div>
                <strong>Principales endpoints utilizados en esta web:</strong>
                <ul>
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/movie/popular"</code> y <code>"https://api.themoviedb.org/3/tmdb/tv/popular"</code>:<br />
                        <p>
                            Devuelven una lista paginada de las películas y series más populares del momento según TMDB. Se usan para mostrar el contenido destacado en la página principal y en las secciones de películas y series.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/discover/movie?with_genres="</code> y <code>"https://api.themoviedb.org/3/tmdb/discover/tv?with_genres="</code>:<br />
                        <p>
                            Permiten filtrar películas o series por uno o varios géneros seleccionados por el usuario. Los IDs de los géneros se pasan separados por comas en el parámetro <code>with_genres</code>. Se utiliza para mostrar resultados personalizados en función de los filtros aplicados.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/genre/movie/list"</code> y <code>"https://api.themoviedb.org/3/tmdb/genre/tv/list"</code>:<br />
                        <p>
                            Devuelven la lista completa de géneros disponibles para películas y series. Se usan para poblar los menús de filtros de género en la interfaz.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/search?query="</code>:<br />
                        <p>
                            Permite buscar películas y series por título o palabras clave. Devuelve resultados paginados que pueden incluir tanto películas como series, y se utiliza en el buscador global de la web.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/movie/&#123;id&#125;"</code> y <code>"https://api.themoviedb.org/3/tmdb/tv/&#123;id&#125;"</code>:<br />
                        <p>
                            Devuelven los detalles completos de una película o serie específica, incluyendo sinopsis, imágenes, puntuaciones, duración, países de producción, etc. Se usan en la página de detalle de cada contenido.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/&#123;movie|tv&#125;/&#123;id&#125;/credits"</code>:<br />
                        <p>
                            Proporciona información sobre el reparto principal (actores) y el equipo técnico (como el director) de una película o serie. Se muestra en la ficha de detalle.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/&#123;movie|tv&#125;/&#123;id&#125;/videos"</code> y <code>"https://api.themoviedb.org/3/tmdb/&#123;movie|tv&#125;/&#123;id&#125;/videos_en"</code>:<br />
                        <p>
                            Devuelven los tráilers y vídeos promocionales disponibles para una película o serie, en diferentes idiomas. Se utilizan para mostrar los tráilers en la ficha de detalle.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/&#123;movie|tv&#125;/&#123;id&#125;/watch/providers"</code>:<br />
                        <p>
                            Indica en qué plataformas de streaming está disponible una película o serie en España (u otros países). Se muestra en la ficha de detalle para que el usuario sepa dónde puede ver el contenido.
                        </p>
                    </li><br />
                    <li>
                        <code>"https://api.themoviedb.org/3/tmdb/user/gallery"</code>:<br />
                        <p>
                            Endpoint propio del backend de la web para gestionar la galería personal del usuario autenticado. Permite añadir, eliminar y consultar las películas y series guardadas por cada usuario.
                        </p>
                    </li>
                </ul>
            </div>
            <div>
                <strong>Notas técnicas:</strong><br />
                <ul>
                    <li>El filtrado por géneros se realiza en una sola petición agrupando todos los IDs de géneros seleccionados, optimizando así el rendimiento.</li>
                    <li>Las búsquedas y listados son paginados para mejorar la experiencia de usuario y reducir la carga en la red.</li>
                    <li>La autenticación y la gestión de la galería requieren que el usuario esté registrado e identificado.</li>
                </ul>
            </div>
            <p>
                Puedes consultar la documentación oficial de la API aquí:<br />
                <a href="https://developer.themoviedb.org/reference/intro/getting-started"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apiinfo-link">
                    https://developer.themoviedb.org/reference/intro/getting-started
                </a>
            </p>
        </div>
        <Footer />
    </div>
    //#endregion
);

export default ApiInfoPage;
