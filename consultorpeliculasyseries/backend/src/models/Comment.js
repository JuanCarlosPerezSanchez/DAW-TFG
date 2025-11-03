//#region Imports
import mongoose from 'mongoose';
import CommentSchema from '../schemas/CommentSchema.js';
//#endregion

//#region Modelo
const Comment = mongoose.model('Comment', CommentSchema); // Permite realizar operaciones CRUD (crear, leer, actualizar, borrar)
//#endregion

export default Comment;