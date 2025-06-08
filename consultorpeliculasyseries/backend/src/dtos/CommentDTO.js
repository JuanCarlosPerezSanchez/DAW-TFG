export default class CommentDTO {
    constructor(comment) {
        this._id = comment._id;
        this.userName = comment.userId?.nameUser || 'Usuario';
        this.userId = comment.userId?._id;
        this.text = comment.text;
        this.createdAt = comment.createdAt;
        this.media_type = comment.media_type;
        this.media_id = comment.media_id;
    }
}
