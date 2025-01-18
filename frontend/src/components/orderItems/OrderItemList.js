import React, { useEffect, useState } from "react";
import { getAllOrderItems, deleteOrderItem } from "../../services/api";

const OrderItemList = () => {
    const [orderItems, setOrderItems] = useState([]);

    useEffect(() => {
        fetchOrderItems();
    }, []);

    const fetchOrderItems = async () => {
        const items = await getAllOrderItems();
        setOrderItems(items);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            await deleteOrderItem(id);
            fetchOrderItems(); // Refresh list after deletion
        }
    };

    return (
        <div>
            <h2>Order Items</h2>
            <ul>
                {orderItems.map((item) => (
                    <li key={item.id}>
                        <p>Product ID: {item.product.id}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: ${item.price.toFixed(2)}</p>
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderItemList;
