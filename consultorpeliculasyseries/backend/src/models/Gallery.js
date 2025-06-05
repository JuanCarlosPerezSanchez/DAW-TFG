//#region Imports
import mongoose from 'mongoose';
import GallerySchema from '../schemas/GallerySchema.js';
//#endregion

//#region Modelo
const Gallery = mongoose.model('Gallery', GallerySchema);
//#endregion

export default Gallery;
