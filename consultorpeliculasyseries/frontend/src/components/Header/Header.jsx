//#region Imports
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdMenu, MdPerson, MdSearch } from "react-icons/md";
import HeaderService from "./HeaderService";
import "./Header.css";
//#endregion

const Header = ({ genres, selectedGenres, setSelectedGenres, onFilterChange }) => {
    //#region Constantes
    // Navegación principal
    const navItems = [
        { label: "Popular", to: "/" },
        { label: "Películas", to: "/peliculas" },
        { label: "Series", to: "/series" },
        { label: "Mi Galería", to: "/galeria" },
    ];
    // Estado de modales y menús
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showGenres, setShowGenres] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAuthDropdown, setShowAuthDropdown] = useState(false);
    // Referencias para menús y dropdowns
    const menuButtonRef = useRef();
    const menuRef = useRef();
    const genresDropdownRef = useRef();
    const filterButtonRef = useRef();
    const dropdownRef = useRef();
    const searchInputRef = useRef();
    const authDropdownRef = useRef();
    const authButtonRef = useRef();
    // Estado de usuario autenticado
    const [user, setUser] = useState(HeaderService.getUserFromStorage());
    // Navegación y localización
    const navigate = useNavigate();
    const location = useLocation();
    // Estado de búsqueda
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const searchTimeout = useRef();
    //#endregion

    //#region Eventos
    // Cierra el dropdown de búsqueda al hacer click fuera
    HeaderService.useClickOutside([dropdownRef, searchInputRef], () => setShowDropdown(false), showDropdown);
    // Cierra el dropdown de géneros al hacer click fuera
    HeaderService.useClickOutside([genresDropdownRef, filterButtonRef], () => setShowGenres(false), showGenres);
    // Cierra el menú usuario al hacer click fuera
    HeaderService.useClickOutside([menuRef, menuButtonRef], () => setShowMenu(false), showMenu);
    // Cierra el menú de autenticación al hacer click fuera
    HeaderService.useClickOutside([authDropdownRef, authButtonRef], () => setShowAuthDropdown(false), showAuthDropdown);
    // Actualiza el usuario si cambia en localStorage (tras login/logout)
    useEffect(() => {
        const syncUser = () => setUser(HeaderService.getUserFromStorage());
        window.addEventListener("storage", syncUser);
        syncUser();
        return () => window.removeEventListener("storage", syncUser);
    }, []);
    //#endregion
    
    //#region Funciones
    //#region Manejo de las búsquedas
    // Maneja el cambio en el input de búsqueda y busca automáticamente
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (value.trim() === "") {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        searchTimeout.current = setTimeout(async () => {
            const data = await HeaderService.fetchSearchResults(value);
            const filtered = HeaderService.filterSearchResults(data);
            setSearchResults(filtered);
            setShowDropdown(filtered.length > 0);
        }, 300);
    };
    // Al pulsar Enter, redirige a la página de resultados
    const handleSearch = (e) => {
        if (e.key === "Enter" && search.trim() !== "") {
            setShowDropdown(false);
            navigate(`/buscar/${encodeURIComponent(search.trim())}`);
        }
    };
    // Oculta el dropdown de resultados, limpia el input y los resultados, y navega a la página de detalle del resultado seleccionado
    const handleResultClick = (result) => {
        setShowDropdown(false);
        setSearch("");
        setSearchResults([]);
        navigate(`/detalle/${result.media_type}/${result.id}`);
    };
    //#endregion

    //#region Manejo de los géneros
    // Lógica de selección múltiple de géneros
    const handleGenreChange = (e) =>
        HeaderService.handleGenreChangeService(e, selectedGenres, setSelectedGenres, onFilterChange);
    // Reinicia los géneros seleccionados
    const handleResetGenres = () =>
        HeaderService.handleResetGenresService(setSelectedGenres, onFilterChange);
    //#endregion

    //#region Manejo de menús y sesiones de usuarios
    // Alterna el menú usuario
    const handleMenuButtonClick = (e) => {
        e.stopPropagation();
        setShowMenu((prev) => !prev);
    };
    // Cierra sesión
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setShowAuthDropdown(false);
    };
    //#endregion
    //#endregion

    //#region Renderizado
    return (
        <header className="header">
            <div className="header-inner">
                <img src="/icons/principal_icon.png" alt="Logo" className="header-logo" />
                <nav>
                    <ul className="header-nav">
                        {navItems.map((item) => (
                            <li key={item.label} className="header-nav-item">
                                <Link to={item.to}
                                    className={`header-link${location.pathname === item.to ? " active" : ""}`}>
                                    {item.label}
                                </Link>
                                {item.label === "Mi Galería" && (
                                    <>
                                        <button ref={filterButtonRef}
                                            onClick={() => setShowGenres((v) => !v)}
                                            className={`filter-button${showGenres ? " active" : ""}`}>
                                            Filtros <span className="filter-icon">{showGenres ? "▲" : "▼"}</span>
                                        </button>
                                        {showGenres && (
                                            <div ref={genresDropdownRef}
                                                className="genres-dropdown">
                                                <div className="genres-dropdown-header">
                                                    <span className="genres-dropdown-title">Filtrar</span>
                                                    <button onClick={handleResetGenres}
                                                            className="genres-dropdown-reset">
                                                            × Reiniciar.
                                                    </button>
                                                </div>
                                                <div className="genres-dropdown-content">
                                                    <label className="genre-checkbox">
                                                        <input type="checkbox"
                                                            value="0"
                                                            checked={selectedGenres.includes("0")}
                                                            onChange={handleGenreChange}
                                                        />
                                                        <span>Todos los géneros</span>
                                                    </label>
                                                    {genres.map((genre) => (
                                                        <label key={genre.id}
                                                            className="genre-checkbox">
                                                            <input type="checkbox"
                                                                value={genre.id}
                                                                checked={selectedGenres.includes(genre.id.toString())}
                                                                onChange={handleGenreChange}
                                                            />
                                                            <span>{genre.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="search-container">
                                            <div className="search-box">
                                                <span className="search-icon">
                                                    <MdSearch size={20} color="#888" />
                                                </span>
                                                <input ref={searchInputRef}
                                                    type="text"
                                                    placeholder="Búsqueda de Películas y Series..."
                                                    value={search}
                                                    onChange={handleSearchChange}
                                                    onKeyDown={handleSearch}
                                                    className="search-input"
                                                />
                                            </div>
                                            {showDropdown && searchResults.length > 0 && (
                                                <div ref={dropdownRef}
                                                    className="search-results-dropdown">
                                                    {searchResults.map((result) => (
                                                        <div key={`${result.media_type}-${result.id}`}
                                                            onClick={() => handleResultClick(result)}
                                                            className="search-result-item"
                                                            onMouseDown={e => e.preventDefault()}>
                                                            <img src={ result.poster_path || result.profile_path
                                                                        ? `https://image.tmdb.org/t/p/w92${result.poster_path || result.profile_path}`
                                                                        : "/images/placeholder_image.png"
                                                                }
                                                                alt={result.title || result.name}
                                                                className="search-result-image"
                                                            />
                                                            <div className="search-result-info">
                                                                <div className="search-result-title">
                                                                    {result.title || result.name}
                                                                </div>
                                                                <div className="search-result-meta">
                                                                    {result.media_type === "movie" ? "Película" : result.media_type === "tv" ? "Serie" : ""}
                                                                    {result.release_date || result.first_air_date ? ` (${(result.release_date || result.first_air_date).slice(0, 4)})` : ""}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="header-flex-spacer" />
                <div className="header-icons">
                    {user && (
                        <span className="header-user-name">
                            {user.nameUser || user.username || user.name}
                        </span>
                    )}
                    <button className="header-icon-button"
                            ref={authButtonRef}
                            onClick={() => setShowAuthDropdown((v) => !v)}
                            title="Usuario"
                            aria-expanded={showAuthDropdown}
                            aria-controls="auth-dropdown">
                        <span className="header-icon">
                            <MdPerson size={26} color="#FFD600" />
                        </span>
                    </button>
                    {showAuthDropdown && (
                        <div className="custom-menu-dropdown"
                            ref={authDropdownRef}
                            id="auth-dropdown">
                            {user ? (
                                <>
                                    <div className="header-user-title">
                                        {user.nameUser || user.username || user.name}
                                    </div>
                                    <div className="header-user-email">
                                        {user.email}
                                    </div>
                                    <button className="header-logout-btn"
                                            onClick={handleLogout}>
                                        Cerrar sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="header-no-user">
                                        No hay ningún usuario logueado
                                    </div>
                                    <button className="header-login-btn"
                                            onClick={() => {
                                            setShowAuthDropdown(false);
                                            navigate("/login");
                                        }}>
                                        Iniciar sesión
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    <button className="header-icon-button"
                            ref={menuButtonRef}
                            onClick={handleMenuButtonClick}
                            title="Menú usuario"
                            aria-expanded={showMenu}
                            aria-controls="custom-menu-dropdown">
                        <span className="header-icon">
                            <MdMenu size={28} color="#FFD600" />
                        </span>
                    </button>
                    {showMenu && (
                        <div className="custom-menu-dropdown menu-dropdown-animate"
                            ref={menuRef}
                            id="custom-menu-dropdown">
                            <ul>
                                <li onClick={() => { setShowMenu(false); navigate("/sobre-la-web"); }}>Sobre la web</li>
                                <li onClick={() => { setShowMenu(false); navigate("/api-info"); }}>API</li>
                                <li onClick={() => { setShowMenu(false); navigate("/desarrollador"); }}>Desarrollador</li>
                                <li onClick={() => { setShowMenu(false); window.open("https://cosmic-panda-67decc.netlify.app/", "_blank", "noopener,noreferrer"); }} > Curriculum Web (Prototipo) </li>
                            </ul>
                        </div>
                    )}
                </div>
                {showAuthModal && (
                    <div className="auth-modal-overlay"
                        onClick={() => setShowAuthModal(false)}>
                        <div className="auth-modal"
                            onClick={e => e.stopPropagation()}>
                            <div className="auth-modal-header">
                                Iniciar sesión / Registrarse
                            </div>
                            <button onClick={() => setShowAuthModal(false)}
                                    className="auth-modal-close"
                                    title="Cerrar">
                                ×
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
    //#endregion
};

export default Header;
