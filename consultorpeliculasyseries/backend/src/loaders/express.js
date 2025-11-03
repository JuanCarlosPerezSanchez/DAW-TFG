//#region Imports
import express from 'express';
import cors from 'cors';
import routes from '../routes/generalsRoutes.js';
//#endregion

//#region Constantes
const allowedOrigins = [
    'https://daw-tfg.vercel.app',
    'https://daw-tfg-juan-carlos-perez-sanchezs-projects.vercel.app',
    // 'http://localhost:3000'  => Solo para hacer tests en local
];
//#endregion

//#region Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        // Permite peticiones sin origin (como Postman) o desde los orígenes permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acceso no permitido por el sistema de CORS'));
        }
    },
    credentials: true
};
//#endregion

//#region Express Loader
const expressLoader = (app) => {
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use('/api', routes);
};
//#endregion

export default expressLoader;
