import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Button, Card, CardContent, CardActions,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Pagination
} from "@mui/material";
import {useSpringBootRequest} from "../utils/apiUtils";
import Category from "../enums/Category";

const ProductsPanel = () => {
    const [products, setProducts] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        category: Category.TOOLS,
        stock: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;

    const SpringBootDataRequest = useSpringBootRequest();
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        const data = await SpringBootDataRequest("/products", "GET", null, navigate);
        setProducts(data || []);
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleAddProduct = async () => {
        await SpringBootDataRequest("/products", "POST", newProduct, navigate);
        fetchProducts();
        setDialogOpen(false);
        setNewProduct({
            name: "",
            description: "",
            price: 0,
            category: Category.TOOLS,
            stock: 0,
        });
    };

    const handleDeleteProduct = async (productId) => {
        await SpringBootDataRequest(`/products/${productId}`, "DELETE", null, navigate);
        fetchProducts();
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Products
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
                Add Product
            </Button>
            <Box mt={2}>
                {currentProducts.map((product) => (
                    <Card key={product.id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography>{product.description}</Typography>
                            <Typography>${product.price}</Typography>
                            <Typography>Stock: {product.stock}</Typography>
                            <Typography>Category: {product.category}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleDeleteProduct(product.id)}
                            >
                                Delete Product
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Paginare */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={Math.ceil(products.length / productsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                />
            </Box>

            {/* Add Product Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        name="name"
                        label="Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        name="description"
                        label="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        type="number"
                        name="price"
                        label="Price"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        select
                        name="category"
                        label="Category"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        margin="normal"
                    >
                        {Object.values(Category).map((cat) => (
                            <MenuItem value={cat} key={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        type="number"
                        name="stock"
                        label="Stock"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value, 10) })}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => {
                        handleAddProduct(newProduct);
                        setDialogOpen(false);
                    }}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsPanel;