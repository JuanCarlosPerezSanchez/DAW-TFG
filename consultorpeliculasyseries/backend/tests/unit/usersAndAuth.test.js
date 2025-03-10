import request from 'supertest';
import app from '../../src/app.js';

describe('usersAndAuthController - E2E Tests', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'jcpersan@adaits.es', password: '1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should login a user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jcpersan@adaits.es', password: '1234' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});