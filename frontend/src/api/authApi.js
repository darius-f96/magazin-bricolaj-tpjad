import axios from "axios";
import { SpringBootDataRequest } from "../utils/apiUtils";

const API_URL = "http://localhost:8080/api/auth";

export const login = (username, password) => {
  return axios.post(`${API_URL}/login`, { username, password });
};

export const register = (username, password) => {
  return axios.post(`${API_URL}/register`, { username, password });
};

export const logout = () => {
  const token = localStorage.getItem("accessToken");
  return axios({
    url: `${API_URL}/logout`,
    method: "POST",
    headers: { 'Content-Type': 'application/json',
      "Authorization" : `Bearer ${token}`}
  });
};
