import React, {createContext, useState, useEffect, useCallback, useContext} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!accessToken);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);


    const BASE_URL = "http://localhost:8080/api";
    const REFRESH_ENDPOINT = `${BASE_URL}/refresh`;
    const LOGIN_PAGE = "/login";

    const saveTokens = (newAccessToken, newRefreshToken = null) => {
        setAccessToken(newAccessToken);
        localStorage.setItem('accessToken', newAccessToken);

        if (newRefreshToken) {
            setRefreshToken(newRefreshToken);
            localStorage.setItem('refreshToken', newRefreshToken);
        }

        try {
            const decodedToken = jwtDecode(newAccessToken);

            setUser({
                username: decodedToken.sub, // Extragem username-ul din `sub`
                role: decodedToken.role,   // Extragem rolul din `role`
            });
        } catch (error) {
            console.error("Error decoding token:", error);
            setUser(null);
        }
    };

    const clearTokens = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const isTokenExpiring = (token) => {
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
            const tokenExpTime = decodedToken.exp; // "Expiration Time" timestamp in the payload
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return tokenExpTime - currentTime <= 60; // Check if token will expire in a minute
        } catch (error) {
            console.error("Error decoding token:", error);
            return true; // If decoding fails, assume token is invalid
        }
    };

    const refreshAuthToken = useCallback(async () => {
        try {
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const response = await axios.post(REFRESH_ENDPOINT, {refreshToken}, {
                headers: {"Content-Type": "application/json"},
            });

            const {accessToken: newAccessToken, refreshToken: newRefreshToken} = response.data; // Adapt to your API response
            saveTokens(newAccessToken, newRefreshToken); // Save new tokens
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Failed to refresh token:", error);
            clearTokens(); // Clear tokens if refreshing fails
            navigate(LOGIN_PAGE); // Redirect to login
        }
    }, [refreshToken, navigate]);

    const handleTokenExpiry = useCallback(async () => {
        if (accessToken && isTokenExpiring(accessToken)) {
            await refreshAuthToken(); // Refresh token if expiring
        }
    }, [accessToken, refreshAuthToken]);

    useEffect(() => {
        const intervalId = setInterval(handleTokenExpiry, 30 * 1000); // Check every 30 seconds
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [handleTokenExpiry]);

    const login = ({accessToken, refreshToken}) => {
        saveTokens(accessToken, refreshToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        clearTokens();
        navigate(LOGIN_PAGE);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                isAuthenticated,
                user,
                login,
                logout,
                refreshAuthToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
