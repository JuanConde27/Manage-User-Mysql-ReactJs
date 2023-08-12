import jwt from 'jsonwebtoken';

const validateJwt = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

export default validateJwt;