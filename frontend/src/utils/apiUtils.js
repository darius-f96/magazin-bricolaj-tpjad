import axios from "axios";
import { useAuth } from "../components/context/AuthContext";

const API_BASE_URL = "http://localhost:8080/api";


export const SpringBootDataRequest = async (
  endpoint,
  method,
  data = null,
  navigate
) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    navigate("/login");
    return null;
  }

  try {
    const response = await axios({
      url: `${API_BASE_URL}${endpoint}`,
      method,
      data,
      headers: { 'Content-Type': 'application/json',
        "Authorization" : `Bearer ${token}`}
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      navigate("/login");
    } else {
      console.error("API Error:", error);
    }
    throw error;
  }
};
