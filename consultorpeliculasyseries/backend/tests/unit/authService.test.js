import { register, login } from '../../src/services/authService.js';
import User from '../../src/models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../src/models/userModel.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
    describe('register', () => {
        it('should hash the password and save the user', async () => {
            const userData = { username: 'testuser', email: 'testuser@example.com', password: 'password123' };
            const hashedPassword = 'hashedpassword';

            bcrypt.hash.mockResolvedValue(hashedPassword);
            User.create.mockResolvedValue({ ...userData, password: hashedPassword });

            const user = await register(userData);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(User.create).toHaveBeenCalledWith({ ...userData, password: hashedPassword });
            expect(user).toEqual({ ...userData, password: hashedPassword });
        });
    });

    describe('login', () => {
        it('should return a token if the credentials are valid', async () => {
            const loginData = { email: 'testuser@example.com', password: 'password123' };
            const user = { _id: 'userId', email: 'testuser@example.com', password: 'hashedpassword123' };
            const token = 'jsonwebtoken';

            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue(token);

            const result = await login(loginData);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'testuser@example.com' });
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
            expect(jwt.sign).toHaveBeenCalledWith({ id: 'userId' }, process.env.SECRET_KEY, { expiresIn: '1h' });
            expect(result).toEqual(token);
        });
    });
});