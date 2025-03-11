import request from 'supertest';
import app from '../../src/app.js';
import Comment from '../../src/models/Comment.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

describe('commentController - E2E Tests', () => {
    let server;
    let token;

    beforeAll(async () => {
        server = app.listen(0);

        const res = await request(app)
            .post('/api/user/register')
            .send({ name: 'Test User', email: 'testUser@gmail.com', password: '1234' });

        token = res.body.token;
        if (!token) {
            throw new Error('Token was not received');
        }
    });

    afterAll(async () => {
        await Comment.deleteMany({});
        await mongoose.disconnect();
        server.close();
    });

    it('should create a new comment', async () => {
        const res = await request(app)
            .post('/api/comments/createComment')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Test comment' });

        expect(res.statusCode).toBe(201);
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