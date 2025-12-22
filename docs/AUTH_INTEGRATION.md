# Authentication Integration Guide

## 📚 Overview

This guide explains how the authentication system is integrated across the frontend application.

## 🔐 Authentication Flow

### 1. **Login/Register** (`LoginDialog.tsx`)
- User enters credentials
- `authService.login()` or `authService.register()` is called
- Backend returns user data + JWT token
- Token and user data are stored in `localStorage`
- User is redirected to the app

### 2. **Session Management** (`middleware.ts`)
- Middleware checks for token on protected routes
- If no token → redirect to `/login`
- If token exists on auth routes → redirect to `/`

### 3. **User Profile** (`ProfileDropdown.tsx`)
- Loads user data from `localStorage` on mount
- Fetches fresh data from API
- Displays user avatar, name, email, level
- Provides logout functionality

### 4. **Logout** (Multiple components)
- Calls `authService.logout()`
- Clears `localStorage`
- Redirects to `/login`

## 🛠️ Components Integration

### **LoginDialog** (`src/components/client/LoginDialog.tsx`)
```typescript
import { authService } from "@/services"
import { toast } from "sonner"

// Login
const { user } = await authService.login({
  email: formData.email,
  password: formData.password,
})

// Register
const { user } = await authService.register({
  email: formData.email,
  password: formData.password,
  fullName: formData.fullName,
})
```

**Features:**
- ✅ Real API integration
- ✅ Error handling with toast notifications
- ✅ Form validation
- ✅ Loading states
- ✅ Toggle between login/register

### **ProfileDropdown** (`src/components/client/ProfileDropdown.tsx`)
```typescript
import { authService, type User } from "@/services"

// Load user on mount
useEffect(() => {
  const loadUser = async () => {
    const storedUser = authService.getStoredUser()
    const freshUser = await authService.getProfile()
    setUser(freshUser || storedUser)
  }
  loadUser()
}, [])

// Logout
const handleLogout = async () => {
  await authService.logout()
}
```

**Features:**
- ✅ Displays real user data
- ✅ Avatar with fallback initials
- ✅ Level badge
- ✅ Dropdown menu with profile links
- ✅ Working logout button

### **SearchSidebar** (`src/components/client/SearchSidebar.tsx`)
```typescript
import { authService } from "@/services"
import { toast } from "sonner"

// Logout button in footer
<button onClick={async () => {
  try {
    toast.loading("Logging out...")
    await authService.logout()
  } catch (error) {
    toast.error("Logout failed")
  }
}}>
```

**Features:**
- ✅ Logout button in sidebar footer
- ✅ Toast notifications
- ✅ Error handling

## 🔒 Middleware Protection

### **Route Protection** (`src/middleware.ts`)

**Protected Routes** (require authentication):
- `/search`
- `/profile`
- `/progress`
- `/achievements`
- `/settings`
- `/library`
- `/favorites`
- `/reading-list`
- `/bookmarked`
- `/completed`
- `/notes`

**Auth Routes** (redirect if authenticated):
- `/login`
- `/register`

**How it works:**
1. Checks for token in cookies or headers
2. If accessing protected route without token → redirect to `/login?redirect=/original-path`
3. If accessing auth route with token → redirect to `/`

## 📡 API Integration

### **Backend Endpoints Used**

#### **POST /auth/register**
```typescript
{
  email: string
  password: string
  fullName: string
  nickname?: string
}
```

Response:
```typescript
{
  success: true
  message: string
  data: {
    user: User
    token: string
    refreshToken?: string
  }
}
```

#### **POST /auth/login**
```typescript
{
  email: string
  password: string
}
```

Response: Same as register

#### **POST /auth/logout**
No body required. Clears session on backend.

#### **GET /profile**
Returns current user profile.

Response:
```typescript
{
  success: true
  data: User
}
```

### **User Type**
```typescript
interface User {
  id: string
  email: string
  fullName: string
  nickname: string | null
  avatarUrl: string | null
  authProvider: string
  role: string
  isVerified: boolean
}
```

## 💾 Local Storage

The auth system uses `localStorage` to persist:
- `token`: JWT access token
- `refresh_token`: JWT refresh token (if provided)
- `user`: Serialized user object

**Note:** Tokens are automatically attached to all API requests via axios interceptor in `api.ts`.

## 🎨 Toast Notifications

Using `sonner` for user feedback:

```typescript
import { toast } from "sonner"

// Success
toast.success("Login successful!", {
  description: `Welcome back, ${user.fullName}!`,
})

// Error
toast.error("Login failed", {
  description: error.message,
})

// Loading
toast.loading("Logging out...")
```

## 🚀 Usage Examples

### **Check if user is authenticated**
```typescript
import { authService } from "@/services"

if (authService.isAuthenticated()) {
  // User has token
}
```

### **Get stored user data**
```typescript
const user = authService.getStoredUser()
if (user) {
  console.log(user.fullName)
}
```

### **Fetch fresh user data**
```typescript
const user = await authService.getProfile()
```

### **Update user profile**
```typescript
const updatedUser = await authService.updateProfile({
  fullName: "New Name",
  avatarUrl: "https://...",
})
```

### **Check session validity**
```typescript
const isValid = await authService.checkSession()
if (!isValid) {
  // Redirect to login
}
```

## 🔄 Token Refresh

The `api.ts` file includes automatic token refresh:
- When API returns 401 Unauthorized
- Attempts to refresh token using `/auth/refresh`
- If refresh fails → clears storage and redirects to login
- If refresh succeeds → retries original request

## ⚠️ Important Notes

1. **Environment Variable**: Make sure `NEXT_PUBLIC_API` is set in `.env`:
   ```
   NEXT_PUBLIC_API=https://scory-backend-production.up.railway.app/api/v1
   ```

2. **Middleware**: The middleware runs on ALL routes except API routes, static files, and public assets.

3. **Client-Side Only**: `localStorage` only works on client-side. Use `"use client"` directive in components that use auth.

4. **Security**: Never expose sensitive tokens in console logs or error messages in production.

## 🐛 Troubleshooting

### **"Token not found" error**
- Check if login was successful
- Verify `localStorage` has `token` key
- Check browser console for errors

### **Infinite redirect loop**
- Check middleware configuration
- Verify protected routes list
- Check if token is being properly set

### **API 401 errors**
- Token might be expired
- Check if backend is running
- Verify API_URL is correct

### **User data not showing**
- Check if `getProfile()` is being called
- Verify backend `/profile` endpoint
- Check network tab for errors

## 📝 Next Steps

1. **Add forgot password functionality**
2. **Implement email verification**
3. **Add social auth (Google, GitHub)**
4. **Add 2FA support**
5. **Implement role-based access control**
6. **Add session timeout warnings**

## 🎯 Summary

✅ **Login/Register** - Fully integrated with backend  
✅ **Profile Display** - Shows real user data  
✅ **Logout** - Works from multiple locations  
✅ **Route Protection** - Middleware guards protected routes  
✅ **Token Management** - Automatic refresh and storage  
✅ **Error Handling** - Toast notifications for all states  
✅ **Type Safety** - Full TypeScript support  

The authentication system is now production-ready! 🚀
