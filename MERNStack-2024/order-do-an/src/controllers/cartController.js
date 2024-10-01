const cartService = require('../services/cartService');
const userService = require('../services/userService');

module.exports = {
    // ADD ITEM TO CART
    addItemToCart: async (req, res) => {
        try {
            const user = req.user;
            const cart = await cartService.addItemToCart(req.body, user._id);
            res.status(200).json(cart);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // UPDATE CART ITEM QUANTITY
    updateCartItemQuantity: async (req, res) => {
        try {
            const { cartItemId, quantity } = req.body;
            const cart = await cartService.updateCartItemQuantity(cartItemId, quantity);
            res.status(200).json(cart);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // REMOVE ITEM FROM CART
    removeItemFromCart: async (req, res) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const cart = await cartService.removeItemFromCart(id, user);
            res.status(200).json(cart);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // CALCULATE CART TOTALS | CHƯA DÙNG ĐẾN
    calculateCartTotals: async (req, res) => {
        try {
            const { cartId } = req.query;
            const user = await userService.findUserProfileByJwt(jwt);
            const cart = await cartService.findCartByUserId(user.getId());
            const total = await cartService.calculateCartTotals(cart);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // FIND USER CART
    findUserCart: async (req, res) => {
        try {
            const user = req.user;
            console.log('res user: ', user._id);
            const cart = await cartService.findCartByUserId(user._id.toString());
            res.status(200).json(cart);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },

    // CLEAR CART
    clearCart: async (req, res) => {
        try {
            const user = req.user;
            const cart = await cartService.clearCart(user);
            res.status(200).json(cart);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
            }
        }
    },
};
