import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';

describe('usersAndAuthController - E2E Tests', () => {
    let server;

    beforeAll(async () => {
        server = app.listen(6000);
    });

    afterAll(async () => {
        await User.deleteMany({});
        server.close();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'newUser@gmail.com', password: '1234' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'UserNew@gmail.com', password: '1234' });

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'UserNew@gmail.com', password: '1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});