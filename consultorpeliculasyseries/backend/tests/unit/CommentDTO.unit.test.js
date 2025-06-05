import CommentDTO from '../../src/dtos/CommentDTO.js';

describe('CommentDTO', () => {
    it('should map comment fields correctly', () => {
        const comment = {
            _id: 'abc',
            userId: { _id: 'u1', nameUser: 'User' },
            text: 'Hola',
            createdAt: '2024-01-01',
            media_type: 'movie',
            media_id: '123'
        };
        const dto = new CommentDTO(comment);
        expect(dto).toMatchObject({
            _id: 'abc',
            userName: 'User',
            userId: 'u1',
            text: 'Hola',
            createdAt: '2024-01-01',
            media_type: 'movie',
            media_id: '123'
        });
    });
});
