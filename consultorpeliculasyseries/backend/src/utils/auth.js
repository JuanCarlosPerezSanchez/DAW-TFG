import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ user: { id: user.id } }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.SECRET_KEY);
};

export { generateToken, verifyToken };