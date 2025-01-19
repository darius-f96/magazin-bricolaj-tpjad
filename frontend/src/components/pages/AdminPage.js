import React, { useEffect, useState, useCallback } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "",
  });
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    const data = await SpringBootDataRequest("/products", "GET", null, navigate);
    setProducts(data || []);
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    const data = await SpringBootDataRequest("/orders", "GET", null, navigate);
    setOrders(data || []);
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const handleAddProduct = async () => {
    await SpringBootDataRequest("/products", "POST", newProduct, navigate);
    fetchProducts();
    setDialogOpen(false);
    setNewProduct({ name: "", description: "", price: 0, category: "" });
  };

  const handleDeleteProduct = async (productId) => {
    await SpringBootDataRequest(`/products/${productId}`, "DELETE", null, navigate);
    fetchProducts();
  };

  const handleDeleteOrder = async (orderId) => {
    await SpringBootDataRequest(`/orders/${orderId}`, "DELETE", null, navigate);
    fetchOrders();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" mb={2}>
            Products
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
            Add Product
          </Button>
          <Box mt={2}>
            {products.map((product) => (
              <Card key={product.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>{product.description}</Typography>
                  <Typography>${product.price}</Typography>
                  <Typography>Category: {product.category}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h5" mb={2}>
            Orders
          </Typography>
          <Box>
            {orders.map((order) => (
              <Accordion key={order.id} sx={{ marginBottom: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Order #{order.id}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>User: {order.user.email}</Typography>
                  <Typography>Date: {new Date(order.date).toLocaleString()}</Typography>
                  <Typography>Total: ${order.total}</Typography>
                  <Box mt={2}>
                    {order.items.map((item) => (
                      <Typography key={item.id}>
                        {item.product.name} - Quantity: {item.quantity}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ marginTop: 2 }}
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete Order
                  </Button>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Category"
            fullWidth
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddProduct} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;

