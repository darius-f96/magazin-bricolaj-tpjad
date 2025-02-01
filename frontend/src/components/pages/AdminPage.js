import React, {useState} from "react";
import {
    Box,
    Typography,
    Tab, Tabs,
} from "@mui/material";
import Layout from '../Layout';
import ProductsPanel from "../ProductsPanel";
import OrdersPanel from "../OrdersPanel";

const AdminPage = () => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Layout>
            <Box p={3}>
                <Typography variant="h4" mb={2}>
                    Admin Dashboard
                </Typography>
                <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
                    <Tab label="Products"/>
                    <Tab label="Orders"/>
                </Tabs>
                <Box mt={3}>
                    {tabIndex === 0 && <ProductsPanel/>}
                    {tabIndex === 1 && <OrdersPanel/>}
                </Box>

            </Box>
        </Layout>
    );
};

export default AdminPage;
