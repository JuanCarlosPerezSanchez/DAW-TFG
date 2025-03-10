import request from 'supertest';
import app from '../../src/app.js';
import Comment from '../../src/models/Comment.js';

describe('commentController - E2E Tests', () => {
    ;
    let server;

    const res = request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'testUser@gmail.com', password: '1234' });

    let token = res.body.token;

    it('should create a new comment', async () => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Test comment' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('text', 'Test comment');
    });

    it('should get all comments', async () => {
        const res = await request(app)
            .get('/api/comments')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    afterAll(async () => {
        await Comment.deleteMany({});
        server.close();
    });
});