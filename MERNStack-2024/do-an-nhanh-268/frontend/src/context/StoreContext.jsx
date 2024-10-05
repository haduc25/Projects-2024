import { createContext, useEffect, useState } from 'react';
import { food_list } from '../assets/assets_vn';

// Tạo Context: Context này sẽ giúp chia sẻ dữ liệu trong toàn bộ ứng dụng mà không cần phải truyền qua props từng cấp
export const StoreContext = createContext(null);

/** StoreContextProvider Component
 * StoreContextProvider là một component bao bọc (wrapper) được sử dụng để cung cấp giá trị của food_list cho các component con thông qua Context.
 * contextValue: Được khởi tạo với food_list, đây chính là giá trị sẽ được truyền tới các component con.
 * StoreContext.Provider: Sử dụng Provider để cung cấp contextValue cho tất cả các component con bên trong ({props.children}).
 */
const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});

    // ADD TO CART
    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            // Thêm món ăn vào giỏ hàng: tạo ra một đối tượng mới, sao chép tất cả các mục từ prev, và thêm mục mới cho itemId với giá trị là 1.
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            // Cập nhật số lượng món ăn nếu đã tồn tại: lấy số lượng hiện tại (prev[itemId]) và cộng thêm 1
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
    };

    // REMOVE FROM CART
    const removeFromCart = (itemId) => {
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
    };

    useEffect(() => {
        console.log('cartItems: ', cartItems);
    }, [cartItems]);

    const contextValue = { food_list, cartItems, setCartItems, addToCart, removeFromCart };
    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
