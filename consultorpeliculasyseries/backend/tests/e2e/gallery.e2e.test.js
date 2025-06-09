import request from 'supertest';
import app from '../../src/app.js';
import mongoose from 'mongoose';
import User from '../../src/models/User.js';
import Gallery from '../../src/models/Gallery.js';

describe('Gallery Endpoints', () => {
    let server;
    let token;

    beforeAll(async () => {
        server = app.listen(0);
        await mongoose.connect(process.env.MONGODB_URL);
    });

    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });

    beforeEach(async () => {
        await User.deleteMany({ email: 'galleryuser@email.com' });
        await Gallery.deleteMany({});
        await request(app)
            .post('/api/user/register')
            .send({ nameUser: 'GalleryUser', email: 'galleryuser@email.com', password: '1234' });
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'galleryuser@email.com', password: '1234' });
        token = res.body.token;
    });

    it('should add an item to gallery', async () => {
        // Vuelve a loguear el usuario para asegurar un token válido
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({ email: 'galleryuser@email.com', password: '1234' });
        const freshToken = loginRes.body.token || token;
        const res = await request(app)
            .post('/api/user/gallery')
            .set('Authorization', `Bearer ${freshToken}`)
            .send({
                id: 123,
                media_type: 'movie',
                title: 'Test Movie',
                overview: 'Test Overview',
                poster_path: '/test.jpg'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id', 123);
    });

    it('should get user gallery', async () => {
        // Añade un item primero y guarda el token tras añadir el usuario
        await request(app)
            .post('/api/user/gallery')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: 123,
                media_type: 'movie',
                title: 'Test Movie',
                overview: 'Test Overview',
                poster_path: '/test.jpg'
            });
        // Vuelve a loguear el usuario para obtener un token válido por si acaso
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({ email: 'galleryuser@email.com', password: '1234' });
        const freshToken = loginRes.body.token || token;
        const res = await request(app)
            .get('/api/user/gallery')
            .set('Authorization', `Bearer ${freshToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty('id', 123);
    });

    it('should not add duplicate item to gallery', async () => {
        await request(app)
            .post('/api/user/gallery')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: 123,
                media_type: 'movie',
                title: 'Test Movie',
                overview: 'Test Overview',
                poster_path: '/test.jpg'
            });
        const res = await request(app)
            .post('/api/user/gallery')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: 123,
                media_type: 'movie',
                title: 'Test Movie',
                overview: 'Test Overview',
                poster_path: '/test.jpg'
            });
        expect(res.statusCode).toBe(400);
    });

    it('should delete item from gallery', async () => {
        // Añade un item primero
        await request(app)
            .post('/api/user/gallery')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id: 123,
                media_type: 'movie',
                title: 'Test Movie',
                overview: 'Test Overview',
                poster_path: '/test.jpg'
            });
        // Envía los datos como query params, no como body
        const res = await request(app)
            .delete('/api/user/gallery')
            .set('Authorization', `Bearer ${token}`)
            .query({ id: 123, media_type: 'movie' });
        expect(res.statusCode).toBe(200);
    });
});
