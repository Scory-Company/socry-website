import api from './api';

// User type from backend (Reviewer)
export interface User {
    id: string;
    email: string;
    fullName: string;
    nickname: string | null;
    avatarUrl: string | null;
    authProvider: string;
    role: string;
    isVerified: boolean;
}

// Backend response type
interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        reviewer: User;
        token: string;
        refreshToken?: string;
    };
}

// Login credentials
export interface LoginCredentials {
    email: string;
    password: string;
}

// Register data
export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
    nickname?: string;
}

/**
 * Reviewer Authentication Service Class
 * For reviewer users only
 */
class ReviewerAuthService {
    /**
     * Register as reviewer (Public - requires admin approval)
     */
    async register(data: RegisterData): Promise<{ user: User }> {
        try {
            const response = await api.post<{ success: boolean; message: string; data: { reviewer: User } }>('/reviewer/auth/register', {
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                nickname: data.nickname,
            });

            if (response.data.success) {
                return { user: response.data.data.reviewer };
            }

            throw new Error('Unable to register. Please try again.');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Unable to register. Please try again.';
            throw new Error(errorMessage);
        }
    }

    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        try {
            const response = await api.post<AuthResponse>('/reviewer/auth/login', {
                email: credentials.email,
                password: credentials.password,
            });

            if (response.data.success) {
                // Save token and user data
                const authData = {
                    user: response.data.data.reviewer,
                    token: response.data.data.token,
                    refreshToken: response.data.data.refreshToken
                };
                this.storeAuthData(authData);
                return authData;
            }

            throw new Error('Unable to sign in. Please check your credentials.');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Unable to sign in. Please check your credentials.';
            throw new Error(errorMessage);
        }
    }

    /**
     * Logout user (call backend to delete session)
     */
    async logout(): Promise<void> {
        try {
            // Call backend to delete session
            await api.post('/reviewer/auth/logout');
        } catch (error) {
            // Continue anyway to clear local data
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            this.clearAuthData();

            // Don't redirect - let the component handle navigation
            // Components should show toast and redirect as needed
        }
    }

    /**
     * Get user profile from backend (Me)
     */
    async getProfile(): Promise<User | null> {
        try {
            const response = await api.get<{ success: boolean; data: { reviewer: User } }>('/reviewer/auth/me');

            if (response.data.success) {
                // Update stored user data
                localStorage.setItem('reviewer', JSON.stringify(response.data.data.reviewer));
                return response.data.data.reviewer;
            }

            return null;
        } catch (error) {
            console.error('Get profile error:', error);
            return null;
        }
    }

    /**
     * Check if user has valid session (token exists and valid)
     */
    async checkSession(): Promise<boolean> {
        try {
            const token = localStorage.getItem('reviewer_token');

            if (!token) {
                return false;
            }

            // Validate token by fetching profile
            const profile = await this.getProfile();

            if (profile) {
                // Token valid, user data already updated in getProfile
                return true;
            }

            // Token invalid, clear storage
            this.clearAuthData();
            return false;
        } catch (error) {
            // Network error or other issues, assume invalid
            console.error('Check session error:', error);
            return false;
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('reviewer_token');
    }

    /**
     * Get stored user data
     */
    getStoredUser(): User | null {
        try {
            const userStr = localStorage.getItem('reviewer');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing stored user:', error);
            return null;
        }
    }

    /**
     * Store authentication data
     */
    private storeAuthData(data: { user: User; token: string; refreshToken?: string }): void {
        localStorage.setItem('reviewer_token', data.token);

        if (data.refreshToken) {
            localStorage.setItem('reviewer_refresh_token', data.refreshToken);
        }

        localStorage.setItem('reviewer', JSON.stringify(data.user));
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem('reviewer_token');
        localStorage.removeItem('reviewer_refresh_token');
        localStorage.removeItem('reviewer');
    }
}

export const reviewerAuthService = new ReviewerAuthService();
