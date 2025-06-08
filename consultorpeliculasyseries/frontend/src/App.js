//#region Imports
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage/HomePage";
import PeliculasPage from "./pages/MoviesPage/MoviesPage";
import SeriesPage from "./pages/SeriesPage/SeriesPage";
import GalleryPage from "./pages/GalleryPage/GalleriPage";
import DetallesPage from "./pages/DetailsPage/DetailsPage";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage";
import SobreLaWebPage from "./pages/AboutTheWebPage/AboutTheWebPage";
import ApiInfoPage from "./pages/ApiInfoPage/ApiInfoPage";
import DesarrolladorPage from "./pages/DeveloperPage/DeveloperPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import RequireAuthPage from "./pages/RequireAuthPage/RequireAuthPage";
import GlobalSessionWatcher from "./components/GlobalSessionWatcher";
import AppService from "./services/AppService";
import "./styles/general.css";
import "./App.css";
//#endregion

const App = () => {
    //#region Estado
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(["0"]);
    const location = useLocation();
    //#endregion

    //#region Eventos
    // Reinicia el scroll al navegar entre páginas
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    // Carga los géneros al inicio usando AppService
    useEffect(() => {
        AppService.fetchAllGenres()
            .then(setGenres)
            .catch(() => { /* Error silencioso */ });
    }, []);
    //#endregion

    //#region Renderizado
    return (
        <div className="App" style={{ background: "#181a20", minHeight: "100vh", marginBottom: "0px" }}>
            <GlobalSessionWatcher />
            <Header
                genres={genres}
                selectedGenres={selectedGenres}
                setSelectedGenres={setSelectedGenres}
                onFilterChange={() => window.scrollTo(0, 0)}
            />
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            genres={genres}
                            selectedGenres={selectedGenres}
                            setSelectedGenres={setSelectedGenres}
                        />
                    }
                />
                <Route
                    path="/peliculas"
                    element={
                        <PeliculasPage
                            genres={genres}
                            selectedGenres={selectedGenres}
                            setSelectedGenres={setSelectedGenres}
                        />
                    }
                />
                <Route
                    path="/series"
                    element={
                        <SeriesPage
                            genres={genres}
                            selectedGenres={selectedGenres}
                            setSelectedGenres={setSelectedGenres}
                        />
                    }
                />
                <Route
                    path="/galeria"
                    element={
                        <RequireAuthPage>
                            <GalleryPage />
                        </RequireAuthPage>
                    }
                />
                <Route path="/detalle/:media_type/:id" element={<DetallesPage />} />
                <Route path="/buscar/:query" element={<SearchResultsPage />} />
                <Route path="/sobre-la-web" element={<SobreLaWebPage />} />
                <Route path="/api-info" element={<ApiInfoPage />} />
                <Route path="/desarrollador" element={<DesarrolladorPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
            </Routes>
        </div>
    );
    //#endregion
};

export default App;
