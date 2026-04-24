import { createRoleAuthService } from "@/services/core/mock-auth";
import type { AuthUser, CreateAdminData, LoginCredentials } from "@/types/auth";

export type User = AuthUser;
export type { LoginCredentials, CreateAdminData };

const baseService = createRoleAuthService<User>({
  role: "ADMIN",
  slot: "admin",
  tokenKey: "admin_token",
  refreshTokenKey: "admin_refresh_token",
  userKey: "admin",
  fallbackName: "Scory Admin",
});

class AdminAuthService {
  async createAdmin(data: CreateAdminData): Promise<{ user: User }> {
    const result = await baseService.register(data);
    return { user: result.user };
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

export const adminAuthService = new AdminAuthService();
