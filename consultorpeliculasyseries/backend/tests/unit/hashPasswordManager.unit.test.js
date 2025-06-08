import hashPasswordManager from '../../src/utils/hashPasswordManager.js';

describe('hashPasswordManager', () => {
    it('should hash and compare password correctly', async () => {
        const password = 'test1234';
        const hash = await hashPasswordManager.hashPassword(password);
        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0);

        const isMatch = await hashPasswordManager.comparePassword(password, hash);
        expect(isMatch).toBe(true);

        const isNotMatch = await hashPasswordManager.comparePassword('wrong', hash);
        expect(isNotMatch).toBe(false);
    });
});
