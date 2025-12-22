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
export { personalizationApi } from './personalization.service';
export { categoriesApi } from './categories.service';

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

// Export types from categories.service
export type {
    CategoryResponse
} from './categories.service';

// Export search service
export { searchApi } from './search.service';

// Export articles service
export { articlesApi } from './articles.service';

// Export types from search.service
export type {
    SearchSource,
    SearchOptions,
    SearchResult,
    SearchResultMetadata,
    SearchMeta,
    SearchResponse
} from './search.service';

// Export types from articles.service
export type {
    ArticleListParams,
    ArticleResponse,
    ArticleContent,
    ContentBlock,
    PaginatedResponse,
    SingleResponse
} from './articles.service';
export { ReadingLevel } from './articles.service';
