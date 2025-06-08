import GalleryDTO from '../../src/dtos/GalleryDTO.js';

describe('GalleryDTO', () => {
    it('should map gallery fields correctly', () => {
        const gallery = {
            _id: 'abc',
            id: 1,
            media_type: 'movie',
            title: 'Test',
            overview: 'desc',
            poster_path: '/img.jpg'
        };
        const dto = new GalleryDTO(gallery);
        expect(dto).toMatchObject({
            _id: 'abc',
            id: 1,
            media_type: 'movie',
            title: 'Test',
            overview: 'desc',
            poster_path: '/img.jpg'
        });
    });
});
