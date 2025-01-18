import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderItemById, updateOrderItem } from "../../services/api";

const EditOrderItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderItem, setOrderItem] = useState({
        orderId: "",
        productId: "",
        quantity: "",
        price: "",
    });

    useEffect(() => {
        fetchOrderItem();
    }, []);

    const fetchOrderItem = async () => {
        const item = await getOrderItemById(id);
        setOrderItem(item);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderItem((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateOrderItem(id, orderItem);
        alert("Order item updated successfully!");
        navigate("/order-items");
    };

    return (
        <div>
            <h2>Edit Order Item</h2>
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
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default EditOrderItem;
