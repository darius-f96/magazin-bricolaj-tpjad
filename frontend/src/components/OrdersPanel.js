import React, {useEffect, useState, useCallback} from "react";
import {
    Box,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Card,
    CardActions,
    TextField
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useNavigate} from "react-router-dom";
import {useSpringBootRequest} from "../utils/apiUtils";
import {formatToIsoWithoutMilliseconds} from "../utils/dateFormatter";


const OrdersPanel = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null); // Track which product quantity is being edited
    const [editedQuantity, setEditedQuantity] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

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

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            const queryParams = new URLSearchParams({
                ...searchParams,
                startDate: searchParams.startDate ? formatToIsoWithoutMilliseconds(searchParams.startDate) : null,
                endDate: searchParams.endDate ? formatToIsoWithoutMilliseconds(searchParams.endDate) : null,
                minPrice: searchParams.minPrice || null,
                maxPrice: searchParams.maxPrice || null,
            });

            const queryString = queryParams.toString()
                .replace(/%3A/g, ":") // Decode colons
                .replace(/%2F/g, "/"); // Decode slashes if encoded


            const data = await SpringBootDataRequest(`/orders/search?${queryString}`, "GET", null, navigate);
            setOrders(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, searchParams, SpringBootDataRequest]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Handle deleting an order
    const handleDeleteOrder = async (orderId) => {
        await SpringBootDataRequest(`/orders/${orderId}`, "DELETE", null, navigate);
        fetchOrders();
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        await SpringBootDataRequest(`/orders/${orderId}/status?newStatus=${status}`, "PUT", null, navigate);
        fetchOrders();
    };

    // Handle updating product quantity in an order
    const handleUpdateProductQuantity = async (orderId, productId) => {
        await SpringBootDataRequest(
            `/orders/${orderId}/items/${productId}/updateQt?quantity=${editedQuantity}`,
            "PUT",
            null,
            navigate
        );
        setEditingProductId(null);
        setEditedQuantity(0);
        fetchOrders();
    };

    // Handle removing a product from an order
    const handleRemoveProductFromOrder = async (orderId, productId) => {
        await SpringBootDataRequest(`/orders/${orderId}/items/${productId}`, "DELETE", null, navigate);
        fetchOrders();
    };

    const handleInputChange = (field) => (event) => {
        setSearchParams({...searchParams, [field]: event.target.value});
    };

    const handlePageChange = (newPage) => {
        setSearchParams({...searchParams, page: newPage});
    };

    return (
        <Box>
            {/* Filter Form */}
            <Box mb={4}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSearchParams({...searchParams, page: 0}); // Reset to first page on search
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
                            InputLabelProps={{shrink: true}}
                            size="small"
                        />
                        <TextField
                            label="End Date"
                            value={searchParams.endDate}
                            onChange={handleInputChange("endDate")}
                            type="date"
                            InputLabelProps={{shrink: true}}
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
                        <Accordion key={order.id} sx={{marginBottom: 2}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography>
                                    Order #{order.id} - {order.status} - ${order.totalPrice.toFixed(2)}
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
                                                sx={{marginBottom: 1, padding: 1}}
                                            >
                                                <Typography>
                                                    <strong>{product.name}</strong>
                                                </Typography>
                                                <Typography>
                                                    Quantity: {editingProductId === product.productId ? (
                                                    <TextField
                                                        type="number"
                                                        value={editedQuantity}
                                                        onChange={(e) =>
                                                            setEditedQuantity(parseInt(e.target.value, 10))
                                                        }
                                                        size="small"
                                                    />
                                                ) : (
                                                    product.quantity
                                                )}
                                                </Typography>
                                                <Typography>
                                                    Price: ${product.price.toFixed(2)}
                                                </Typography>
                                                <Typography>
                                                    Available Stock: {product.availableStock}
                                                </Typography>
                                                <CardActions>
                                                    {editingProductId === product.productId ? (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={() =>
                                                                handleUpdateProductQuantity(
                                                                    order.id,
                                                                    product.productId
                                                                )
                                                            }
                                                            sx={{marginRight: 2}}
                                                        >
                                                            Save Quantity
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            onClick={() => setEditingProductId(product.productId)}
                                                        >
                                                            Edit Quantity
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        onClick={() =>
                                                            handleRemoveProductFromOrder(order.id, product.productId)
                                                        }
                                                    >
                                                        Remove Product
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        ))
                                    ) : (
                                        <Typography>No products in this order.</Typography>
                                    )}
                                </Box>
                                <Box mt={2}>
                                    <Typography variant="body1">
                                        <strong>Order Actions:</strong>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleUpdateOrderStatus(order.id, "CONFIRMED")}
                                        sx={{marginRight: 2}}
                                    >
                                        Confirm Order
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => handleUpdateOrderStatus(order.id, "CANCELLED")}
                                        sx={{marginRight: 2}}
                                    >
                                        Cancel Order
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleUpdateOrderStatus(order.id, "DELIVERED")}
                                        sx={{marginRight: 2}}
                                    >
                                        Mark as Delivered
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteOrder(order.id)}
                                        sx={{marginRight: 2}}
                                    >
                                        Delete Order
                                    </Button>
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
    );
};

export default OrdersPanel;
