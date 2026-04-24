import type { MockAuthUser } from "@/mocks/scory";

export type AuthUser = MockAuthUser;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  nickname?: string;
}

export interface ProfileUpdateData {
  fullName?: string;
  nickname?: string;
  avatarUrl?: string;
}

export interface CreateAdminData extends RegisterData {}
