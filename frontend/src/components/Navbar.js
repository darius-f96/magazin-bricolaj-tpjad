import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <nav style={styles.navbar}>
        <ul style={styles.navList}>
            <li style={styles.navItem}><Link to="/" style={styles.navLink}>Home</Link></li>
            <li style={styles.navItem}><Link to="/products" style={styles.navLink}>Products</Link></li>
            <li style={styles.navItem}><Link to="/order-items" style={styles.navLink}>Orders</Link></li>
            <li style={styles.navItem}><Link to="/users" style={styles.navLink}>Users</Link></li>
            <li style={styles.navItem}><Link to="/cart" style={styles.navLink}>Cart</Link></li>
        </ul>
    </nav>
);

const styles = {
    navbar: {
        backgroundColor: '#333',
        padding: '10px 20px',
    },
    navList: {
        display: 'flex',
        listStyle: 'none',
        padding: 0,
    },
    navItem: {
        marginRight: '20px',
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        fontSize: '18px',
    }
};

export default Navbar;
