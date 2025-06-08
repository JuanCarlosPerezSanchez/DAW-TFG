//#region Imports
import express from 'express';
import cors from 'cors';
import routes from '../routes/generalsRoutes.js';
//#endregion

//#region Express Loader
const expressLoader = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
};
//#endregion

export default expressLoader;
