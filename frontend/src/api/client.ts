import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const client = axios.create({
  // Empty in production (same-origin /api); override via VITE_API_URL for local Go server
  baseURL:
    import.meta.env.VITE_API_URL ??
    (import.meta.env.DEV ? "http://localhost:4000" : ""),
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

// Attach JWT to every request automatically
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, clear auth and redirect to home
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

export default client;
