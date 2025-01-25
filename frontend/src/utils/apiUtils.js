import axios from 'axios';
import {toast} from 'react-toastify';
import {AuthContext} from '../components/context/AuthContext';
import {useContext} from "react";


const API_BASE_URL = "http://localhost:8080/api";

export const useSpringBootRequest = () => {
  const {accessToken, logout} = useContext(AuthContext);

  return async (
      endpoint,
      method,
      data = null,
      navigate
  ) => {
    if (!accessToken) {
      toast.error('You are not authenticated. Redirecting to login...');
      navigate('/login');
      return null;
    }

    try {
      const response = await axios({
        url: `${API_BASE_URL}${endpoint}`,
        method,
        data,
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Session expired. Please log in again.');
        logout();
        navigate('/login');
      } else if (error.response) {
        toast.error( `Error: ${error.response?.data?.message || error.response?.data || 'An error occurred.'}`);
      } else {
        toast.error('Network error. Please try again.');
      }
      return null;
    }
  };
}
