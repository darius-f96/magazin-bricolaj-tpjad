import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/api';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getOrders().then(setOrders);
    }, []);

    return (
        <div>
            <h1>Your Orders</h1>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        <h3>Order #{order.id}</h3>
                        <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
                        <p>Total: ${order.totalPrice.toFixed(2)}</p>
                        <Link to={`/orders/${order.id}`}>View Details</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
