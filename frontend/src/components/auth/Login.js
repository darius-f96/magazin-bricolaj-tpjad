import React, {useState} from "react";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {login} from "../../api/authApi";
import {Box, TextField, Button, Typography} from "@mui/material";
import Logout from "./Logout";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const {login: doLogin} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            doLogin(response.data);
            navigate("/products");
        } catch (error) {
            console.error("Login failed");
            setError('Invalid username or password');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <Box sx={{maxWidth: 400, mx: "auto", mt: 4}}>
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" fullWidth>
                    Login
                </Button>
            </form>
            <Button
                onClick={handleRegisterRedirect}
                variant="contained"
                fullWidth
                sx={{mt: 2}}
            >
                Register
            </Button>
            <Logout/>
        </Box>
    );
};

export default Login;
