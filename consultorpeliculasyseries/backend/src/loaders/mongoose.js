//#region Imports
import mongoose from 'mongoose';
//#endregion

//#region Mongoose Loader
// Permite que las queries incluyan campos no definidos en el esquema (para compatibilidad o flexibilidad)
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
    }
};
//#endregion

export default connectDB;