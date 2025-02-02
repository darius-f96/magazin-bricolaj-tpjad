import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box, Typography, Button, Card, CardContent, CardActions,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Pagination, Checkbox, FormControlLabel, FormControl, InputLabel, Select
} from "@mui/material";
import { useSpringBootRequest } from "../utils/apiUtils";
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
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
    const [filters, setFilters] = useState({
        search: "",
        hasStock: false,
        productCategoryList: [],
    });

    const SpringBootDataRequest = useSpringBootRequest();
    const navigate = useNavigate();

    const fetchProducts = useCallback(async (page = pagination.currentPage) => {
        const { search, hasStock, productCategoryList } = filters;
        try {
            const params = new URLSearchParams({
                search: search || "",
                hasStock: hasStock,
                productCategoryList: productCategoryList.join(","),
                page: page - 1,
                size: 4,
            });

            const response = await SpringBootDataRequest(`/products/search?${params}`, "GET", null, navigate);
            setProducts(response.content || []);
            setPagination({ currentPage: page, totalPages: response.totalPages });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [filters, pagination.currentPage, navigate, SpringBootDataRequest]);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const handlePageChange = (event, value) => {
        setPagination((prev) => ({ ...prev, currentPage: value }));
        fetchProducts(value);
    };

    const handleFilterChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    const handleCategoryChange = (event) => {
        setFilters((prev) => ({ ...prev, productCategoryList: event.target.value }));
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await SpringBootDataRequest(`/products/${productId}`, "DELETE", null, navigate);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleAddProduct = async () => {
        try {
            await SpringBootDataRequest("/products", "POST", newProduct, navigate);
            setDialogOpen(false);
            setNewProduct({ name: "", description: "", price: 0, category: Category.TOOLS, stock: 0 });
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    return (
        <Box>
            {/* Filters */}
            <Box mt={2} display="flex" gap={10} flexWrap="wrap">
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>Add Product</Button>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <FormControlLabel
                    control={<Checkbox checked={filters.hasStock} onChange={handleFilterChange} name="hasStock" />}
                    label="Has Stock"
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        multiple
                        value={filters.productCategoryList}
                        onChange={handleCategoryChange}
                        renderValue={(selected) => selected.join(", ")}
                    >
                        {Object.values(Category).map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Product List */}
            <Box mt={2}>
                {products.map((product) => (
                    <Card key={product.id} sx={{ marginBottom: 2 }}>
                        <CardContent>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography>{product.description}</Typography>
                            <Typography>${product.price}</Typography>
                            <Typography>Stock: {product.stock}</Typography>
                            <Typography>Category: {product.category}</Typography>
                        </CardContent>
                        <CardActions>
                            <Button variant="contained" color="error" onClick={() => handleDeleteProduct(product.id)}>Delete Product</Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                    count={pagination.totalPages}
                    page={pagination.currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>

            {/* Add Product Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <TextField label="Name" fullWidth margin="dense" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                    <TextField label="Description" fullWidth margin="dense" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <TextField label="Price" type="number" fullWidth margin="dense" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
                    <TextField label="Stock" type="number" fullWidth margin="dense" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Category</InputLabel>
                        <Select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                            {Object.values(Category).map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddProduct} variant="contained" color="primary">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductsPanel;
