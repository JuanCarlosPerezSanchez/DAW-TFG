//#region Imports
import UtilsService from "../../services/UtilsService";
//#endregion

//#region Constantes
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
//#endregion

//#region Gestión de comentarios
// Funcion para obtener los comentarios de la bbdd
async function fetchComments(media_type, media_id) {
    const res = await fetch(
        `${BASE_URL}/comments?media_type=${media_type}&media_id=${media_id}`
    );
    return await res.json();
}
// Funcion para crear un comentario al backend
async function postComment(commentDTO) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(commentDTO)
    });
    if (!res.ok) throw new Error();
    return await res.json();
}
// Funcion para modificar un comentario
async function putComment(commentId, commentDTO) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(commentDTO)
    });
    if (!res.ok) throw new Error();
    return await res.json();
}
// Funcion para eliminar un comentario
async function deleteComment(commentId) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });
    if (!res.ok) throw new Error();
    return true;
}
//#endregion

//#region Servicio
const CommentsChatService = {
    fetchComments,
    postComment,
    putComment,
    deleteComment,
    getAuthHeaders: UtilsService.getAuthHeaders,
    formatDate: UtilsService.formatDate,
    wrapText: UtilsService.wrapText
};
//#endregion

export default CommentsChatService;
