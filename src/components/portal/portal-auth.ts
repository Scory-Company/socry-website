"use client"

import { adminAuthService, reviewerAuthService } from "@/services"
import type { AuthUser, LoginCredentials } from "@/types/auth"

export type PortalRole = "admin" | "reviewer"

export interface PortalAuthService {
  login: (credentials: LoginCredentials) => Promise<{ user: AuthUser; token: string }>
  logout: () => Promise<void>
  getProfile: () => Promise<AuthUser | null>
  getStoredUser: () => AuthUser | null
  checkSession: () => Promise<boolean>
  isAuthenticated: () => boolean
}

const portalAuthServices: Record<PortalRole, PortalAuthService> = {
  admin: adminAuthService,
  reviewer: reviewerAuthService,
}

export function getPortalAuthService(role: PortalRole): PortalAuthService {
  return portalAuthServices[role]
}
