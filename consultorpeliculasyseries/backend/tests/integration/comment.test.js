import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/userModel.js';
import Comment from '../../src/models/commentModel.js';

let token;
let commentId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // Register and login a test user to get a token
    await request(app)
        .post('/api/auth/register')
        .send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });

    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123'
        });

    token = res.body.token;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Comment Endpoints', () => {
    it('should create a new comment', async () => {
        const res = await request(app)
            .post('/api/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'This is a test comment',
                movieId: 'peliculaId' // peliculaId => cambiar por el Id real de una película
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('_id');
        commentId = res.body._id;
    });

    it('should update a comment', async () => {
        const res = await request(app)
            .put(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'This is an updated test comment'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.content).toEqual('This is an updated test comment');
    });

    it('should delete a comment', async () => {
        const res = await request(app)
            .delete(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(204);
    });

    it('should get comments by movie ID', async () => {
        const res = await request(app).get('/api/comments/movie/peliculaId'); // peliculaId => cambiar por el Id real de una película
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should get comments by series ID', async () => {
        const res = await request(app).get('/api/comments/series/serieId'); // serieId => cambiar por el Id real de una serie
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});