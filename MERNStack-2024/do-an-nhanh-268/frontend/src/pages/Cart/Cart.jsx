import { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';

const CHI_PHI_VAN_CHUYEN = 2000;

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, utilityFunctions } = useContext(StoreContext);
    const { formatCurrency } = utilityFunctions;

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Mặt hàng</p>
                    <p>Tiêu đề</p>
                    <p>Giá</p>
                    <p>Số lượng</p>
                    <p>Tổng tiền</p>
                    <p>Xóa</p>
                </div>
                <br />
                <hr />
                {food_list.map(
                    (item, index) =>
                        cartItems[item._id] > 0 && (
                            <>
                                <div key={index} className="cart-items-title cart-items-item">
                                    <img src={item.image} alt={item.name} />
                                    <p>{item.name}</p>
                                    <p>{formatCurrency(item.price)}</p>
                                    <p>{cartItems[item._id]}</p>
                                    <p>{formatCurrency(item.price * cartItems[item._id])}</p>
                                    <p onClick={() => removeFromCart(item._id)} className="cross">
                                        x
                                    </p>
                                </div>
                                <hr />
                            </>
                        ),
                )}
            </div>
            <div className="cart-bottom">
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
                            <p>{formatCurrency(CHI_PHI_VAN_CHUYEN)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng cộng</b>
                            <b>{formatCurrency(getTotalCartAmount() + CHI_PHI_VAN_CHUYEN)}</b>
                        </div>
                    </div>
                    <button>TIẾN HÀNH THANH TOÁN</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>Nếu bạn có mã giảm giá, Nhập vào đây</p>
                        <div className="cart-promocode-input">
                            <input type="text" placeholder="Mã giảm giá" />
                            <button>Áp dụng</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
