import axios from "axios";

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem("authToken") || null;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
