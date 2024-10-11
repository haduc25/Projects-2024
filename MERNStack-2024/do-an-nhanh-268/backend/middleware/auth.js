import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: 'Không được phép truy cập, vui lòng đăng nhập' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.body.userId = token_decode.id;

        next();
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

export default authMiddleware;
