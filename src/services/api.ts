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
            // Check route type
            const isAdminRoute = config.url?.startsWith('/admin');
            const isReviewerRoute = config.url?.startsWith('/reviewer');

            // Get appropriate token from localStorage
            let token;
            if (isAdminRoute) {
                token = localStorage.getItem('admin_token');
            } else if (isReviewerRoute) {
                token = localStorage.getItem('reviewer_token');
            } else {
                token = localStorage.getItem('token');
            }

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
                // Check route type
                const isAdminRoute = originalRequest.url?.startsWith('/admin');
                const isReviewerRoute = originalRequest.url?.startsWith('/reviewer');

                // Try to refresh token
                let refreshToken;
                if (isAdminRoute) {
                    refreshToken = localStorage.getItem('admin_refresh_token');
                } else if (isReviewerRoute) {
                    refreshToken = localStorage.getItem('reviewer_refresh_token');
                } else {
                    refreshToken = localStorage.getItem('refresh_token');
                }

                if (!refreshToken) {
                    // No refresh token, silently clear and reject
                    if (isAdminRoute) {
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_refresh_token');
                        localStorage.removeItem('admin');
                    } else if (isReviewerRoute) {
                        localStorage.removeItem('reviewer_token');
                        localStorage.removeItem('reviewer_refresh_token');
                        localStorage.removeItem('reviewer');
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('refresh_token');
                        localStorage.removeItem('user');
                    }
                    processQueue(new Error('Session expired'));
                    return Promise.reject(error);
                }

                const refreshEndpoint = isAdminRoute
                    ? '/admin/auth/refresh'
                    : isReviewerRoute
                        ? '/reviewer/auth/refresh'
                        : '/auth/refresh';
                const response = await axios.post(`${API_URL}${refreshEndpoint}`, {
                    refresh_token: refreshToken
                });

                const { token, refresh_token: newRefreshToken } = response.data.data;

                // Store new tokens
                if (isAdminRoute) {
                    localStorage.setItem('admin_token', token);
                    if (newRefreshToken) {
                        localStorage.setItem('admin_refresh_token', newRefreshToken);
                    }
                } else if (isReviewerRoute) {
                    localStorage.setItem('reviewer_token', token);
                    if (newRefreshToken) {
                        localStorage.setItem('reviewer_refresh_token', newRefreshToken);
                    }
                } else {
                    localStorage.setItem('token', token);
                    if (newRefreshToken) {
                        localStorage.setItem('refresh_token', newRefreshToken);
                    }
                }

                // Refresh successful, retry original request
                originalRequest.headers.Authorization = `Bearer ${token}`;
                processQueue();
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens
                const isAdminRoute = originalRequest.url?.startsWith('/admin');
                const isReviewerRoute = originalRequest.url?.startsWith('/reviewer');

                if (isAdminRoute) {
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_refresh_token');
                    localStorage.removeItem('admin');
                } else if (isReviewerRoute) {
                    localStorage.removeItem('reviewer_token');
                    localStorage.removeItem('reviewer_refresh_token');
                    localStorage.removeItem('reviewer');
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                }

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
