import axios from "axios";
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Send cookies with requests
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't run refresh logic for login, register, or refresh endpoints
    const isAuthEndpoint =
      originalRequest.url.includes("/api/auth/signin") ||
      originalRequest.url.includes("/api/auth/signup") ||
      originalRequest.url.includes("/api/auth/refresh-access-token");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      try {
        await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-access-token`, {
          withCredentials: true
        });
        return api(originalRequest);
      } catch (refreshError) {
        const path = window.location.pathname;
        if (
          !path.startsWith('/login') &&
          !path.startsWith('/register') &&
          !path.startsWith('/forgot-password')
        ) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 