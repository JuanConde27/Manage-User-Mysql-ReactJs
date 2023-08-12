import jwt from 'jsonwebtoken';

const createJwt = (id) => {
    try {
        const payload = { id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });
        return token;
    } catch (error) {
        res.status(400).json({ message: 'Something went wrong' });
    } 
};

export default createJwt;