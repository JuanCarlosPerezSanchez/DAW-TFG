import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';

describe('TMDB Endpoints', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(0);
        await mongoose.connect(process.env.MONGODB_URL);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });

    it('should search multi', async () => {
        const res = await request(app)
            .get('/api/tmdb/search?query=matrix');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('results');
    });

    it('should get popular movies', async () => {
        const res = await request(app)
            .get('/api/tmdb/movie/popular');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('results');
    });

    it('should get popular series', async () => {
        const res = await request(app)
            .get('/api/tmdb/tv/popular');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('results');
    });

    it('should get movie genres', async () => {
        const res = await request(app)
            .get('/api/tmdb/genre/movie/list');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('genres');
    });

    it('should get tv genres', async () => {
        const res = await request(app)
            .get('/api/tmdb/genre/tv/list');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('genres');
    });

    it('should discover movies by genre', async () => {
        const res = await request(app)
            .get('/api/tmdb/discover/movie?with_genres=28');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('results');
    });

    it('should get movie details', async () => {
        const res = await request(app)
            .get('/api/tmdb/movie/603'); // The Matrix
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 603);
    });
});
