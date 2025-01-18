import React, { useState } from 'react';

const Cart = ({ cartItems, onQuantityChange, onRemoveItem }) => {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.price} $</td>
                            <td>
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
                                    style={{ width: '50px' }}
                                />
                            </td>
                            <td>{(item.price * item.quantity).toFixed(2)} $</td>
                            <td>
                                <button onClick={() => onRemoveItem(item.id)}>Remove</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Cart;
