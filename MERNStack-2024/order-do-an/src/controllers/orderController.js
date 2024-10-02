const orderService = require('../services/orderService');
const userService = require('../services/userService');

module.exports = {
    // CUSTOMER ORDER CONTROLLERS
    // CREATE ORDER
    createOrder: async (req, res) => {
        try {
            const user = req.user;
            const order = req.body;
            // if (!order) throw new Error('PLease provide valid request body');

            const paymentResponse = await orderService.createOrder(order, user);
            res.status(200).json(paymentResponse);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // GET ALL USER ORDERS
    getAllUserOrders: async (req, res) => {
        try {
            user = req.user;
            // if (!user.id) throw new Error('Không tìm thấy ID người dùng');
            const userOrders = await orderService.getUserOrders(user._id);
            res.status(200).json(userOrders);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // ADMIN ORDER CONTROLLER
    // DELETE ORDER
    deleteOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            await orderService.cancelOrder(orderId);
            res.status(200).json({ message: `Đơn hàng đã bị xóa với ID là: ${orderId}` });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // GET ALL RESTAURANT ORDERS
    getAllRestaurantOrders: async (req, res) => {
        try {
            const { restaurantId } = req.params;
            const { order_status } = req.query;
            const orders = await orderService.getOrdersOfRestaurant(restaurantId, res.status(200).json(orders));
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // UPDATE ORDER
    updateOrder: async (req, res) => {
        try {
            const { orderId, orderStatus } = res.params;
            const order = await orderService.updateOrder(orderId, orderStatus);
            res.status(200).json(order);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },
};
