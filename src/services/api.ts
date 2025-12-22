import axios from 'axios';

// Base URL configuration - Read from environment variable
const API_URL = process.env.NEXT_PUBLIC_API;

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Increased timeout for job polling endpoints
    // Job creation and status polling should not timeout - backend handles the actual timeout
    // Only applies to network connection timeout, not job processing time
    timeout: 120000, // 120 seconds for long-running AI jobs
});

// Request interceptor - Auto-attach JWT token with automatic refresh
api.interceptors.request.use(
    async (config) => {
        try {
            // Get token from localStorage (for web/Next.js)
            // Use 'token' key to match auth.service.ts
            const token = localStorage.getItem('token');

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            // Silent error
            console.error('Error attaching token:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors & expired tokens
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (token expired/invalid)
        if (error.response?.status === 401 && !originalRequest._retry) {

            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refresh_token');

                if (!refreshToken) {
                    // No refresh token, silently clear and reject
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    processQueue(new Error('Session expired'));
                    return Promise.reject(error);
                }

                const response = await axios.post(`${API_URL}/auth/refresh`, {
                    refresh_token: refreshToken
                });

                const { token, refresh_token: newRefreshToken } = response.data.data;

                // Store new tokens (use 'token' key to match auth.service.ts)
                localStorage.setItem('token', token);
                if (newRefreshToken) {
                    localStorage.setItem('refresh_token', newRefreshToken);
                }

                // Refresh successful, retry original request
                originalRequest.headers.Authorization = `Bearer ${token}`;
                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');

                processQueue(refreshError);

                // Don't redirect - let the component handle the error with toast
                // Components can check authService.isAuthenticated() and show appropriate message

                return Promise.reject(error); // Return original error, not refresh error
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
export { API_URL };
