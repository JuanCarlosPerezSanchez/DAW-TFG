import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Movie Endpoints', () => {
    it('should get all movies', async () => {
        const res = await request(app).get('/api/movies');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get a movie by ID', async () => {
        const movieId = 'peliculaId'; // peliculaId => cambiar por el Id real de una película
        const res = await request(app).get(`/api/movies/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
    });
});