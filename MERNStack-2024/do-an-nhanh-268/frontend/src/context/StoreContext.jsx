import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
// import { food_list } from '../assets/assets_vn';

// Tạo Context: Context này sẽ giúp chia sẻ dữ liệu trong toàn bộ ứng dụng mà không cần phải truyền qua props từng cấp
export const StoreContext = createContext(null);

/** StoreContextProvider Component
 * StoreContextProvider là một component bao bọc (wrapper) được sử dụng để cung cấp giá trị của food_list cho các component con thông qua Context.
 * contextValue: Được khởi tạo với food_list, đây chính là giá trị sẽ được truyền tới các component con.
 * StoreContext.Provider: Sử dụng Provider để cung cấp contextValue cho tất cả các component con bên trong ({props.children}).
 */
const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    // backend url
    const url = 'http://localhost:5200/';
    // const [token, setToken] = useState('');
    const [token, setToken] = useState('');
    const [food_list, setFoodList] = useState([]);

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

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // Tìm sản phẩm tương ứng trong danh sách food_list dựa trên _id | Để tăng hiệu suất tìm kiếm có thể thay `find()` bằng cách sử dụng `map()`
                let itemInfo = food_list.find((product) => product._id === item);
                // Tính tổng tiền
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(url + 'api/food/list');
        setFoodList(response.data.data);
    };

    const loadCartData = async (token) => {
        const response = await axios.post(url + 'api/cart/get', {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };

    // Test
    // useEffect(() => {
    //     console.log('cartItems: ', cartItems);
    // }, [cartItems]);

    // get data from local storage
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem('token')) {
                setToken(localStorage.getItem('token'));
                await loadCartData(localStorage.getItem('token'));
            }
        }
        loadData();
    }, []);

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
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        utilityFunctions,
        url,
        token,
        setToken,
    };
    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
