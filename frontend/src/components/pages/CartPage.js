import React, {useEffect, useState, useCallback} from "react";
import {useSpringBootRequest} from "../../utils/apiUtils";
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Modal,
    FormControl,
    RadioGroup,
    FormControlLabel, Card, Radio
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Layout from '../Layout';

const CartPage = () => {
    const [cart, setCart] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();
    const [selectedAddress, setSelectedAddress] = useState(null);

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

    useEffect(() => {
        if (isModalOpen) {
            fetchDeliveryDetails();
        }
    }, [isModalOpen]);

    const fetchDeliveryDetails = async () => {
        try {
            setLoading(true);
            const details = await SpringBootDataRequest("/profile/deliveryDetails", "GET", null, navigate);
            setDeliveryDetails(details);
        } catch (err) {
            setError("Error fetching delivery details.");
        } finally {
            setLoading(false);
        }
    };



    const removeFromCart = async (productId) => {
        await SpringBootDataRequest(`/cart/removeItem?productId=${productId}`, "DELETE", null, navigate);
        const data = await SpringBootDataRequest("/cart", "GET", null, navigate);
        setCart(data);
    };

    const submitOrder = async () => {
        if (selectedAddress == null) {
            alert("Please select a delivery address.");
            return;
        }

        const selectedDeliveryDetail = deliveryDetails[selectedAddress];

        const deliveryDetailId = selectedDeliveryDetail.id;

        setIsModalOpen(false);
        await SpringBootDataRequest("/cart/submit", "POST", {deliveryDetailsId: deliveryDetailId}, navigate);
        alert("Order placed successfully!");
        fetchCart();
    };

    const handleSubmitOrder = () => {
        setIsModalOpen(true);
    };

    const handleSelectAddress = (index) => {
        setSelectedAddress(index);
    };


    return (
        <Layout>
            <Box sx={{p: 4}}>
                <Typography variant="h4" gutterBottom>
                    My Cart
                </Typography>
                {isLoading ? (
                    <div>Loading cart...</div>
                ) : error ? (
                    <div>Error fetching cart: {error.message}</div>
                ) : cart.products?.length > 0 ? (
                    <List>
                        {cart.products.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`Quantity: ${item.quantity}`}
                                />
                                <ListItemText
                                    primary={item.price}
                                    secondary={`Total price: ${item.price * item.quantity}`}
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
                    <Button variant="contained" color="primary" onClick={handleSubmitOrder} sx={{mt: 2}}>
                        Submit Order
                    </Button>
                )}
            </Box>
            {/* Modal for Delivery Address Selection */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="delivery-modal-title"
                aria-describedby="delivery-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: "8px",
                    }}
                >
                    <Typography id="delivery-modal-title" variant="h6" mb={2}>
                        Select Delivery Address
                    </Typography>

                    {loading && <Typography>Loading...</Typography>}
                    {error && <Typography color="error">{error}</Typography>}

                    {!loading && deliveryDetails.length === 0 && (
                        <Box textAlign="center">
                            <Typography>No delivery addresses available.</Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate("/profile")}
                                sx={{ mt: 2 }}
                            >
                                Create Delivery Detail
                            </Button>
                        </Box>
                    )}

                    {!loading && deliveryDetails.length > 0 && (
                        <FormControl component="fieldset">
                            <RadioGroup
                                value={selectedAddress}
                                onChange={(e) => handleSelectAddress(parseInt(e.target.value, 10))}
                            >
                                {deliveryDetails.map((detail, index) => (
                                    <Card key={index} sx={{ padding: 2, marginBottom: 2 }} variant="outlined">
                                        <FormControlLabel
                                            value={index}
                                            control={<Radio />}
                                            label={
                                                <Box>
                                                    <Typography>
                                                        {detail.addressLine1}, {detail.addressLine2}
                                                    </Typography>
                                                    <Typography variant="caption">{detail.city}</Typography>
                                                </Box>
                                            }
                                        />
                                    </Card>
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}

                    {deliveryDetails.length > 0 && (
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={submitOrder}
                            >
                                Confirm
                            </Button>
                        </Box>
                    )}
                </Box>
            </Modal>
        </Layout>
    );
};

export default CartPage;