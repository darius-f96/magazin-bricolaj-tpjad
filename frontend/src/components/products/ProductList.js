import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts().then(setProducts);
    }, []);

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        <h3>{product.name}</h3>
                        <p>Category: {product.category}</p>
                        <p>Price: ${product.price.toFixed(2)}</p>
                        <p>Stock: {product.stock}</p>
                        <Link to={`/products/${product.id}`}>View Details</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
