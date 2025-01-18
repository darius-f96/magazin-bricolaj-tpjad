import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../../services/api';

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        getOrderById(orderId).then(setOrder);
    }, [orderId]);

    if (!order) {
        return <p>Loading order details...</p>;
    }

    return (
        <div>
            <h1>Order #{order.id}</h1>
            <p>Date: {new Date(order.orderDate).toLocaleString()}</p>
            <p>Total: ${order.totalPrice.toFixed(2)}</p>
            <h2>Items:</h2>
            <ul>
                {order.orderItems.map(item => (
                    <li key={item.id}>
                        <p>{item.product.name} (x{item.quantity})</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetails;
