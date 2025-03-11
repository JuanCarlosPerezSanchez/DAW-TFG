import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

describe('usersAndAuthController - E2E Tests', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(0);

        if (!process.env.BBDD_URL) {
            throw new Error('BBDD_URL is not defined');
        }
        await mongoose.connect(process.env.BBDD_URL);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ name: 'Test User', email: 'newUser@gmail.com', password: '1234' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        await request(app)
            .post('/api/user/register')
            .send({ name: 'Test User', email: 'UserNew@gmail.com', password: '1234' });

        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'UserNew@gmail.com', password: '1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});