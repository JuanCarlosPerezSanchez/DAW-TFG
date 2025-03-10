import express from 'express';
import dotenv from 'dotenv';
import connectDB from './loaders/mongoose.js';
import expressLoader from './loaders/express.js';

dotenv.config();

const app = express();

connectDB();
expressLoader(app);

const PORT = 6000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));