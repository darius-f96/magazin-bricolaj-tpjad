import React, { useEffect, useState } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await SpringBootDataRequest("/orders", "GET", navigate);
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      {orders.map((order) => (
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
      ))}
    </Box>
  );
};

export default OrdersPage;
