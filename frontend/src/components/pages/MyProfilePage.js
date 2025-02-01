import React, { useState, useEffect } from "react";
import { TextField, Box, Typography, Button, Card, Grid } from "@mui/material";
import Layout from "../Layout";
import { useSpringBootRequest } from "../../utils/apiUtils";
import { useNavigate } from "react-router-dom";

const MyProfilePage = () => {
    const navigate = useNavigate();
    const SpringBootDataRequest = useSpringBootRequest();

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        deliveryDetails: [],
    });

    const [newDeliveryDetail, setNewDeliveryDetail] = useState({
        addressLine1: "",
        addressLine2: "",
        city: "",
        county: "",
        country: "",
        phoneNumber: "",
        postalCode: "",
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const profileData = await SpringBootDataRequest("/profile", "GET", null, navigate);
            setProfile(profileData);
        } catch (err) {
            setError("Error fetching profile data.");
        }
    };

    const handleDeliveryDetailChange = (index, field, value) => {
        const updatedDetails = [...profile.deliveryDetails];
        updatedDetails[index][field] = value;
        setProfile({ ...profile, deliveryDetails: updatedDetails });
    };

    const handleDeliveryDetailUpdate = async (index) => {
        try {
            const deliveryDetail = profile.deliveryDetails[index];
            await SpringBootDataRequest(`/profile/deliveryDetails/${deliveryDetail.id}`, "PUT", deliveryDetail, navigate);
            alert("Delivery detail updated successfully.");
        } catch (err) {
            setError("Error updating delivery detail.");
        }
    };

    const handleDeliveryDetailDelete = async (index) => {
        try {
            const deliveryDetail = profile.deliveryDetails[index];
            await SpringBootDataRequest(`/profile/deliveryDetails/${deliveryDetail.id}`, "DELETE", null, navigate);
            const updatedDetails = profile.deliveryDetails.filter((_, i) => i !== index);
            setProfile({ ...profile, deliveryDetails: updatedDetails });
            alert("Delivery detail deleted successfully.");
        } catch (err) {
            setError("Error deleting delivery detail.");
        }
    };

    const handleNewDeliveryDetailSubmit = async () => {
        try {
            const createdDetail = await SpringBootDataRequest(
                "/profile/deliveryDetails/create",
                "POST",
                newDeliveryDetail,
                navigate
            );
            setProfile({
                ...profile,
                deliveryDetails: [...profile.deliveryDetails, createdDetail],
            });
            setNewDeliveryDetail({
                addressLine1: "",
                addressLine2: "",
                city: "",
                county: "",
                country: "",
                phoneNumber: "",
                postalCode: "",
            });
            alert("New delivery detail added successfully.");
        } catch (err) {
            setError("Error adding new delivery detail.");
        }
    };

    return (
        <Layout>
            <Box sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <Box mb={4}>
                    <Typography variant="h6">Profile Information</Typography>
                    <form>
                        <TextField
                            label="Name"
                            disabled={true}
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            fullWidth
                            size="small"
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            value={profile.email}
                            disabled={true}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            fullWidth
                            size="small"
                            margin="normal"
                        />
                    </form>
                </Box>

                <Box mb={4}>
                    <Typography variant="h6">Delivery Details</Typography>
                    {profile.deliveryDetails.map((detail, index) => (
                        <Card key={index} sx={{ padding: 2, marginBottom: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Address Line 1"
                                        value={detail.addressLine1}
                                        onChange={(e) =>
                                            handleDeliveryDetailChange(index, "addressLine1", e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Address Line 2"
                                        value={detail.addressLine2}
                                        onChange={(e) =>
                                            handleDeliveryDetailChange(index, "addressLine2", e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="City"
                                        value={detail.city}
                                        onChange={(e) => handleDeliveryDetailChange(index, "city", e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="County"
                                        value={detail.county}
                                        onChange={(e) => handleDeliveryDetailChange(index, "county", e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="Country"
                                        value={detail.country}
                                        onChange={(e) => handleDeliveryDetailChange(index, "country", e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="Phone Number"
                                        value={detail.phoneNumber}
                                        onChange={(e) =>
                                            handleDeliveryDetailChange(index, "phoneNumber", e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <TextField
                                        label="Postal Code"
                                        value={detail.postalCode}
                                        onChange={(e) =>
                                            handleDeliveryDetailChange(index, "postalCode", e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleDeliveryDetailUpdate(index)}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleDeliveryDetailDelete(index)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    ))}
                </Box>

                <Box mb={4}>
                    <Typography variant="h6">Add New Delivery Detail</Typography>
                    <form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address Line 1"
                                    value={newDeliveryDetail.addressLine1}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, addressLine1: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Address Line 2"
                                    value={newDeliveryDetail.addressLine2}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, addressLine2: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="City"
                                    value={newDeliveryDetail.city}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, city: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="County"
                                    value={newDeliveryDetail.county}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, county: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="Country"
                                    value={newDeliveryDetail.country}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, country: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="Phone Number"
                                    value={newDeliveryDetail.phoneNumber}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, phoneNumber: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <TextField
                                    label="Postal Code"
                                    value={newDeliveryDetail.postalCode}
                                    onChange={(e) =>
                                        setNewDeliveryDetail({ ...newDeliveryDetail, postalCode: e.target.value })
                                    }
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNewDeliveryDetailSubmit}
                                >
                                    Add New
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </Layout>
    );
};

export default MyProfilePage;