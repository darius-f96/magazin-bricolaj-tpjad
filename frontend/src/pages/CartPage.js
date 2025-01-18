import React, { useState, useEffect } from 'react';
import Cart from '../components/Cart';
import '../styles/CartPage.css';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCartItems = [
            { id: 1, name: 'Hammer', price: 10.5, quantity: 2 },
            { id: 2, name: 'Drill', price: 150.0, quantity: 1 },
            { id: 3, name: 'Saw', price: 20.0, quantity: 3 }
        ];
        setCartItems(savedCartItems);
    }, []);

    const handleQuantityChange = (id, newQuantity) => {
        const updatedItems = cartItems.map(item => {
            if (item.id === id) {
                item.quantity = newQuantity;
            }
            return item;
        });
        setCartItems(updatedItems);
    };

    const handleRemoveItem = (id) => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        setCartItems(updatedItems);
    };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart-page">
            <h1 className="title">Cart</h1>
            <Cart
                cartItems={cartItems}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
            />
            <div className="cart-summary">
                <h3>Total: <span>{totalPrice.toFixed(2)} $</span></h3>
                <button className="checkout-btn" onClick={() => alert('Proceed to checkout')}>
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CartPage;
