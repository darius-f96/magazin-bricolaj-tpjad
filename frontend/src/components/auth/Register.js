import React, {useState} from 'react';
import {Button, TextField, Typography, Box, Container} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {register} from '../../api/authApi';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        const newUser = {
            name,
            username,
            email,
            password,
            role: 'ROLE_USER', // Default role set to ROLE_USER
            orders: [],
        };

        try {
            await register(newUser); // Send request to backend to register
            alert('Registration successful! You can now log in.');
            navigate('/login'); // Redirect back to login page
        } catch (error) {
            setError('Failed to register');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4}}>
                <Typography variant="h5" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <Typography color="error">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{mt: 2}}>
                        Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Register;
