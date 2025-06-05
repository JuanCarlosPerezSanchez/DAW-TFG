import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './loaders/mongoose.js';
import expressLoader from './loaders/express.js';

const app = express();

connectDB();
expressLoader(app);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

export default app;