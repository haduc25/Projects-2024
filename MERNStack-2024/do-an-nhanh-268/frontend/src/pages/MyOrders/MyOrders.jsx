import { useState, useEffect, useContext } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import { assets } from '../../assets/assets_vn';

import axios from 'axios';

const MyOrders = () => {
    const { url, token, utilityFunctions } = useContext(StoreContext);
    const { formatCurrency } = utilityFunctions;

    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + 'api/order/userorders', {}, { headers: { token } });
        setData(response.data.data);
        console.log('response.data.data: ', response.data.data);
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    return (
        <div className="my-orders">
            <p>My Orders</p>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className="my-orders-order">
                        <img src={assets.parcel_icon} alt="parcel icon" />
                        <p>
                            {order.items.map((item, index) => {
                                if (index === order.items.length - 1) {
                                    // Sản phẩm cuối cùng
                                    return `${item.name} x ${item.quantity}`;
                                } else {
                                    return `${item.name} x ${item.quantity}, `;
                                }
                            })}
                        </p>
                        <p>{formatCurrency(order.amount)}</p>
                        <p>Mặt hàng: {order.items.length}</p>
                        <p>
                            <span>&#x25cf;</span> <b>{order.status}</b>
                        </p>
                        <button>Theo dõi đơn hàng</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
