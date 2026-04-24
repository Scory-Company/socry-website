import { createRoleAuthService } from "@/services/core/mock-auth";
import type { AuthUser, LoginCredentials, ProfileUpdateData, RegisterData } from "@/types/auth";

export type User = AuthUser;
export type { LoginCredentials, RegisterData, ProfileUpdateData };

const baseService = createRoleAuthService<User>({
  role: "CLIENT",
  slot: "client",
  tokenKey: "token",
  refreshTokenKey: "refresh_token",
  userKey: "user",
  fallbackName: "Scory Reader",
});

class ClientAuthService {
  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    return baseService.register(data);
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    return baseService.login(credentials.email);
  }

  async logout(): Promise<void> {
    return baseService.logout();
  }

  async getProfile(): Promise<User | null> {
    return baseService.getProfile();
  }

  async updateProfile(profileData: ProfileUpdateData): Promise<User | null> {
    return baseService.updateProfile(profileData);
  }

  async checkSession(): Promise<boolean> {
    return baseService.checkSession();
  }

  isAuthenticated(): boolean {
    return baseService.isAuthenticated();
  }

  getStoredUser(): User | null {
    return baseService.getStoredUser();
  }
}

export const clientAuthService = new ClientAuthService();
