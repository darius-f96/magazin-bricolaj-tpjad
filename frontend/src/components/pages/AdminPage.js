import React, { useEffect, useState } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import {
  Box,
  Typography,
  Grid,
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

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const data = await SpringBootDataRequest("/api/products", "GET", navigate);
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    const data = await SpringBootDataRequest("/api/orders", "GET", navigate);
    setOrders(data || []);
  };

  const handleAddProduct = async () => {
    await SpringBootDataRequest("/api/products", "POST", newProduct, navigate);
    fetchProducts();
    setDialogOpen(false);
    setNewProduct({ name: "", description: "", price: 0, category: "" });
  };

  const handleDeleteProduct = async (productId) => {
    await SpringBootDataRequest(`/api/products/${productId}`, "DELETE", navigate);
    fetchProducts();
  };

  const handleDeleteOrder = async (orderId) => {
    await SpringBootDataRequest(`/api/orders/${orderId}`, "DELETE", navigate);
    fetchOrders();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* Products Section */}
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

        {/* Orders Section */}
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

      {/* Add Product Dialog */}
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

