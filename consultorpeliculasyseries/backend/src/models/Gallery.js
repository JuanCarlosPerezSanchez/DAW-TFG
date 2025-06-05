import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id: { type: Number, required: true }, // id de la película/serie TMDB
    media_type: { type: String, required: true }, // "movie" o "tv"
    title: String,
    name: String,
    overview: String,
    poster_path: String,
    // ...otros campos que quieras guardar
});

export default mongoose.model('Gallery', GallerySchema);
