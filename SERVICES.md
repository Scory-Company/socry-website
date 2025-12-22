# Services Documentation

## 📁 File Structure

```
services/
├── api.ts              # Base axios configuration
├── auth.service.ts     # Authentication service
├── dashboard.service.ts # Dashboard data service
├── users.service.ts    # User management service
└── index.ts           # Central exports
```

## 🚀 Quick Start

### 1. Import Services

```typescript
import { authService, api, type User } from '@/services';
```

### 2. Authentication Examples

#### Login
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const { user, token } = await authService.login({ email, password });
    console.log('Logged in:', user);
    // Token automatically stored in localStorage
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

#### Register
```typescript
const handleRegister = async () => {
  try {
    const { user, token } = await authService.register({
      email: 'admin@example.com',
      password: 'password123',
      fullName: 'Admin User',
      nickname: 'admin'
    });
    console.log('Registered:', user);
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};
```

#### Get Profile
```typescript
const loadProfile = async () => {
  const user = await authService.getProfile();
  if (user) {
    console.log('Profile:', user);
  }
};
```

#### Update Profile
```typescript
const updateUserProfile = async () => {
  try {
    const updatedUser = await authService.updateProfile({
      fullName: 'New Name',
      nickname: 'newnick',
      avatarUrl: 'https://example.com/avatar.jpg'
    });
    console.log('Updated:', updatedUser);
  } catch (error) {
    console.error('Update failed:', error.message);
  }
};
```

#### Logout
```typescript
const handleLogout = async () => {
  await authService.logout();
  // Automatically clears tokens and redirects to /login
};
```

#### Check Session
```typescript
const checkAuth = async () => {
  const isValid = await authService.checkSession();
  if (isValid) {
    console.log('Session is valid');
  } else {
    console.log('Session expired');
  }
};
```

### 3. Custom API Calls

```typescript
import api from '@/services/api';

// GET request
const fetchData = async () => {
  const response = await api.get('/endpoint');
  return response.data;
};

// POST request
const createData = async (data: any) => {
  const response = await api.post('/endpoint', data);
  return response.data;
};

// PATCH request
const updateData = async (id: string, data: any) => {
  const response = await api.patch(`/endpoint/${id}`, data);
  return response.data;
};

// DELETE request
const deleteData = async (id: string) => {
  const response = await api.delete(`/endpoint/${id}`);
  return response.data;
};
```

## 🔐 Token Management

Tokens are automatically managed:
- **token**: Main access token
- **refresh_token**: Used for automatic token refresh
- **user**: User data stored as JSON

### Auto Refresh
When API returns 401 (Unauthorized):
1. Service automatically tries to refresh token
2. If successful, retries the failed request
3. If failed, redirects to `/login`

## 📦 Available Services

### authService
- `login(credentials)` - Login with email/password
- `register(data)` - Register new user
- `logout()` - Logout and clear session
- `getProfile()` - Get current user profile
- `updateProfile(data)` - Update user profile
- `checkSession()` - Validate current session
- `isAuthenticated()` - Check if user is logged in
- `getStoredUser()` - Get user from localStorage

### dashboardService
- `getMetrics()` - Get dashboard metrics
- `getSubscriptions()` - Get subscription data
- `getTrendingArticles()` - Get trending articles
- `getFeedback()` - Get user feedback
- `getRecentActivity()` - Get recent activity

### usersService
- `getUserStats()` - Get user statistics
- `getUsers(filters)` - Get users with filters
- `getUserById(id)` - Get user by ID
- `updateUserStatus(id, status)` - Update user status
- `updateUserRole(id, role)` - Update user role

## 🌐 Environment Variables

Make sure to set in `.env`:

```env
NEXT_PUBLIC_API=https://scory-backend-production.up.railway.app/api/v1
```

## 📝 TypeScript Types

All types are exported from `@/services`:

```typescript
import type { 
  User, 
  LoginCredentials, 
  RegisterData,
  ProfileUpdateData,
  Metrics,
  Subscription,
  TrendingArticle
} from '@/services';
```

## ⚠️ Error Handling

Always wrap API calls in try-catch:

```typescript
try {
  const result = await authService.login({ email, password });
  // Handle success
} catch (error: any) {
  // Handle error
  console.error(error.message);
  // Show error to user
}
```

## 🎯 Best Practices

1. **Always use try-catch** for API calls
2. **Check authentication** before protected routes
3. **Handle loading states** in components
4. **Show user-friendly errors** from error.message
5. **Use TypeScript types** for type safety
