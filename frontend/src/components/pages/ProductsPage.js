import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";
import { useSpringBootRequest } from "../../utils/apiUtils";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        hasStock: false,
        productCategoryList: [],
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
    });
    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();

    const productCategories = [
        "TOOLS",
        "PAINT",
        "ELECTRICAL",
        "PLUMBING",
        "GARDENING",
        "HARDWARE",
    ];

    // Fetch products with filters and pagination
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const { search, hasStock, productCategoryList } = filters;
        const { currentPage } = pagination;

        try {
            const params = new URLSearchParams({
                search: search || "",
                hasStock: hasStock,
                productCategoryList: productCategoryList.join(","),
                page: currentPage - 1, // Backend expects 0-based page index
                size: 20, // Items per page
            });
            const response = await SpringBootDataRequest(`/products/search?${params}`, "GET", null, navigate);

            setProducts(response.content || []); // Update products
            setPagination((prev) => ({
                ...prev,
                totalPages: response.totalPages,
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [filters, pagination.currentPage, navigate, SpringBootDataRequest]);

    useEffect(() => {
        fetchProducts(); // Re-fetch products when filters or pagination changes
    }, [filters]);

    const handleFilterChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setPagination((prev) => ({
            ...prev,
            currentPage: 1,
        }));
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setFilters((prev) => ({ ...prev, productCategoryList: value }));
    };

    const handlePageChange = async (event, value) => {
        setPagination((prev) => ({
            ...prev,
            currentPage: value,
        }));
        await fetchProductsWithNewPage(value);

    };
    const fetchProductsWithNewPage = async (newPage) => {
        setIsLoading(true);
        setError(null);

        const { search, hasStock, productCategoryList } = filters;

        try {
            const params = new URLSearchParams({
                search: search || "",
                hasStock: hasStock,
                productCategoryList: productCategoryList.join(","),
                page: newPage - 1, // Backend expects 0-based page index
                size: 20,
            });
            const response = await SpringBootDataRequest(`/products/search?${params}`, "GET", null, navigate);

            setProducts(response.content || []);
            setPagination((prev) => ({
                ...prev,
                totalPages: response.totalPages,
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };


    const addToCart = async (productId) => {
        await SpringBootDataRequest(`/cart/addItem?productId=${productId}&quantity=1`, "POST", null, navigate);
        alert("Product added to cart!");
    };

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Products
                </Typography>

                {/* Filters Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 4,
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    {/* Search Field */}
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        sx={{ flexGrow: 1, maxWidth: 300 }}
                    />

                    {/* Has Stock Filter */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={filters.hasStock}
                                onChange={handleFilterChange}
                                name="hasStock"
                            />
                        }
                        label="Has Stock"
                    />

                    {/* Product Categories Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            multiple
                            value={filters.productCategoryList}
                            onChange={handleCategoryChange}
                            renderValue={(selected) => selected.join(", ")}
                        >
                            {productCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Apply Button */}
                    <Button
                        variant="contained"
                        onClick={fetchProducts}
                        sx={{ alignSelf: "flex-end" }}
                    >
                        Apply Filters
                    </Button>
                </Box>

                {/* Products Grid */}
                {isLoading ? (
                    <div>Loading products...</div>
                ) : error ? (
                    <div>Error: {error.message}</div>
                ) : !isLoading && products !== undefined && products.length === 0 ? (
                    <div>No products found.</div>
                ) : (
                    <>
                        <Grid container spacing={3}>
                            {products.map((product) => (
                                <Grid item xs={12} sm={6} md={4} key={product.id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">{product.name}</Typography>
                                            <Typography>${product.price.toFixed(2)}</Typography>
                                            <Typography variant="body2">{product.description}</Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => addToCart(product.id)}
                                                sx={{ mt: 2 }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Pagination */}
                        <Box mt={4} display="flex" justifyContent="center">
                            <Pagination
                                count={pagination.totalPages}
                                page={pagination.currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Layout>
    );
};

export default ProductsPage;