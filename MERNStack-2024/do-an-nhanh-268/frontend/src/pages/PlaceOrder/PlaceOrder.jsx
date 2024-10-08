import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';

const CHI_PHI_VAN_CHUYEN = 2000;

const PlaceOrder = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, utilityFunctions } = useContext(StoreContext);
    const { formatCurrency } = utilityFunctions;

    return (
        <form className="place-order">
            <div className="place-order-left">
                <p className="title">Thông tin đơn hàng</p>
                <div className="multi-fields">
                    <input type="text" placeholder="Tên" />
                    <input type="text" placeholder="Họ" />
                </div>
                <input type="email" placeholder="Địa chỉ email" />
                <input type="text" placeholder="Đường" />
                <div className="multi-fields">
                    <input type="text" placeholder="Thành Phố" />
                    <input type="text" placeholder="Thôn-Xã-Huyện-Tỉnh" />
                </div>
                <div className="multi-fields">
                    <input type="text" placeholder="Zip code" />
                    <input type="text" placeholder="Quốc gia" />
                </div>
                <input type="text" placeholder="Số điện thoại" />
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Tổng giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Tổng cộng</p>
                            <p>{formatCurrency(getTotalCartAmount())}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí vận chuyển</p>
                            <p>{formatCurrency(getTotalCartAmount() === 0 ? 0 : CHI_PHI_VAN_CHUYEN)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng cộng</b>
                            {formatCurrency(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + CHI_PHI_VAN_CHUYEN)}
                        </div>
                    </div>
                    <button>TIẾN HÀNH THANH TOÁN</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
