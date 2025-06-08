export default class UserDTO {
    constructor(user) {
        this._id = user._id;
        this.nameUser = user.nameUser;
        this.email = user.email;
    }
}
