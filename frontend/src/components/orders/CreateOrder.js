import React, { useState } from 'react';
import { createOrder } from '../../services/api';

const CreateOrder = () => {
    const [order, setOrder] = useState({ userId: '', orderItems: [] });
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleAddItem = () => {
        const newItem = { productId: parseInt(productId), quantity: parseInt(quantity), price: 0 };
        setOrder(prev => ({
            ...prev,
            orderItems: [...prev.orderItems, newItem],
        }));
        setProductId('');
        setQuantity(1);
    };

    const handleSubmit = async () => {
        await createOrder(order);
        alert('Order created successfully!');
    };

    return (
        <div>
            <h1>Create Order</h1>
            <label>User ID:</label>
            <input
                type="text"
                value={order.userId}
                onChange={e => setOrder({ ...order, userId: e.target.value })}
            />
            <h2>Order Items:</h2>
            <ul>
                {order.orderItems.map((item, index) => (
                    <li key={index}>
                        Product ID: {item.productId}, Quantity: {item.quantity}
                    </li>
                ))}
            </ul>
            <label>Product ID:</label>
            <input type="text" value={productId} onChange={e => setProductId(e.target.value)} />
            <label>Quantity:</label>
            <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="1"
            />
            <button onClick={handleAddItem}>Add Item</button>
            <button onClick={handleSubmit}>Submit Order</button>
        </div>
    );
};

export default CreateOrder;
