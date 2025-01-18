import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../../services/api';

const CreateProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
    });

    useEffect(() => {
        if (productId) {
            getProductById(productId).then(setProduct);
        }
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (productId) {
            await updateProduct(productId, product);
            alert('Product updated successfully!');
        } else {
            await createProduct(product);
            alert('Product created successfully!');
        }
        navigate('/products');
    };

    return (
        <div>
            <h1>{productId ? 'Edit Product' : 'Create Product'}</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input
                    type="text"
                    value={product.name}
                    onChange={e => setProduct({ ...product, name: e.target.value })}
                    required
                />
                <label>Description:</label>
                <textarea
                    value={product.description}
                    onChange={e => setProduct({ ...product, description: e.target.value })}
                    required
                />
                <label>Price:</label>
                <input
                    type="number"
                    value={product.price}
                    onChange={e => setProduct({ ...product, price: parseFloat(e.target.value) })}
                    required
                />
                <label>Stock:</label>
                <input
                    type="number"
                    value={product.stock}
                    onChange={e => setProduct({ ...product, stock: parseInt(e.target.value) })}
                    required
                />
                <label>Category:</label>
                <input
                    type="text"
                    value={product.category}
                    onChange={e => setProduct({ ...product, category: e.target.value })}
                    required
                />
                <button type="submit">{productId ? 'Update Product' : 'Create Product'}</button>
            </form>
        </div>
    );
};

export default CreateProduct;
