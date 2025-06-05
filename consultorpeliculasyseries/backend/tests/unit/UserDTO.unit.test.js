import UserDTO from '../../src/dtos/UserDTO.js';

describe('UserDTO', () => {
    it('should map user fields correctly', () => {
        const user = {
            _id: 'abc',
            nameUser: 'Test',
            email: 'test@email.com',
            password: 'secret'
        };
        const dto = new UserDTO(user);
        expect(dto).toMatchObject({
            _id: 'abc',
            nameUser: 'Test',
            email: 'test@email.com'
        });
        expect(dto).not.toHaveProperty('password');
    });
});
