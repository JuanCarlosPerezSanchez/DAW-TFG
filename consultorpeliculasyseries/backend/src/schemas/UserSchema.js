//#region Imports
import mongoose from 'mongoose';
//#endregion

//#region Schema
const UserSchema = new mongoose.Schema({
    nameUser: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { collection: 'Users' });
//#endregion

export default UserSchema;