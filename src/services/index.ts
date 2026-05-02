export { adminAuthService } from "./adminAuth.service";
export { clientAuthService } from "./clientAuth.service";
export { submitEarlyAccessSignup } from "./earlyAccess.service";
export { reviewerAuthService } from "./reviewerAuth.service";
export { googleAuthService } from "./googleAuth.service";

export type { User as AdminUser, LoginCredentials, CreateAdminData } from "./adminAuth.service";
export type {
  User as ClientUser,
  LoginCredentials as ClientLoginCredentials,
  RegisterData,
  ProfileUpdateData,
} from "./clientAuth.service";
export type {
  User as ReviewerUser,
  LoginCredentials as ReviewerLoginCredentials,
  RegisterData as ReviewerRegisterData,
} from "./reviewerAuth.service";
export type {
  EarlyAccessContactType,
  EarlyAccessRole,
  EarlyAccessSignupInput,
  EarlyAccessSignupResponse,
} from "./earlyAccess.service";
export type { AuthUser } from "@/types/auth";
