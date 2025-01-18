import React, { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import CreateProduct from '../components/products/CreateProduct';
import ProductDetails from '../components/products/ProductDetails';

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    useEffect(() => {
        // Mock API Data
        const fetchedProducts = [
            { id: 1, name: 'Hammer', description: 'Hammer for woodworking', price: 10.5, stock: 100, category: 'Tools' },
            { id: 2, name: 'Drill', description: 'Electric drill', price: 150.0, stock: 50, category: 'Power Tools' },
            { id: 3, name: 'Saw', description: 'Hand saw for cutting wood', price: 20.0, stock: 30, category: 'Tools' }
        ];
        setProducts(fetchedProducts);
    }, []);

    const handleProductSelect = (productId) => {
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
    };

    const handleCreateProductToggle = () => {
        setShowCreateForm(!showCreateForm);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Product Page</h1>

            <button onClick={handleCreateProductToggle}>
                {showCreateForm ? 'Cancel Create Product' : 'Create New Product'}
            </button>

            {showCreateForm ? (
                <CreateProduct onProductCreated={(newProduct) => setProducts([...products, newProduct])} />
            ) : (
                <>
                    <ProductList products={products} onProductSelect={handleProductSelect} />
                    {selectedProduct && <ProductDetails product={selectedProduct} />}
                </>
            )}
        </div>
    );
};

export default ProductPage;
