const API_URL = 'http://localhost:8080/api';

export const getProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    return response.json();
};

export const getProductById = async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
};

export const createProduct = async (product) => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
    return response.json();
};

export const updateProduct = async (id, product) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
    });
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(order),
    });
    return response.json();
};

export const getUsers = async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
};

export const getUserById = async (id) => {
    const response = await fetch(`${API_URL}/users/${id}`);
    return response.json();
};

export const createUser = async (user) => {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
    });
    return response.json();
};

export const updateUser = async (id, user) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(user),
    });
    return response.json();
};

// Creează un articol pentru o comandă
export const createOrderItem = async (orderItem) => {
    const response = await fetch(`${API_URL}/order-items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderItem),
    });
    return response.json();
};

// Obține un articol după ID
export const getOrderItemById = async (id) => {
    const response = await fetch(`${API_URL}/order-items/${id}`);
    return response.json();
};

// Obține toate articolele
export const getAllOrderItems = async () => {
    const response = await fetch(`${API_URL}/order-items`);
    return response.json();
};

// Actualizează un articol
export const updateOrderItem = async (id, orderItem) => {
    const response = await fetch(`${API_URL}/order-items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderItem),
    });
    return response.json();
};

// Șterge un articol
export const deleteOrderItem = async (id) => {
    await fetch(`${API_URL}/order-items/${id}`, { method: "DELETE" });
};