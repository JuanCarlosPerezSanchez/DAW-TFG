//#region imports
import { useEffect } from "react";
import UtilsService from "../../services/UtilsService";
// #endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestión de resultado de búsquedas
// Llama a la API para buscar resultados segun coincidencia
async function fetchSearchResults(query) {
    const res = await fetch(
        `${BASE_URL}/tmdb/search?query=${encodeURIComponent(query)}&page=1`
    );
    if (!res.ok) throw new Error("Error en la búsqueda");
    return await res.json();
}
//#endregion

//#region Gestión de géneros
// Lógica de selección múltiple de géneros
function handleGenreChangeService(e, selectedGenres, setSelectedGenres, onFilterChange) {
    const value = e.target.value;
    let changed = false;
    if (value === "0") {
        if (selectedGenres.length !== 1 || selectedGenres[0] !== "0") changed = true;
        setSelectedGenres(["0"]);
    } else {
        let newSelected;
        if (selectedGenres.includes(value)) {
            newSelected = selectedGenres.filter((g) => g !== value);
            if (newSelected.length === 0) newSelected = ["0"];
        } else {
            newSelected = selectedGenres.filter((g) => g !== "0").concat(value);
        }
        if (
            newSelected.length !== selectedGenres.length ||
            !newSelected.every((v, i) => v === selectedGenres[i])
        ) {
            changed = true;
        }
        setSelectedGenres(newSelected);
    }
    if (changed && typeof onFilterChange === "function") {
        onFilterChange();
    }
}
// Restablece la selección de géneros a "Todos los géneros" (valor "0") y reinicia los géneros seleccionados.
function handleResetGenresService(setSelectedGenres, onFilterChange) {
    setSelectedGenres(["0"]);
    if (typeof onFilterChange === "function") {
        onFilterChange();
    }
}
//#endregion

//#region Utilidades
// Hook para cerrar dropdowns al hacer click fuera
function useClickOutside(refs, handler, active = true) {
    useEffect(() => {
        if (!active) return;
        function handleClickOutside(e) {
            if (refs.some(ref => ref.current && ref.current.contains(e.target))) return;
            handler();
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [refs, handler, active]);
}
//#endregion

//#region Servicio
const HeaderService = {
    fetchSearchResults,
    filterSearchResults: UtilsService.filterSearchResults,
    handleGenreChangeService,
    handleResetGenresService,
    getUserFromStorage: UtilsService.getUserFromStorage,
    useClickOutside
};
//#endregion

export default HeaderService;
