import { clientAuthService } from "./clientAuth.service";

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

class GoogleAuthService {
  async loadGoogleScript(): Promise<void> {
    return Promise.resolve();
  }

  async signInWithGoogle(): Promise<{ user: User; token: string }> {
    return clientAuthService.login({
      email: "mock.google@scory.app",
      password: "mock-google-sign-in",
    });
  }

  renderGoogleButton(_elementId: string, onSuccess: (response: any) => void, _onError: (error: Error) => void): void {
    void this.signInWithGoogle().then(onSuccess);
  }
}

export const googleAuthService = new GoogleAuthService();
