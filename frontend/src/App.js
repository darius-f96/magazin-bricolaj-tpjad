import logo from './logo.svg';
import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';


function App() {
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/products" element={<ProductsPage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/orders" element={<OrderList/>}/>
                <Route path="/orders/:orderId" element={<OrderDetails/>}/>
                <Route path="/create-order" element={<CreateOrder/>}/>
            </Routes>
        </Router>
    );
}

export default App;
