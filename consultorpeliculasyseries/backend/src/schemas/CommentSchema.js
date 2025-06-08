//#region Imports
import mongoose from 'mongoose';
//#endregion

//#region Schema
const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    media_type: {
        type: String,
        required: true,
    },
    media_id: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'Comments' });
//#endregion

export default CommentSchema;
