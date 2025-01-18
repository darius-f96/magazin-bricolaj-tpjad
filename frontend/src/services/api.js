const API_URL = 'http://localhost:8080/api';

export const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
};

export const getProductById = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
};

export const getOrders = async () => {
    const response = await fetch(`${API_URL}/orders`);
    return response.json();
};

export const getOrderById = async (id) => {
    const response = await fetch(`${API_URL}/orders/${id}`);
    return response.json();
};

export const createOrder = async (order) => {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
    });
    return response.json();
};