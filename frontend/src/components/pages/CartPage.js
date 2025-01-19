import React, { useEffect, useState, useCallback } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SpringBootDataRequest("/cart", "GET", null, navigate);
      setCart(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const removeFromCart = async (productId) => {
    await SpringBootDataRequest(`/cart/remove/${productId}`, "DELETE", null, navigate);
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const submitOrder = async () => {
    await SpringBootDataRequest("/orders", "POST", { items: cart }, navigate);
    setCart([]);
    alert("Order placed successfully!");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Cart
      </Typography>
      {isLoading ? (
        <div>Loading cart...</div>
      ) : error ? (
        <div>Error fetching cart: {error.message}</div>
      ) : cart.length > 0 ? (
        <List>
          {cart.map((item) => (
            <ListItem key={item.product.id}>
              <ListItemText
                primary={item.product.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeFromCart(item.product.id)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <div>Your cart is empty :(.</div>
      )}
      {cart.length > 0 && (
        <Button variant="contained" color="primary" onClick={submitOrder} sx={{ mt: 2 }}>
          Submit Order
        </Button>
      )}
    </Box>
  );
};

export default CartPage;