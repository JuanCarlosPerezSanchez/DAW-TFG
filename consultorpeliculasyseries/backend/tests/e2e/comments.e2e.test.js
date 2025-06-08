import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import Comment from '../../src/models/Comment.js';

describe('Comments Endpoints', () => {
    let server;
    let token;
    let commentId;

    beforeAll(async () => {
        server = app.listen(0);
        await mongoose.connect(process.env.MONGODB_URL);
        await User.deleteMany({});
        await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'CommentUser', email: 'comment@email.com', password: '1234' });
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'comment@email.com', password: '1234' });
        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });

    beforeEach(async () => {
        await User.deleteMany({ email: 'commentuser@email.com' });
        await Comment.deleteMany({});
        await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'CommentUser', email: 'commentuser@email.com', password: '1234' });
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'commentuser@email.com', password: '1234' });
        token = res.body.token;
    });

    it('should create a comment', async () => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                media_type: 'movie',
                media_id: '999',
                comment: 'Test comment'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('text', 'Test comment');
        commentId = res.body._id;
    });

    it('should get comments for a media', async () => {
        // Crea un comentario primero
        const createRes = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                media_type: 'movie',
                media_id: '999',
                comment: 'Test comment'
            });
        expect(createRes.statusCode).toBe(201);
        const res = await request(app)
            .get('/api/comments?media_type=movie&media_id=999');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('text', 'Test comment');
    });

    it('should update a comment', async () => {
        // Crea un comentario primero
        const createRes = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                media_type: 'movie',
                media_id: '999',
                comment: 'Test comment'
            });
        expect(createRes.statusCode).toBe(201);
        commentId = createRes.body._id;
        expect(commentId).toBeDefined();
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Updated comment' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('text', 'Updated comment');
    });

    it('should delete a comment', async () => {
        // Crea un comentario primero
        const createRes = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                media_type: 'movie',
                media_id: '999',
                comment: 'Test comment'
            });
        expect(createRes.statusCode).toBe(201);
        commentId = createRes.body._id;
        expect(commentId).toBeDefined();
        const res = await request(app)
            .delete(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });
});
