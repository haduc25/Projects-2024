const Cart = require('../models/cart.model');
const CartItem = require('../models/cartItem.model');
const Food = require('../models/food.model');

module.exports = {
    // CREATE CART
    async createCart(user) {
        const cart = new Cart({ customer: user }); // Tạo đối tượng giỏ hàng mới
        const createdCart = await cart.save();
        return createdCart;
    },

    // FIND CART BY USER ID
    async findCartByUserId(userId) {
        let cart;
        cart = await Cart.findOne({ customer: userId }).populate([
            {
                path: 'items',
                populate: {
                    path: 'food',
                    populate: {
                        path: 'restaurant',
                        select: '_id',
                    },
                },
            },
        ]);

        /** Tìm giỏ hàng dựa trên userId
         * - Cart.findOne({ customer: userId }): Tìm một giỏ hàng trong cơ sở dữ liệu dựa trên userId (người dùng sở hữu giỏ hàng).
         * - populate: Hàm này sử dụng populate để lấy thêm thông tin từ các bảng liên kết: (items: Danh sách các sản phẩm trong giỏ hàng., food: Sản phẩm trong giỏ hàng được liên kết với bảng food., restaurant: Món ăn được liên kết với nhà hàng, chỉ lấy _id của nhà hàng.)
         */

        if (!cart) throw new Error('Không tìm thấy giỏ hàng của UID - ', userId);

        // Lấy các mục trong giỏ hàng
        let cartItems = await CartItem.find({ cart: cart._id }).populate('food');
        /** CartItem.find({ cart: cart._id }):
         *  Tìm tất cả các mục (sản phẩm) liên quan đến giỏ hàng hiện tại bằng cách sử dụng cart._id.
         *  CartItem.find({ cart: cart._id }): Tìm tất cả các mục (sản phẩm) liên quan đến giỏ hàng hiện tại bằng cách sử dụng cart._id.
         */

        console.log('cartItem: ' + cartItems);

        // Tính tổng giá, tổng số lượng và giảm giá
        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        for (const item of cartItems.items) {
            totalPrice += item.price;
            totalDiscountedPrice += item.discountedPrice;
            totalItem += item.quantity;
        }

        // Cập nhật giá trị tính toán vào giỏ hàng
        cart.totalPrice = totalPrice;
        cart.totalDiscountedPrice = totalDiscountedPrice;
        cart.totalItem = totalItem;
        cart.discounted = totalPrice - totalDiscountedPrice; // ~_~ (i don't see this field in cart.model.js :D)

        return cart;
    },

    // ADD ITEM TO CART
    async addItemToCart(req, userId) {
        const cart = await Cart.findOne({ customer: userId }); // Tìm giỏ hàng của user
        const food = await Food.findById(req.menuItemId); // Tìm món ăn theo menuItemId

        // Kiểm tra xem món ăn đã có trong giỏ hàng chưa
        const isPresent = await CartItem.findOne({
            cart: cart._id,
            food: food._id,
            userId,
        });

        // Nếu món ăn chưa có, tạo mới một mục giỏ hàng
        if (!isPresent) {
            const cartItem = new CartItem({
                cart: cart._id,
                food: food._id,
                // quantity: req.quantity,
                quantity: 1, // hoặc req.quantity nếu có
                userId,
                totalPrice: food.price,
            });

            const createdCartItem = await CartItem.save();
            cart.items.push(createdCartItem);
            await cart.save();

            return createdCartItem;
        }

        return isPresent;
    },

    // UPDATE CART ITEM QUANTITY
    async updateCartItemQuantity(cartItemId, quantity) {
        // Tìm CartItem bằng cartItemId
        const cartItem = await CartItem.findById(cartItemId).populate([
            {
                path: 'food',
                populate: {
                    path: 'restaurant',
                    select: '_id',
                },
            },
        ]);

        if (!cartItem) throw new Error(`Không tìm thấy sản phẩm trong giỏ hàng với ID là: ${cartItemId}`);

        // Cập nhật số lượng và tính lại tổng giá
        cartItem.quantity = quantity;
        cartItem.totalPrice = quantity * cartItem.food.price;

        await cartItem.save();
        return cartItem;
    },

    // REMOVE ITEM FROM CART
    async removeItemFromCart(cartItemId, user) {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ customer: user._id });

        if (!cart) throw new Error(`Không tìm thấy giỏ hàng của user có ID là ${cartItemId}`);

        // Xóa sản phẩm khỏi giỏ hàng
        cart.items = cart.items.filter((item) => !item.equals(cartItemId));

        /**  !item.equals(cartItemId)
         *      - item: Là một mục trong mảng cart.items.
         *      - equals(cartItemId): Hàm này kiểm tra xem item có bằng cartItemId hay không.
         *      - Nếu không bằng (tức là !item.equals(cartItemId)), món hàng sẽ được giữ lại trong mảng mới.
         *
         *  => Xóa món hàng khỏi giỏ hàng bằng cách lọc mảng items để chỉ giữ lại những món không bằng cartItemId
         */

        await cart.save();
        return cart;
    },

    // CLEAR CART
    async clearCart(user) {
        const cart = await Cart.findOne({ customer: user._id });
        if (!cart) throw new Error(`Không tìm thấy giỏ hàng của người dùng có ID là: ${user._id}`);

        // Set lại giỏ hàng của user đó
        cart.items = [];
        await cart.save();
        return cart;
    },

    // CALCULATE CART TOTALS
    async calculateCartTotals(cart) {
        try {
            let total = 0;

            for (let cartItem of cart.items) {
                total += cartItem.food.price * cartItem.quantity;
            }

            /** Tính toán giá trị: Đối với mỗi món hàng
             *      - cartItem.food.price: Lấy giá của món ăn.
             *      - cartItem.quantity: Lấy số lượng của món ăn trong giỏ.
             *      - Cập nhật tổng giá trị: total += cartItem.food.price * cartItem.quantity
             *
             *  => Duyệt qua từng món hàng trong giỏ, tính giá trị của mỗi món và cập nhật tổng giá trị.
             */

            return total;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
