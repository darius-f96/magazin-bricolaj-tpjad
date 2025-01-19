import React, { useEffect, useState } from "react";
import { SpringBootDataRequest } from "../../utils/apiUtils";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await SpringBootDataRequest("/products", "GET", navigate);
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId) => {
    await SpringBootDataRequest("/cart/add", "POST", { productId }, navigate);
    alert("Product added to cart!");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>${product.price.toFixed(2)}</Typography>
                <Typography variant="body2">{product.description}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addToCart(product.id)}
                  sx={{ mt: 2 }}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
