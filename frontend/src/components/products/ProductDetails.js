import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../services/api';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getProductById(productId).then(setProduct);
    }, [productId]);

    if (!product) {
        return <p>Loading product details...</p>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <p>Description: {product.description}</p>
            <p>Category: {product.category}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <p>Stock: {product.stock}</p>
        </div>
    );
};

export default ProductDetails;
