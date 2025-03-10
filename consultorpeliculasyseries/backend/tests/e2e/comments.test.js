import request from 'supertest';
import app from '../../src/app.js';
import Comment from '../../src/models/Comment.js';

describe('commentController - E2E Tests', () => {
    let token;
    let server;

    beforeAll(async () => {
        server = app.listen(6000);

        const res = await request(app)
            .post('/api/auth/register')
            .send({ name: 'Test User', email: 'testUser@gmail.com', password: '1234' });

        token = res.body.token;
    });

    afterAll(async () => {
        await Comment.deleteMany({});
        server.close();
    });

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
});