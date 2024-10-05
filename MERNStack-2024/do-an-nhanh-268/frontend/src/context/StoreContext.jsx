import { createContext } from 'react';
import { food_list } from '../assets/assets_vn';

// Tạo Context: Context này sẽ giúp chia sẻ dữ liệu trong toàn bộ ứng dụng mà không cần phải truyền qua props từng cấp
export const StoreContext = createContext(null);

/** StoreContextProvider Component
 * StoreContextProvider là một component bao bọc (wrapper) được sử dụng để cung cấp giá trị của food_list cho các component con thông qua Context.
 * contextValue: Được khởi tạo với food_list, đây chính là giá trị sẽ được truyền tới các component con.
 * StoreContext.Provider: Sử dụng Provider để cung cấp contextValue cho tất cả các component con bên trong ({props.children}).
 *
 *
 */
const StoreContextProvider = (props) => {
    const contextValue = { food_list };
    return <StoreContext.Provider value={contextValue}>{props.children}</StoreContext.Provider>;
};

export default StoreContextProvider;
