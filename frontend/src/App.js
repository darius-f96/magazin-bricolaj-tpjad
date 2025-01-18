import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import OrderList from "./components/orders/OrderList";
import OrderDetails from "./components/orders/OrderDetails";
import CreateOrder from "./components/orders/CreateOrder";
import UserList from "./components/users/UsersList";
import UserDetails from "./components/users/UsersDetails";
import CreateUser from "./components/users/CreateUser";
import ProductList from "./components/products/ProducList";
import ProductDetails from "./components/products/ProductDetails";
import CreateProduct from "./components/products/CreateProduct";


function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:productId" element={<ProductDetails />} />
                <Route path="/create-product" element={<CreateProduct />} />
                <Route path="/edit-product/:productId" element={<CreateProduct />} />
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/orders" element={<OrderList/>}/>
                <Route path="/orders/:orderId" element={<OrderDetails/>}/>
                <Route path="/create-order" element={<CreateOrder/>}/>
                <Route path="/users" element={<UserList />} />
                <Route path="/users/:userId" element={<UserDetails />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/edit-user/:userId" element={<CreateUser />} />
            </Routes>
        </Router>
    );
}

export default App;
