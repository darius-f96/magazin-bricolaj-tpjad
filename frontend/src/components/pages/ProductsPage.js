import React, {useEffect, useState, useCallback, useContext} from "react";
import {useSpringBootRequest} from "../../utils/apiUtils";
import {Box, Typography, Grid, Card, CardContent, Button, AppBar, Toolbar, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {useAuth} from "../context/AuthContext";


const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();

    const {user, logout} = useAuth();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await SpringBootDataRequest('/products', 'GET', null, navigate);
            setProducts(response || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addToCart = async (productId) => {
        await SpringBootDataRequest(`/cart/addItem?productId=${productId}&quantity=1`, 'POST', null, navigate);
        alert('Product added to cart!');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{flexGrow: 1}}>
                        Bricolaj TPJAD
                    </Typography>
                    <IconButton color="inherit" onClick={() => navigate('/cart')}>
                        <ShoppingCartIcon/>
                    </IconButton>
                    <Button
                        color="inherit"
                        startIcon={<ListAltIcon/>}
                        onClick={() => navigate('/orders')}
                        sx={{mr: 2}}
                    >Orders</Button>
                    {user?.role?.includes("ROLE_ADMIN") && (
                        <Button
                            color="inherit"
                            startIcon={<AdminPanelSettingsIcon/>}
                            onClick={() => navigate('/admin')}
                            sx={{mr: 2}}
                        >
                            Admin
                        </Button>
                    )}
                    {user && (
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Box sx={{p: 4}}>
                <Typography variant="h4" gutterBottom>
                    Products
                </Typography>
                {isLoading ? (
                    <div>Loading products...</div>
                ) : error ? (
                    <div>Error: {error.message}</div>
                ) : !isLoading && products !== undefined && products.length === 0 ? (
                    <div>No products found.</div>
                ) : (
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
                                            sx={{mt: 2}}
                                        >
                                            Add to Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </>
    );
};

export default ProductsPage;