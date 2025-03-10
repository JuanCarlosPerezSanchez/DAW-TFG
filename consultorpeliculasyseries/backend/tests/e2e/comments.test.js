import request from 'supertest';
import app from '../../app.js';

describe('commentController - E2E Tests', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'jcpersan@adaits.es', password: '1234' });
        token = res.body.token;
    });

    it('should create a new comment', async () => {
        const res = await request(app)
            .post('/api/comments/createComment')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Test comment' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('text', 'Test comment');
    });

    it('should get all comments', async () => {
        const res = await request(app)
            .get('/api/comments/getComments')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});