import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.NODE_DEV === "development" ? "http://localhost:8000/api" : "/api",
  withCredentials: true,
});