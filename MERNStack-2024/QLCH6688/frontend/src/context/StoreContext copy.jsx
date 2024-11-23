import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { products as product_list } from '../assets/products.js';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = 'http://localhost:6868/';
    const urlImage = 'http://localhost:6868/images/';
    const [token, setToken] = useState('');

    // ADD TO CART
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            // Thêm món ăn vào giỏ hàng: tạo ra một đối tượng mới, sao chép tất cả các mục từ prev, và thêm mục mới cho itemId với giá trị là 1.
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            // Cập nhật số lượng món ăn nếu đã tồn tại: lấy số lượng hiện tại (prev[itemId]) và cộng thêm 1
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }

        if (token) {
            await axios.post(url + 'api/cart/add', { itemId }, { headers: { token } });
        }
    };

    // REMOVE FROM CART
    const removeFromCart = async (itemId) => {
        // CASE 1
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        // CASE 2
        // if (cartItems[itemId] > 1) {
        //     // Cập nhật số lượng món ăn nếu đã tồn tại: lấy số lượng hiện tại (prev[itemId]) và trừ đi 1
        //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        // } else {
        //     // Xóa món ăn khỏi giỏ hàng: tạo ra đối tượng mới, sao chép tất cả các mục từ prev, và loại bỏ mục mới cho itemId
        //     setCartItems((prev) => {
        //         const newCartItems = { ...prev };
        //         delete newCartItems[itemId];
        //         return newCartItems;
        //     });
        // }

        if (token) {
            await axios.post(url + 'api/cart/remove', { itemId }, { headers: { token } });
        }
    };

    // UPDATE CART (Theo số lượng user nhập vào)
    const updateCartItemQuantity = async (itemId, quantity) => {
        // Đảm bảo số lượng hợp lệ (>= 0)
        if (quantity < 0) return;

        setCartItems((prev) => ({
            ...prev,
            [itemId]: quantity,
        }));

        // Cập nhật số lượng trong API nếu có token
        if (token) {
            await axios.post(url + 'api/cart/update', { itemId, quantity }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // Tìm sản phẩm tương ứng trong danh sách product_list dựa trên _id | Để tăng hiệu suất tìm kiếm có thể thay `find()` bằng cách sử dụng `map()`
                let itemInfo = product_list.find((product) => product._id === item);
                // Tính tổng tiền
                totalAmount += itemInfo.sellingPrice * cartItems[item];
            }
        }
        return totalAmount;
    };

    const getTotalCartQuantity = () => {
        let totalQuantity = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalQuantity += cartItems[item];
            }
        }

        return totalQuantity;
    };

    // Global Functions
    const utilityFunctions = {
        sum: (a, b) => a + b, // Hàm sum() đơn giản
        getTotalItems: () => Object.values(cartItems).reduce((sum, qty) => sum + qty, 0), // Tổng số lượng sản phẩm trong giỏ hàng
        calculateDiscount: (totalAmount, discountPercentage) => totalAmount * (1 - discountPercentage / 100), // Hàm tính giảm giá
        getCartItems: () => cartItems, // Trả về giỏ hàng hiện tại
        formatCurrency: (amount) =>
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount),
    };

    const contextValue = {
        product_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        getTotalCartAmount,
        getTotalCartQuantity,
        utilityFunctions,
        url,
        urlImage,
        token,
        setToken,
    };
    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
