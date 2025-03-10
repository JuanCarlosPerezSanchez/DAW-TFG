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

describe('Series Endpoints', () => {
    it('should get all series', async () => {
        const res = await request(app).get('/api/series');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get a series by ID', async () => {
        const seriesId = 'serieId'; // serieId => cambiar por el Id real de una serie
        const res = await request(app).get(`/api/series/${seriesId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('_id');
    });
});