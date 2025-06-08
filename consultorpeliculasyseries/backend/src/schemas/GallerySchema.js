//#region Imports
import mongoose from 'mongoose';
//#endregion

//#region Schema
const GallerySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    media_type: {
        type: String,
        required: true,
    },
    title: String,
    overview: String,
    poster_path: String,
}, { collection: 'Gallery' });
//#endregion

export default GallerySchema;
