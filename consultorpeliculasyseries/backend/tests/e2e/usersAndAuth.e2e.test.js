import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';

describe('Users & Auth Endpoints', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(0);
        await mongoose.connect(process.env.MONGODB_URL);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });

    beforeEach(async () => {
        // Limpia la colección de usuarios antes de cada test
        await User.deleteMany({});
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'TestUser', email: 'testuser@email.com', password: '1234' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
    });

    it('should not register with existing email', async () => {
        await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'TestUser2', email: 'testuser@email.com', password: '1234' });
        const res = await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'TestUser2', email: 'testuser@email.com', password: '1234' });
        expect(res.statusCode).toBe(400);
    });

    it('should login a user', async () => {
        // Registra el usuario antes de hacer login
        await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'TestUser', email: 'testuser@email.com', password: '1234' });
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'testuser@email.com', password: '1234' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'testuser@email.com', password: 'wrong' });
        expect(res.statusCode).toBe(400);
    });
});
