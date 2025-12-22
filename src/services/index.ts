/**
 * Services Index
 * 
 * Central export file for all API services and types.
 * 
 * Usage:
 * ```typescript
 * import { authService, api, type User } from '@/services';
 * 
 * // Login example
 * const { user, token } = await authService.login({ email, password });
 * 
 * // Custom API call
 * const response = await api.get('/endpoint');
 * ```
 */

// Export API instance and configuration
export { default as api, API_URL } from './api';

// Export services
export { authService } from './auth.service';
export { dashboardService } from './dashboard.service';
export { usersService } from './users.service';
export { googleAuthService } from './googleAuth.service';

// Export types from auth.service
export type {
    User,
    LoginCredentials,
    RegisterData,
    ProfileUpdateData
} from './auth.service';

// Export types from dashboard.service
export type {
    Metrics,
    Subscription,
    TrendingArticle,
    FeedbackItem,
    Feedback,
    Activity
} from './dashboard.service';

// Export types from users.service
export type {
    UserStats,
    UserFilters
} from './users.service';
