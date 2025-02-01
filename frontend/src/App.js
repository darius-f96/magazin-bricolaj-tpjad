import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./components/auth/Login";
import ProductsPage from "./components/pages/ProductsPage";
import CartPage from "./components/pages/CartPage";
import OrdersPage from "./components/pages/OrdersPage";
import AdminPage from "./components/pages/AdminPage";
import {AuthProvider} from "./components/context/AuthContext";
import {Navigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Register from "./components/auth/Register";
import MyProfilePage from "./components/pages/MyProfilePage";

const App = () => {
    return (<div>
            <ToastContainer/>,
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/products" element={<ProductsPage/>}/>
                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/orders" element={<OrdersPage/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<MyProfilePage/>}/>
                    <Route path="*" element={<Navigate to="/login"/>}/>
                </Routes>
            </AuthProvider>
        </div>
    );
};

export default App;
