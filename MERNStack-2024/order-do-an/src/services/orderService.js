const Restaurant = require('../models/restaurant.model');
const cartService = require('./cartService');
const Order = require('../models/order.model');

module.exports = {
    // CREATE ORDER
    async createOrder(order, user) {
        try {
            // Xử lý địa chỉ giao hàng
            const address = order.deliveryAddress;
            let saveAddress;
            if (address._id) {
                const isAddressExist = await Address.findById(address._id);

                if (isAddressExist) {
                    saveAddress = isAddressExist;
                } else {
                    const shippingAddress = new Address(order.deliveryAddress);
                    saveAddress = await shippingAddress.save();
                }
            }

            // Thêm địa chỉ vào danh sách địa chỉ của người dùng (Nếu địa chỉ vừa lưu không có trong danh sách địa chỉ của người dùng, nó sẽ được thêm vào và cập nhật người dùng.)
            if (!user.addresses.includes(saveAddress._id)) {
                user.addresses.push(saveAddress._id);
                await user.save();
            }

            const restaurant = await Restaurant.findById(order.restaurantId);
            if (!restaurant) throw new Error(`Không tìm thấy nhà hàng với ID là ${order.restaurantId}`);

            const cart = await cartService.findCartByUserId(user._id);
            if (!cart) throw new Error(`Không tìm thấy giỏ hàng`);

            // Tạo danh sách sản phẩm từ giỏ hàng
            const orderItems = [];
            for (const cartItem of cart.items) {
                const orderItem = new OrderItem({
                    food: cartItem.food,
                    ingredients: cartItem.ingredients,
                    quantity: cartItem.quantity,
                    totalPrice: cartItem.food.price * cartItem.quantity,
                });
                const savedOrderItem = await orderItem.save();
                orderItems.push(savedOrderItem._id);
            }

            // Tính tổng giá trị đơn hàng
            const totalPrice = await cartService.calculateCartTotals(cart);

            // Tạo và lưu đơn hàng
            const createdOrder = new Order({
                customer: user._id,
                deliveryAddress: savedAddress._id,
                createdAt: new Date(),
                orderStatus: 'PENDING',
                totalAmount: totalPrice,
                restaurant: restaurant._id,
                items: orderItems,
            });
            const savedOrder = await createdOrder.save();

            // Cập nhật nhà hàng với đơn hàng mới
            restaurant.orders.push(savedOrder._id);
            await restaurant.save();

            //// CHƯA DÙNG ĐẾN
            // const paymentResponse = await paymentService.generatePaymentLink(savedOrder);
            // console.log('paymentResponse: ', paymentResponse);
            // return paymentResponse;

            return savedOrder;
        } catch (error) {
            throw new Error(`Không thể tạo đơn hàng: ${error.message}`);
        }
    },

    // CANCEL ORDER
    async cancelOrder(orderId) {
        try {
            await Order.findByIdAndDelete(orderId);
        } catch (error) {
            throw new Error(`Không thể hủy đơn hàng với ID là: ${orderId}: ${error.message}`);
        }
    },

    // FIND ORDER BY ID
    async findOrderById(orderId) {
        try {
            const order = await Order.findById(orderId);
            if (!order) throw new Error(`Không tìm thấy đơn hàng với ID là: ${orderId}`);

            return order;
        } catch (error) {
            throw new Error(`Không thể tìm thấy đơn hàng với ID là: ${orderId}`);
        }
    },

    // GET USER ORDERS
    async getUserOrders(userId) {
        try {
            const orders = await Order.find({ customer: userId });
            return orders;
        } catch (error) {
            throw new Error(`Không thể lấy đơn hàng của người dùng: ${error.message}`);
        }
    },

    // GET ORDERS OF RESTAURANT
    async getOrdersOfRestaurant(restaurantId, orderStatus) {
        try {
            let orders = await Order.find({ restaurant: restaurantId });
            if (orderStatus) orders = orders.filter((order) => order.orderStatus === orderStatus);

            return orders;
        } catch (error) {
            throw new Error(`Không thể lấy đơn hàng của nhà hàng với ID là: ${restaurantId}: ${error.message}`);
        }
    },

    // UPDATE ORDER
    async updateOrder(orderId, orderStatus) {
        try {
            // Kiểm tra trạng thái đơn hàng hợp lệ
            const validStatuses = ['OUT_OF_DELIVERY', 'DELIVERED', 'COMPLETED', 'PENDING'];
            if (!validStatuses.includes(orderStatus)) throw new Error('Vui lòng chọn một trạng thái đơn hàng hợp lệ.');

            // Tìm đơn hàng theo ID
            const order = await Order.findById(orderId);
            if (!order) throw new Error(`Không tìm thấy đơn hàng với ID là: ${orderId}`);

            // Cập nhật trạng thái đơn hàng
            order.orderStatus = orderStatus;
            await order.save();

            // Send notification
            // await NotificationService.sendOrderStatusNotification(order)

            return order;
        } catch (error) {
            throw new Error(`Không thể cập nhật đơn hàng với ID là: ${orderId}: ${error.message}`);
        }
    },
};
