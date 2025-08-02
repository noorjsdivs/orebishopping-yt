import axios from "axios";
import { serverUrl } from "../../config";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: serverUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication service
export const authService = {
  // Admin login
  adminLogin: async (credentials) => {
    const response = await api.post("/api/user/admin", credentials);
    return response.data;
  },

  // User login
  userLogin: async (credentials) => {
    const response = await api.post("/api/user/login", credentials);
    return response.data;
  },

  // User registration
  userRegister: async (userData) => {
    const response = await api.post("/api/user/register", userData);
    return response.data;
  },

  // Get user profile (if needed)
  getUserProfile: async () => {
    const response = await api.get("/api/user/profile");
    return response.data;
  },
};

export default authService;
