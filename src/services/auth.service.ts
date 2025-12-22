import api from './api';

// User type from backend
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
        user: User;
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

// Profile update data
export interface ProfileUpdateData {
    fullName?: string;
    nickname?: string;
    avatarUrl?: string;
}

/**
 * Authentication Service Class
 */
class AuthService {
    /**
     * Register with email and password
     */
    async register(data: RegisterData): Promise<{ user: User; token: string }> {
        try {
            const response = await api.post<AuthResponse>('/auth/register', {
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                nickname: data.nickname,
            });

            if (response.data.success) {
                // Save token and user data
                this.storeAuthData(response.data.data);
                return response.data.data;
            }

            throw new Error('Unable to create account. Please try again.');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Unable to create account. Please try again.';
            throw new Error(errorMessage);
        }
    }

    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        try {
            const response = await api.post<AuthResponse>('/auth/login', {
                email: credentials.email,
                password: credentials.password,
            });

            if (response.data.success) {
                // Save token and user data
                this.storeAuthData(response.data.data);
                return response.data.data;
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
            await api.post('/auth/logout');
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
     * Get user profile from backend
     */
    async getProfile(): Promise<User | null> {
        try {
            const response = await api.get<{ success: boolean; data: User }>('/profile');

            if (response.data.success) {
                // Update stored user data
                localStorage.setItem('user', JSON.stringify(response.data.data));
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error('Get profile error:', error);
            return null;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData: ProfileUpdateData): Promise<User | null> {
        try {
            // Only send fields that have values (remove empty strings)
            const payload: any = {};

            if (profileData.fullName?.trim()) {
                payload.fullName = profileData.fullName.trim();
            }

            if (profileData.nickname?.trim()) {
                payload.nickname = profileData.nickname.trim();
            }

            if (profileData.avatarUrl?.trim()) {
                payload.avatarUrl = profileData.avatarUrl.trim();
            }

            const response = await api.patch<{ success: boolean; message: string; data: User }>(
                '/profile',
                payload
            );

            if (response.data.success) {
                // Update stored user data
                localStorage.setItem('user', JSON.stringify(response.data.data));
                return response.data.data;
            }

            return null;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Unable to update profile. Please try again.';
            throw new Error(errorMessage);
        }
    }

    /**
     * Check if user has valid session (token exists and valid)
     */
    async checkSession(): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');

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
        return !!localStorage.getItem('token');
    }

    /**
     * Get stored user data
     */
    getStoredUser(): User | null {
        try {
            const userStr = localStorage.getItem('user');
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
        localStorage.setItem('token', data.token);

        if (data.refreshToken) {
            localStorage.setItem('refresh_token', data.refreshToken);
        }

        localStorage.setItem('user', JSON.stringify(data.user));
    }

    /**
     * Clear authentication data
     */
    private clearAuthData(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
}

export const authService = new AuthService();
