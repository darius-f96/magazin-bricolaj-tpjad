import React, { useState, useEffect, useCallback } from "react";
import { useSpringBootRequest } from "../../utils/apiUtils";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    Button,
    TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import Layout from "../Layout";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(0); // Total pages from backend
    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();

    const [searchParams, setSearchParams] = useState({
        productName: "",
        startDate: "",
        endDate: "",
        minPrice: "",
        maxPrice: "",
        page: 0,
        size: 10, // default to 10 items per page
    });

    const fetchOrders = useCallback(async (e) => {
        setIsLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                ...searchParams,
                startDate: searchParams.startDate || null,
                endDate: searchParams.endDate || null,
                minPrice: searchParams.minPrice || null,
                maxPrice: searchParams.maxPrice || null,
            });

           const data = await SpringBootDataRequest(`/cart/userOrders?${queryParams.toString()}`, "GET", null, navigate);
            setOrders(data.content); // Assuming Spring Boot API returns Page object with `content`
            setTotalPages(data.totalPages); // Store total pages
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, searchParams, SpringBootDataRequest]);

    useEffect(() => {
        fetchOrders();
    }, [searchParams]);

    const handleInputChange = (field) => (event) => {
        setSearchParams({ ...searchParams, [field]: event.target.value });
    };

    const handlePageChange = (newPage) => {
        setSearchParams({ ...searchParams, page: newPage });
    };

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Orders
                </Typography>

                {/* Filter Form */}
                <Box mb={4}>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setSearchParams({ ...searchParams, page: 0 }); // Reset to first page on search
                            fetchOrders();
                        }}
                    >
                        <Box display="flex" gap={2} flexWrap="wrap">
                            <TextField
                                label="Product Name"
                                value={searchParams.productName}
                                onChange={handleInputChange("productName")}
                                size="small"
                            />
                            <TextField
                                label="Start Date"
                                value={searchParams.startDate}
                                onChange={handleInputChange("startDate")}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            <TextField
                                label="End Date"
                                value={searchParams.endDate}
                                onChange={handleInputChange("endDate")}
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            <TextField
                                label="Min Price"
                                value={searchParams.minPrice}
                                onChange={handleInputChange("minPrice")}
                                type="number"
                                size="small"
                            />
                            <TextField
                                label="Max Price"
                                value={searchParams.maxPrice}
                                onChange={handleInputChange("maxPrice")}
                                type="number"
                                size="small"
                            />
                            <Button variant="contained" type="submit">
                                Search
                            </Button>
                        </Box>
                    </form>
                </Box>

                {/* Display Orders */}
                {isLoading ? (
                    <div>Loading orders...</div>
                ) : error ? (
                    <div>Error fetching orders: {error.message}</div>
                ) : (orders != null && orders.length > 0) ? (
                    <Box>
                        {orders.map((order) => (
                            <Accordion key={order.id} sx={{ marginBottom: 2 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        Order #{order.id} - {order.status} - $
                                        {order.totalPrice.toFixed(2)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        <strong>Customer Name:</strong> {order.name}
                                    </Typography>
                                    <Typography>
                                        <strong>Email:</strong> {order.email}
                                    </Typography>
                                    <Typography>
                                        <strong>Order Date:</strong>{" "}
                                        {new Date(order.orderDate).toLocaleString()}
                                    </Typography>
                                    <Typography>
                                        <strong>Last Updated:</strong>{" "}
                                        {new Date(order.updated).toLocaleString()}
                                    </Typography>
                                    <Box mt={2}>
                                        <Typography variant="body1" gutterBottom>
                                            <strong>Products:</strong>
                                        </Typography>
                                        {order.products.length > 0 ? (
                                            order.products.map((product) => (
                                                <Card
                                                    key={product.orderItemId}
                                                    sx={{
                                                        marginBottom: 1,
                                                        padding: 1,
                                                    }}
                                                >
                                                    <Typography>
                                                        <strong>{product.name}</strong>
                                                    </Typography>
                                                    <Typography>
                                                        Quantity: {product.quantity}
                                                    </Typography>
                                                    <Typography>
                                                        Price: ${product.price.toFixed(2)}
                                                    </Typography>
                                                    <Typography>
                                                        Available Stock: {product.availableStock}
                                                    </Typography>
                                                </Card>
                                            ))
                                        ) : (
                                            <Typography>No products in this order.</Typography>
                                        )}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <div>No orders found.</div>
                )}

                {/* Pagination Controls */}
                <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={2}>
                    <Button
                        variant="contained"
                        onClick={() => handlePageChange(searchParams.page - 1)}
                        disabled={searchParams.page <= 0}
                    >
                        Previous
                    </Button>
                    <Typography>
                        Page {searchParams.page + 1} of {totalPages}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => handlePageChange(searchParams.page + 1)}
                        disabled={searchParams.page + 1 >= totalPages}
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </Layout>
    );
};

export default OrdersPage;