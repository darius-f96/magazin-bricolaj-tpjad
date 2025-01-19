import React, { useEffect, useState, useCallback } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await SpringBootDataRequest("/orders", "GET", null, navigate);
      setOrders(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {isLoading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div>Error fetching orders: {error.message}</div>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <Accordion key={order.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Order ID: {order.id} - Total: ${order.total.toFixed(2)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {order.items.map((item) => (
                <Box key={item.product.id} sx={{ mb: 2 }}>
                  <Typography>Product: {item.product.name}</Typography>
                  <Typography>Quantity: {item.quantity}</Typography>
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <div>No orders found.</div>
      )}
    </Box>
  );
};

export default OrdersPage;