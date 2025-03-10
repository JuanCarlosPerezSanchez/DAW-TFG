import { register, login } from '../../src/controllers/usersAndAuthController.js';
import User from '../../src/models/User.js';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../../src/utils/hashPassword.js';

// Mock de los módulos
jest.mock('../../src/models/User.js');
jest.mock('jsonwebtoken');
jest.mock('../../src/utils/hashPassword.js');

describe('usersAndAuthController - Unit Tests', () => {
    let req, res;

    
    req = { body: {} };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        send: jest.fn(),
    };

    User.prototype.save = jest.fn().mockResolvedValue({
        _id: '1',
        name: 'Juan Carlos',
        email: 'jcpersan@adaits.es',
        password: 'hashedPassword',
    });
    

    describe('register', () => {
        it('should register a new user and return a token', async () => {
            req.body = { name: 'Juan Carlos', email: 'jcpersan@adaits.es', password: '1234' };
            User.findOne.mockResolvedValue(null);
            hashPassword.mockResolvedValue('hashedPassword');
            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, 'fakeToken');
            });

            await register(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'jcpersan@adaits.es' });
            expect(hashPassword).toHaveBeenCalledWith('1234');
            expect(User.prototype.save).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalledWith(
                { user: { id: '1' } },
                process.env.SECRET_KEY,
                { expiresIn: '1h' },
                expect.any(Function)
            );
            expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
        });

        it('should return 400 if user already exists', async () => {
            req.body = { name: 'Juan Carlos', email: 'jcpersan@adaits.es', password: '1234' };
            User.findOne.mockResolvedValue({});

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'User already exists' });
        });
    });

    describe('login', () => {
        it('should login a user and return a token', async () => {
            req.body = { email: 'jcpersan@adaits.es', password: '1234' };
            User.findOne.mockResolvedValue({ _id: '1', password: 'hashedPassword' });
            comparePassword.mockResolvedValue(true);
            jwt.sign.mockImplementation((payload, secret, options, callback) => {
                callback(null, 'fakeToken');
            });

            await login(req, res);

            expect(User.findOne).toHaveBeenCalledWith({ email: 'jcpersan@adaits.es' });
            expect(comparePassword).toHaveBeenCalledWith('1234', 'hashedPassword');
            expect(jwt.sign).toHaveBeenCalledWith(
                { user: { id: '1' } },
                process.env.SECRET_KEY,
                { expiresIn: '1h' },
                expect.any(Function)
            );
            expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' });
        });

        it('should return 400 if credentials are invalid', async () => {
            req.body = { email: 'jcpersan@adaits.es', password: 'wrongPassword' };
            User.findOne.mockResolvedValue({ _id: '1', password: 'hashedPassword' });
            comparePassword.mockResolvedValue(false);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid Credentials' });
        });
    });
});