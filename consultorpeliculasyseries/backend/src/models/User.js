//#region Imports
import mongoose from 'mongoose';
import UserSchema from '../schemas/UserSchema.js';
//#endregion

//#region Modelo
const User = mongoose.model('User', UserSchema);
//#endregion

export default User;