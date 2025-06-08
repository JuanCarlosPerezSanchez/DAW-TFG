export default class GalleryDTO {
    constructor(gallery) {
        this._id = gallery._id;
        this.id = gallery.id;
        this.media_type = gallery.media_type;
        this.title = gallery.title;
        this.overview = gallery.overview;
        this.poster_path = gallery.poster_path;
    }
}
