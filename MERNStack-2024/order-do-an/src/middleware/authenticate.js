const { getUserIdFromToken } = require('../config/jwtProvider');
const userService = require('../services/userService');

const authentication = async (req, res, next) => {
    // Bearer token | Token xác thực
    try {
        const token = req.headers.authorrization?.splite(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Không có token được cung cấp' });
        }

        const userId = getUserIdFromToken(token); // Lấy userId từ token
        const user = userService.findUserById(userId); // Tìm người dùng dựa trên userId

        req.user = user; // Nếu tìm thấy người dùng, middleware sẽ gắn thông tin người dùng vào đối tượng req dưới thuộc tính req.user

        /**  Lấy token từ headers: const token = req.headers.authorrization?.splite(' ')[1];
         *      - req.headers.authorrization: Đây là nơi mà token xác thực của người dùng (JWT) thường được gửi kèm trong yêu cầu HTTP.
         *          Token sẽ được gửi trong header Authorization với định dạng Bearer <token>.
         *      - splite(' ')[1]: Ở đây có một lỗi đánh máy. Từ đúng phải là split(' '),
         *          dùng để tách chuỗi theo dấu cách và lấy phần tử thứ hai (phần chứa JWT token sau từ khóa Bearer).
         *      - Nếu không có token trong headers hoặc định dạng token sai, token sẽ là undefined.
         */
    } catch (error) {
        return res.send({ error: error.message });
    }
    next();
};
