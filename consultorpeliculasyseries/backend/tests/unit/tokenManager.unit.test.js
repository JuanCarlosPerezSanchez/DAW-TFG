import tokenManager from '../../src/utils/tokenManager.js';

beforeAll(() => {
    process.env.SECRET_KEY = 'test_secret';
});

describe('tokenManager', () => {
    it('should generate and verify a token', () => {
        const user = { id: '123', nameUser: 'Test', email: 'test@email.com' };
        const token = tokenManager.generateToken(user);
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);

        const decoded = tokenManager.verifyToken(token);
        expect(decoded).toHaveProperty('user');
        expect(decoded.user).toMatchObject(user);
    });

    it('should throw error for invalid token', () => {
        expect(() => tokenManager.verifyToken('invalid.token')).toThrow();
    });
});
