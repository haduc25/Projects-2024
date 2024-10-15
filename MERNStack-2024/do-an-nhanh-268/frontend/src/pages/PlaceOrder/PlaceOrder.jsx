import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './PlaceOrder.css';
import axios from 'axios';

const CHI_PHI_VAN_CHUYEN = 2000;

const PlaceOrder = () => {
    const { getTotalCartAmount, utilityFunctions, token, food_list, cartItems, url } = useContext(StoreContext);
    const { formatCurrency } = utilityFunctions;

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((data) => ({ ...data, [name]: value }));
    };

    // useEffect(() => {
    //     console.log('PlaceOrder_data: ', data);
    // }, [data]);

    const placeOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo['quantity'] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });
        // console.log('PlaceOrder_orderItems: ', orderItems);

        let orderData = {
            address: data,
            items: orderItems,
            amount: getTotalCartAmount() + CHI_PHI_VAN_CHUYEN,
        };
        console.log('PLACE ORDER: ', token);
        let response = await axios.post(url + 'api/order/place', orderData, { headers: { token } });
        if (response.data.success) {
            const { session_url } = response.data;
            console.log('PlaceOrder_session_url: ', session_url);
            console.log('PlaceOrder_responsel: ', response);
            window.location.replace(session_url);
        } else {
            alert('ERROR');
        }
    };

    return (
        <form onSubmit={placeOrder} className="place-order">
            <div className="place-order-left">
                <p className="title">Thông tin đơn hàng</p>
                <div className="multi-fields">
                    <input
                        name="firstName"
                        onChange={onChangeHandler}
                        value={data.firstName}
                        type="text"
                        placeholder="Tên"
                        required
                    />
                    <input
                        name="lastName"
                        onChange={onChangeHandler}
                        value={data.lastName}
                        type="text"
                        placeholder="Họ"
                        required
                    />
                </div>
                <input
                    name="email"
                    onChange={onChangeHandler}
                    value={data.email}
                    type="email"
                    placeholder="Địa chỉ email"
                    required
                />
                <input
                    name="street"
                    onChange={onChangeHandler}
                    value={data.street}
                    type="text"
                    placeholder="Đường"
                    required
                />
                <div className="multi-fields">
                    <input
                        name="city"
                        onChange={onChangeHandler}
                        value={data.city}
                        type="text"
                        placeholder="Thành Phố"
                        required
                    />
                    <input
                        name="state"
                        onChange={onChangeHandler}
                        value={data.state}
                        type="text"
                        placeholder="Thôn-Xã-Huyện-Tỉnh"
                        required
                    />
                </div>
                <div className="multi-fields">
                    <input
                        name="zipcode"
                        onChange={onChangeHandler}
                        value={data.zipcode}
                        type="text"
                        placeholder="Zip code"
                        required
                    />
                    <input
                        name="country"
                        onChange={onChangeHandler}
                        value={data.country}
                        type="text"
                        placeholder="Quốc gia"
                        required
                    />
                </div>
                <input
                    name="phone"
                    onChange={onChangeHandler}
                    value={data.phone}
                    type="text"
                    placeholder="Số điện thoại"
                    required
                />
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
                    <button type="submit">TIẾN HÀNH THANH TOÁN</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
