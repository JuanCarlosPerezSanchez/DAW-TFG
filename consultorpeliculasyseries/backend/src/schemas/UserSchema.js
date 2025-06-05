import mongoose from 'mongoose';

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

export default UserSchema;