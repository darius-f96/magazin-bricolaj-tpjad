import React, { useState } from "react";
import { createOrderItem } from "../../services/api";

const CreateOrderItem = () => {
    const [orderItem, setOrderItem] = useState({
        orderId: "",
        productId: "",
        quantity: "",
        price: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createOrderItem(orderItem);
            alert("Order item created successfully!");
            setOrderItem({ orderId: "", productId: "", quantity: "", price: "" });
        } catch (error) {
            console.error("Failed to create order item", error);
        }
    };

    return (
        <div>
            <h2>Create Order Item</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Order ID:
                    <input
                        type="text"
                        name="orderId"
                        value={orderItem.orderId}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Product ID:
                    <input
                        type="text"
                        name="productId"
                        value={orderItem.productId}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Quantity:
                    <input
                        type="number"
                        name="quantity"
                        value={orderItem.quantity}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={orderItem.price}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateOrderItem;
