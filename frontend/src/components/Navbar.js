import React from 'react';
import {Button, AppBar, Toolbar, Typography, IconButton} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import {useAuth} from './context/AuthContext';

const Navbar = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{flexGrow: 1}}>
                    Bricolaj TPJAD
                </Typography>
                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                    <ShoppingCartIcon/>
                </IconButton>
                <Button
                    color="inherit"
                    onClick={() => navigate('/products')}
                    sx={{ mr: 2 }}
                >
                    Products
                </Button>
                <Button
                    color="inherit"
                    startIcon={<ListAltIcon/>}
                    onClick={() => navigate('/orders')}
                    sx={{mr: 2}}
                >
                    Orders
                </Button>
                <Button
                    color="inherit"
                    startIcon={<ListAltIcon/>}
                    onClick={() => navigate('/profile')}
                    sx={{mr: 2}}
                >
                    My Profile
                </Button>
                {user?.role?.includes("ROLE_ADMIN") && (
                    <Button
                        color="inherit"
                        startIcon={<AdminPanelSettingsIcon/>}
                        onClick={() => navigate('/admin')}
                        sx={{mr: 2}}
                    >
                        Admin
                    </Button>
                )}
                {user && (
                    <Button color="inherit" onClick={logout}>
                        Logout
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
