import React, { useEffect, useState } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      const data = await SpringBootDataRequest("/cart", "GET", navigate);
      setCart(data);
    };

    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    await SpringBootDataRequest(`/cart/remove/${productId}`, "DELETE", navigate);
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
      {cart.length > 0 && (
        <Button variant="contained" color="primary" onClick={submitOrder} sx={{ mt: 2 }}>
          Submit Order
        </Button>
      )}
    </Box>
  );
};

export default CartPage;
