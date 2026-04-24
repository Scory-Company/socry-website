import { createRoleAuthService } from "@/services/core/mock-auth";
import type { AuthUser, LoginCredentials, RegisterData } from "@/types/auth";

export type User = AuthUser;
export type { LoginCredentials, RegisterData };

const baseService = createRoleAuthService<User>({
  role: "REVIEWER",
  slot: "reviewer",
  tokenKey: "reviewer_token",
  refreshTokenKey: "reviewer_refresh_token",
  userKey: "reviewer",
  fallbackName: "Scory Reviewer",
});

class ReviewerAuthService {
  async register(data: RegisterData): Promise<{ user: User }> {
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

export const reviewerAuthService = new ReviewerAuthService();
