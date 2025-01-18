import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>Welcome to the DIY Store</h1>
            <p>Your one-stop shop for all your tools and DIY needs!</p>
            <img
                src="https://via.placeholder.com/800x300?text=DIY+Store"
                alt="DIY Store"
                style={{ width: "100%", margin: "20px 0" }}
            />
            <div style={{ marginTop: "20px" }}>
                <h2>Quick Links</h2>
                <nav>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li style={{ margin: "10px 0" }}>
                            <Link to="/products" style={{ textDecoration: "none", fontSize: "18px" }}>
                                View Products
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0" }}>
                            <Link to="/order-items" style={{ textDecoration: "none", fontSize: "18px" }}>
                                Manage Orders
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0" }}>
                            <Link to="/users" style={{ textDecoration: "none", fontSize: "18px" }}>
                                Manage Users
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default HomePage;
