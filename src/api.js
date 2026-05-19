import axios from "axios";

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("authToken") || window.localStorage.getItem("token") || null;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
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
