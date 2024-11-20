import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';

import './Orders.css';

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);

    const fetchAllOrders = async () => {
        const response = await axios.get(url + 'api/order/list');
        if (response.data.success) {
            setOrders(response.data.data);
            console.log('ADMIN_Orders_response.data.data: ', response.data.data);
        } else {
            toast.error('Failed to fetch orders');
            console.log('ERROR_ADMIN_ORDERS_response.data.message: ', response.data.message);
        }
    };

    const statusHandler = async (event, orderId) => {
        console.log('Event, OrderId: ', event, orderId);

        const response = await axios.post(url + 'api/order/status', { orderId, status: event.target.value });
        if (response.data.success) {
            await fetchAllOrders();
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className="order add">
            <h3>Trang đặt hàng</h3>
            <div className="order-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-item">
                        <img src={assets.parcel_icon} alt="parcel_icon" />
                        <div>
                            <p className="order-item-food">
                                {order.items.map((item, index) => {
                                    if (index === order.items.length - 1) {
                                        return item.name + ' x ' + item.quantity;
                                    } else {
                                        return item.name + ' x ' + item.quantity + ', ';
                                    }
                                })}
                            </p>
                            <p className="order-item-name">{order.address.lastName + ' ' + order.address.firstName}</p>
                            <div className="order-item-address">
                                <p>{order.address.street + ', '}</p>
                                <p>
                                    {order.address.city +
                                        ', ' +
                                        order.address.state +
                                        ', ' +
                                        order.address.country +
                                        ', ' +
                                        order.address.zipcode}
                                </p>
                            </div>
                            <p className="order-item-phone">{order.address.phone}</p>
                        </div>
                        <p>Items: {order.items.length}</p>
                        <p>{order.amount} vnđ</p>
                        <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                            <option value="Đang chuẩn bị món ăn...">Đang chuẩn bị món ăn</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã giao hàng">Đã giao hàng</option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
