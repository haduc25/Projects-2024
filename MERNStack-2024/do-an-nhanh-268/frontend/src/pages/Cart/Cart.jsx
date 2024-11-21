import { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const CHI_PHI_VAN_CHUYEN = 2000;

const Cart = () => {
    const { cartItems, food_list, removeFromCart, getTotalCartAmount, utilityFunctions, url } =
        useContext(StoreContext);
    const { formatCurrency } = utilityFunctions;

    const navigate = useNavigate();

    // Tính tổng
    const TONG_TIEN_SAN_PHAM = getTotalCartAmount();
    const CHI_PHI_VAN_CHUYEN_THUC_TE = TONG_TIEN_SAN_PHAM === 0 ? 0 : CHI_PHI_VAN_CHUYEN;
    const TONG_TIEN = TONG_TIEN_SAN_PHAM + CHI_PHI_VAN_CHUYEN_THUC_TE;

    return (
        <div className="cart">
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Mặt hàng</p>
                    <p>Tên sản phẩm</p>
                    <p>Giá</p>
                    <p>Số lượng</p>
                    <p>Tổng tiền</p>
                    <p>Xóa</p>
                </div>
                <br />
                <hr />
                {console.log('food_list: ', food_list)}
                {console.log('cartItems: ', cartItems)}
                {food_list.map(
                    (item) =>
                        cartItems[item._id] > 0 && (
                            <div key={item._id}>
                                <div className="cart-items-title cart-items-item">
                                    <img src={url + 'images/' + item.image} alt={item.name} />
                                    <p>{item.name}</p>
                                    <p>{formatCurrency(item.price)}</p>
                                    <p className="quantity">{cartItems[item._id]}</p>
                                    <p>{formatCurrency(item.price * cartItems[item._id])}</p>
                                    <p onClick={() => removeFromCart(item._id)} className="cross">
                                        x
                                    </p>
                                </div>
                                <hr />
                            </div>
                        ),
                )}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2>Tổng giỏ hàng</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Tổng cộng</p>
                            <p>{formatCurrency(TONG_TIEN_SAN_PHAM)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Phí vận chuyển</p>
                            <p>{formatCurrency(CHI_PHI_VAN_CHUYEN_THUC_TE)}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Tổng cộng</b>
                            <b>{formatCurrency(TONG_TIEN)}</b>
                        </div>
                    </div>
                    <button onClick={() => navigate('/dat-hang')}>MUA HÀNG</button>
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
