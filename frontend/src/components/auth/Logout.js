import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/authApi";
import { Box, Button } from "@mui/material";

const Logout = () => {
  const { logout: doLogout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();
      doLogout(response.data);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <form onSubmit={handleSubmit}>
        <Button type="submit" variant="contained" fullWidth>
          Logout
        </Button>
      </form>
    </Box>
  );
};

export default Logout;
