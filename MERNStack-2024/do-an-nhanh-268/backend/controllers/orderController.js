import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// đặt lệnh người dùng từ giao diện (FE)
const placeOrder = async (req, res) => {
    const frontend_url = 'http://localhost:5173/';

    try {
        // Lưu & Xóa dữ liệu giỏ hàng của người dùng
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Chuẩn bị dữ liệu thanh toán cho Stripe
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'vnd', // Chuyển sang tiền Việt
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100, // Chỉ cần nhân với 100 vì Stripe yêu cầu
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: 'vnd', // Chuyển sang tiền Việt
                product_data: {
                    name: 'Giao hàng',
                },
                unit_amount: 2000 * 100, // Phí giao hàng 2000 VND (nhân 100)
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

const verifyOrder = async (req, res) => {
    console.log('123: ', req.body);

    const { orderId, success } = req.body;
    try {
        if (success == 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            console.log('true');
            res.json({ success: 'true', message: 'Đã thanh toán' });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            console.log('false');
            res.json({ success: 'false', message: 'Chưa thanh toán' });
        }
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// user orders for front-end
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: 'true', data: orders });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

// listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        res.json({ success: false, message: `Lỗi: ${error.message}` });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders };
