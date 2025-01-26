import React, {useEffect, useState, useCallback} from "react";
import {useSpringBootRequest} from "../../utils/apiUtils";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useNavigate} from "react-router-dom";
import Category from "../../enums/Category";
import Layout from '../Layout';

const AdminPage = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false); // For adding products
    const [editingProductId, setEditingProductId] = useState(null); // Track which product quantity is being edited
    const [editedQuantity, setEditedQuantity] = useState(0); // Hold the new quantity
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 0,
        category: Category.TOOLS,
        stock: 0,
    });
    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();

    // Fetch products
    const fetchProducts = useCallback(async () => {
        const data = await SpringBootDataRequest("/products", "GET", null, navigate);
        setProducts(data || []);
    }, [navigate]);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        const data = await SpringBootDataRequest("/orders", "GET", null, navigate);
        setOrders(data || []);
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, [fetchProducts, fetchOrders]);

    // Handle adding a new product
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

    // Handle deleting a product
    const handleDeleteProduct = async (productId) => {
        await SpringBootDataRequest(`/products/${productId}`, "DELETE", null, navigate);
        fetchProducts();
    };

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

    return (
        <Layout>
            <Box p={3}>
                <Typography variant="h4" mb={2}>
                    Admin Dashboard
                </Typography>
                <Grid container spacing={4}>
                    {/* Left Panel: Products */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" mb={2}>
                            Products
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
                            Add Product
                        </Button>
                        <Box mt={2}>
                            {products.map((product) => (
                                <Card key={product.id} sx={{marginBottom: 2}}>
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
                    </Grid>

                    {/* Right Panel: Orders */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" mb={2}>
                            Orders
                        </Typography>
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
                    </Grid>
                </Grid>

                {/* Add Product Dialog */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            name="name"
                            label="Name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            name="description"
                            label="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            type="number"
                            name="price"
                            label="Price"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            select
                            name="category"
                            label="Category"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
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
                            onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value, 10)})}
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddProduct}>Add</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
};

export default AdminPage;
