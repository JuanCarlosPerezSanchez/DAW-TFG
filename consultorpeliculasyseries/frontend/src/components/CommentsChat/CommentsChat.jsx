//#region Imports
import { useEffect, useRef, useState } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import CommentsChatService from "./CommentsChatService";
import "./CommentsChat.css";
//#endregion

const CommentsChat = ({ media_type, media_id, user }) => {
    //#region Constantes
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);
    const [posting, setPosting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const commentsEndRef = useRef(null);
    const userId = user && (user._id || user.id);
    //#endregion

    //#region Eventos
    // Evento que carga los comentarios cuando cambian segun el tipo de media o el id de usuario
    useEffect(() => {
        setCommentsLoading(true);
        setCommentsError(null);
        CommentsChatService.fetchComments(media_type, media_id)
            .then(data => setComments(Array.isArray(data) ? data : []))
            .catch(() => setCommentsError("No se pudieron cargar los comentarios"))
            .finally(() => setCommentsLoading(false));
    }, [media_type, media_id]);
    //#endregion

    //#region Gestión de comentarios
    // Envía un nuevo comentario
    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        setPosting(true);
        try {
            const dto = {
                media_type,
                media_id,
                comment: newComment.trim(),
                createdAt: new Date().toISOString()
            };
            const saved = await CommentsChatService.postComment(dto);
            setComments(prev => [...prev, saved]);
            setNewComment("");
        } catch {
            alert("No se pudo enviar el comentario.");
        }
        setPosting(false);
    };
    // Inicia la edición de un comentario
    const handleEditComment = (comment) => {
        setEditingId(comment._id);
        setEditingText(comment.text);
    };
    // Actualiza el texto mientras se edita un comentario
    const handleEditChange = (e) => {
        setEditingText(e.target.value);
    };
    // Guarda los cambios de un comentario editado
    const handleEditSubmit = async (comment) => {
        if (!editingText.trim()) return;
        try {
            const dto = { text: editingText.trim() };
            const updated = await CommentsChatService.putComment(comment._id, dto);
            setComments(prev =>
                prev.map(c => c._id === comment._id ? { ...c, text: updated.text } : c)
            );
            setEditingId(null);
            setEditingText("");
        } catch {
            alert("No se pudo editar el comentario.");
        }
    };
    // Elimina un comentario
    const handleDeleteComment = async (comment) => {
        if (!window.confirm("¿Seguro que quieres eliminar este comentario?")) return;
        try {
            await CommentsChatService.deleteComment(comment._id);
            setComments(prev => prev.filter(c => c._id !== comment._id));
        } catch {
            alert("No se pudo eliminar el comentario.");
        }
    };
    //#endregion

    //#region Renderizado
    return (
        <div className="comments-chat-root">
            <div className="comments-chat-title">
                Deja aquí tu reseña o comentario
            </div>
            <div className="comments-chat-list">
                {commentsLoading ? (
                    <div className="comments-chat-loading">Cargando comentarios...</div>
                ) : commentsError ? (
                    <div className="comments-chat-error">{commentsError}</div>
                ) : comments.length === 0 ? (
                    <div className="comments-chat-empty">Sé el primero en dejar una reseña!!!</div>
                ) : (
                    comments.slice().reverse().map((c, idx) => {
                        const commentUserId = c.userId?._id || c.userId || c.user_id;
                        const isCurrentUser = userId && commentUserId && commentUserId.toString() === userId.toString();
                        return (
                            <div key={c._id || idx}
                                className={`comments-chat-message${isCurrentUser ? " current-user" : ""}`}>
                                <div className="comments-chat-message-header" style={{ textAlign: isCurrentUser ? "right" : "left" }}>
                                    <span className="comments-chat-message-user" style={{ color: isCurrentUser ? "#232733" : undefined }}>
                                        {c.userName || "Usuario"}
                                    </span>
                                    <span className="comments-chat-message-date" style={{ color: isCurrentUser ? "#23273399" : undefined }}>
                                        {CommentsChatService.formatDate(c.createdAt)}
                                    </span>
                                    {isCurrentUser && (
                                        <span className="comments-chat-actions">
                                            <button
                                                className="comments-chat-edit-btn"
                                                title="Editar"
                                                onClick={() => handleEditComment(c)}>
                                                <FaPencilAlt size={15} color={isCurrentUser ? "#232733" : "#FFD600"} />
                                            </button>
                                            <button
                                                className="comments-chat-delete-btn"
                                                title="Eliminar"
                                                onClick={() => handleDeleteComment(c)}>
                                                <FaTrash size={15} color={isCurrentUser ? "#232733" : "#FFD600"} />
                                            </button>
                                        </span>
                                    )}
                                </div>
                                {editingId === c._id ? (
                                    <div className="comments-chat-edit-area">
                                        <textarea
                                            className="comments-chat-input"
                                            value={editingText}
                                            onChange={handleEditChange}
                                            rows={2}
                                            maxLength={500}
                                        />
                                        <div className="comments-chat-edit-buttons">
                                            <button
                                                className="comments-chat-btn comments-chat-btn-save"
                                                onClick={() => handleEditSubmit(c)}
                                                disabled={!editingText.trim()}>
                                                Guardar
                                            </button>
                                            <button
                                                className="comments-chat-btn comments-chat-btn-cancel"
                                                onClick={() => { setEditingId(null); setEditingText(""); }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="comments-chat-message-text"
                                        style={{
                                            color: isCurrentUser ? "#232733" : undefined,
                                        }}>
                                        {CommentsChatService.wrapText(c.text)}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={commentsEndRef} />
            </div>
            {user ? (
                <form className="comments-chat-form" onSubmit={handleSendComment}>
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario o reseña..."
                        rows={2}
                        maxLength={500}
                        className="comments-chat-input"
                        disabled={posting}
                    />
                    <button
                        type="submit"
                        disabled={posting || !newComment.trim()}
                        className="comments-chat-btn">
                        {posting ? "Enviando..." : "Enviar"}
                    </button>
                </form>
            ) : (
                <div className="comments-chat-login-msg">
                    Inicia sesión para dejar tu comentario.
                </div>
            )}
        </div>
    );
    //#endregion
};

export default CommentsChat;
