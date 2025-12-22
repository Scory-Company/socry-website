import api from './api';

// Google OAuth Configuration for Web
const GOOGLE_CONFIG = {
    clientId: '302081173028-tb9ekj8f1er45vmgehre61mvjk48hi2o.apps.googleusercontent.com',
};

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

/**
 * Google Sign In for Web using Google Identity Services
 * This uses the new Google Identity Services (GIS) library
 */
class GoogleAuthService {
    private googleLoaded = false;

    /**
     * Load Google Identity Services script
     */
    async loadGoogleScript(): Promise<void> {
        if (this.googleLoaded) return;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                this.googleLoaded = true;
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Google script'));
            document.head.appendChild(script);
        });
    }

    /**
     * Sign in with Google (Popup method)
     */
    async signInWithGoogle(): Promise<{ user: User; token: string }> {
        try {
            // Load Google script if not loaded
            await this.loadGoogleScript();

            // Get ID token from Google
            const idToken = await this.getGoogleIdToken();

            // Send idToken to backend
            const { data } = await api.post<AuthResponse>('/auth/google', {
                idToken,
            });

            if (data.success) {
                // Save token and user data
                localStorage.setItem('token', data.data.token);
                if (data.data.refreshToken) {
                    localStorage.setItem('refresh_token', data.data.refreshToken);
                }
                localStorage.setItem('user', JSON.stringify(data.data.user));

                return data.data;
            }

            throw new Error('Unable to sign in with Google. Please try again.');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Unable to sign in with Google. Please try again.';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get Google ID Token using One Tap or Popup
     */
    private getGoogleIdToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.google) {
                reject(new Error('Google Sign In not available'));
                return;
            }

            // Initialize Google Sign In
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CONFIG.clientId,
                callback: (response: any) => {
                    if (response.credential) {
                        resolve(response.credential);
                    } else {
                        reject(new Error('No credential received from Google'));
                    }
                },
            });

            // Show One Tap prompt
            window.google.accounts.id.prompt((notification: any) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                    // One Tap not shown, fallback to popup
                    this.showGooglePopup().then(resolve).catch(reject);
                }
            });
        });
    }

    /**
     * Show Google Sign In Popup (fallback method)
     */
    private showGooglePopup(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined' || !window.google) {
                reject(new Error('Google Sign In not available'));
                return;
            }

            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CONFIG.clientId,
                scope: 'email profile',
                callback: (response: any) => {
                    if (response.access_token) {
                        // For OAuth2, we need to exchange access_token for user info
                        // But for our backend, we need ID token
                        // So we'll use the ID initialize method instead
                        reject(new Error('Please use the One Tap method'));
                    } else {
                        reject(new Error('No token received from Google'));
                    }
                },
            });

            client.requestAccessToken();
        });
    }

    /**
     * Render Google Sign In Button
     * Call this in a React component to render the button
     */
    renderGoogleButton(elementId: string, onSuccess: (response: any) => void, onError: (error: Error) => void): void {
        if (typeof window === 'undefined' || !window.google) {
            console.error('Google Sign In not available');
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CONFIG.clientId,
            callback: async (response: any) => {
                try {
                    if (response.credential) {
                        // Send credential (ID token) to backend
                        const { data } = await api.post<AuthResponse>('/auth/google', {
                            idToken: response.credential,
                        });

                        if (data.success) {
                            // Save token and user data
                            localStorage.setItem('token', data.data.token);
                            if (data.data.refreshToken) {
                                localStorage.setItem('refresh_token', data.data.refreshToken);
                            }
                            localStorage.setItem('user', JSON.stringify(data.data.user));

                            onSuccess(data.data);
                        } else {
                            onError(new Error('Unable to sign in with Google'));
                        }
                    } else {
                        onError(new Error('No credential received from Google'));
                    }
                } catch (error: any) {
                    onError(error);
                }
            },
        });

        // Render the button
        window.google.accounts.id.renderButton(
            document.getElementById(elementId)!,
            {
                theme: 'outline',
                size: 'large',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left',
            }
        );
    }
}

// Export singleton instance
export const googleAuthService = new GoogleAuthService();

// Type declarations for Google Identity Services
declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: any) => void;
                    prompt: (callback?: (notification: any) => void) => void;
                    renderButton: (parent: HTMLElement, options: any) => void;
                    disableAutoSelect: () => void;
                    revoke: (email: string, callback: () => void) => void;
                };
                oauth2: {
                    initTokenClient: (config: any) => any;
                };
            };
        };
    }
}
