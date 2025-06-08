//#region Imports
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './loaders/mongoose.js';
import expressLoader from './loaders/express.js';
//#endregion

// #region Procesos
// Crea una instancia de Express (servidor HTTP)
const app = express();
// Inicializa dotenv para leer variables de entorno
dotenv.config();
// Conecta a la base de datos MongoDB
connectDB();
// Configura middlewares globales (como CORS, JSON parsing) y monta las rutas principales en la app de Express
expressLoader(app);
// #endregion

// #region Constantes
const PORT = process.env.PORT;
// #endregion

//#region Servidor
// Arranca el servidor si no está en modo test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
//#endregion

export default app;
