const { getUserIdFromToken } = require('../config/jwtProvider');
const userService = require('../service/userService');

const authentication = async (req, res, next) => {
    // Bearer token | Token xác thực
    try {
        const token = req.headers.authorrization?.splite(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Không có token được cung cấp' });
        }

        const userId = getUserIdFromToken(token);
        const user = userService.findUserById(userId);

        req.user = user;
    } catch (error) {
        return res.send({ error: error.message });
    }
    next();
};
