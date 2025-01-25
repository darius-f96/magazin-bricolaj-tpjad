import React, { useEffect, useState, useCallback } from "react";
import { useSpringBootRequest} from "../../utils/apiUtils";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const SpringBootDataRequest = useSpringBootRequest();

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
    await SpringBootDataRequest(`/cart/removeItem?productId=${productId}`, "DELETE", null, navigate);
    const data = await SpringBootDataRequest("/cart", "GET", null, navigate);
    setCart(data);
  };

  const submitOrder = async () => {
    await SpringBootDataRequest("/cart/submit", "POST", null, navigate);
    const data = await SpringBootDataRequest("/cart", "GET", null, navigate);
    setCart(data);
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
      ) : cart.products.length > 0 ? (
        <List>
          {cart.products.map((item) => (
            <ListItem key={item.id}>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <ListItemText
                  primary={item.price}
                  secondary={`Total price: ${item.price*item.quantity}`}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <div>Your cart is empty :(.</div>
      )}
      {cart.products?.length > 0 && (
        <Button variant="contained" color="primary" onClick={submitOrder} sx={{ mt: 2 }}>
          Submit Order
        </Button>
      )}
    </Box>
  );
};

export default CartPage;