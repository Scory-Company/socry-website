import {
  createMockUser,
  getStoredAuthState,
  mockDelay,
  saveStoredAuthState,
  type MockAuthUser,
  type StoredAuthState,
} from "@/mocks/scory";
import type { AuthUser, ProfileUpdateData, RegisterData } from "@/types/auth";

type AuthSlot = keyof StoredAuthState;

type AuthStorageConfig = {
  role: "ADMIN" | "REVIEWER" | "CLIENT";
  slot: AuthSlot;
  tokenKey: string;
  refreshTokenKey: string;
  userKey: string;
  fallbackName: string;
};

function readStoredUser<T extends AuthUser>(userKey: string): T | null {
  try {
    const raw = localStorage.getItem(userKey);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export class MockRoleAuthService<TUser extends AuthUser> {
  constructor(private readonly config: AuthStorageConfig) {}

  async register(data: RegisterData): Promise<{ user: TUser; token: string }> {
    await mockDelay();
    const state = getStoredAuthState();
    const user = createMockUser(this.config.role, data.email, data.fullName) as TUser;
    user.nickname = data.nickname ?? null;
    saveStoredAuthState({ ...state, [this.config.slot]: user });
    return this.persistSession(user);
  }

  async login(email: string): Promise<{ user: TUser; token: string }> {
    await mockDelay();
    const state = getStoredAuthState();
    const current = state[this.config.slot] as TUser | undefined;
    const user = current ?? (createMockUser(this.config.role, email, this.config.fallbackName) as TUser);
    saveStoredAuthState({ ...state, [this.config.slot]: user });
    return this.persistSession(user);
  }

  async logout(): Promise<void> {
    await mockDelay(80);
    this.clearSession();
  }

  async getProfile(): Promise<TUser | null> {
    await mockDelay(80);
    const user = this.getStoredUser();
    if (user) {
      localStorage.setItem(this.config.userKey, JSON.stringify(user));
    }
    return user;
  }

  async checkSession(): Promise<boolean> {
    await mockDelay(50);
    return this.isAuthenticated();
  }

  async updateProfile(profileData: ProfileUpdateData): Promise<TUser | null> {
    await mockDelay();
    const state = getStoredAuthState();
    const current = (state[this.config.slot] as TUser | undefined) ?? this.getStoredUser();
    if (!current) {
      return null;
    }

    const updated = {
      ...current,
      fullName: profileData.fullName?.trim() || current.fullName,
      nickname: profileData.nickname?.trim() || current.nickname,
      avatarUrl: profileData.avatarUrl?.trim() || current.avatarUrl,
    };

    saveStoredAuthState({ ...state, [this.config.slot]: updated });
    localStorage.setItem(this.config.userKey, JSON.stringify(updated));
    return updated;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.config.tokenKey);
  }

  getStoredUser(): TUser | null {
    return readStoredUser<TUser>(this.config.userKey);
  }

  private persistSession(user: TUser): { user: TUser; token: string } {
    const token = `mock-${this.config.slot}-token-${user.id}`;
    localStorage.setItem(this.config.tokenKey, token);
    localStorage.setItem(this.config.refreshTokenKey, `mock-${this.config.slot}-refresh-${user.id}`);
    localStorage.setItem(this.config.userKey, JSON.stringify(user));
    return { user, token };
  }

  private clearSession(): void {
    localStorage.removeItem(this.config.tokenKey);
    localStorage.removeItem(this.config.refreshTokenKey);
    localStorage.removeItem(this.config.userKey);
  }
}

export function createRoleAuthService<TUser extends MockAuthUser>(config: AuthStorageConfig): MockRoleAuthService<TUser> {
  return new MockRoleAuthService<TUser>(config);
}
