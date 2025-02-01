import React, { useEffect, useState, useCallback } from "react";
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


const OrdersPanel = () => {
    const [orders, setOrders] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null); // Track which product quantity is being edited
    const [editedQuantity, setEditedQuantity] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 8;

    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        const data = await SpringBootDataRequest("/orders", "GET", null, navigate);
        setOrders(data || []);
    }, [navigate]);

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

    // Logica pentru paginare pe client
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <Box>
            <Typography variant="h5" mb={2}>
                Orders
            </Typography>
            <Box>
                {currentOrders.map((order) => (
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

            {/* Paginare */}
            <Box display="flex" justifyContent="center" mt={3}>
                <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    sx={{ marginRight: 2 }}
                >
                    Previous
                </Button>
                <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    sx={{ marginLeft: 2 }}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default OrdersPanel;
