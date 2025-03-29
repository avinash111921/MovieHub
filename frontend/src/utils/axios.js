import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

export const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token from localStorage if it exists
const token = localStorage.getItem("token");
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}
