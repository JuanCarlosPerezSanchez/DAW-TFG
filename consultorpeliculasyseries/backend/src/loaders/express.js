import express from 'express';
import cors from 'cors';
import routes from '../routes/generalsRoutes.js';

const expressLoader = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
};

export default expressLoader;