export default class CommentsChatDTO {
    constructor({ media_type, media_id, comment, createdAt, text }) {
        if (text !== undefined) {
            this.text = text;
        } else {
            this.media_type = media_type;
            this.media_id = media_id;
            this.comment = comment;
            this.createdAt = createdAt;
        }
    }
}
