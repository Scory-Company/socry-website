# Admin Authentication System

## Overview
Sistem autentikasi admin yang terpisah dari client authentication, menggunakan localStorage keys yang berbeda untuk menghindari konflik.

## File Structure

```
src/
├── services/
│   ├── adminAuth.service.ts    # Admin authentication service
│   ├── clientAuth.service.ts   # Client authentication service
│   ├── api.ts                  # Axios instance dengan interceptor untuk admin & client
│   └── index.ts                # Export semua services
│
├── components/
│   └── admin/
│       ├── AdminLoginForm.tsx  # Form login untuk admin
│       └── AdminAuthGuard.tsx  # Guard untuk protect admin routes
│
└── app/
    └── (admin)/
        └── admin/
            ├── page.tsx        # Admin login page
            ├── layout.tsx      # Admin layout dengan sidebar & auth guard
            └── dashboard/
                └── page.tsx    # Admin dashboard (protected)
```

## Authentication Flow

### Admin Login
1. User mengakses `/admin`
2. `AdminLoginForm` ditampilkan
3. User input email & password
4. Call `authService.login()` dari `adminAuth.service.ts`
5. API: `POST /admin/auth/login`
6. Response: `{ admin, token, refreshToken }`
7. Token disimpan ke `localStorage`:
   - `admin_token` → JWT token
   - `admin_refresh_token` → Refresh token
   - `admin` → User object
8. Redirect ke `/admin/dashboard`

### Protected Routes
1. Semua route di `/admin/*` (kecuali `/admin` login page) dilindungi oleh `AdminAuthGuard`
2. `AdminAuthGuard` cek `authService.checkSession()`
3. Jika tidak authenticated → redirect ke `/admin`
4. Jika authenticated → render children

### Logout
1. User klik "Logout" di sidebar
2. Call `authService.logout()`
3. API: `POST /admin/auth/logout`
4. Clear localStorage (`admin_token`, `admin_refresh_token`, `admin`)
5. Redirect ke `/admin`

## API Endpoints (from ADMIN_AUTH_API.md)

### 1. Login
- **Endpoint**: `POST /admin/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, message, data: { admin, token } }`

### 2. Get Profile (Me)
- **Endpoint**: `GET /admin/auth/me`
- **Headers**: `Authorization: Bearer {admin_token}`
- **Response**: `{ success, message, data: { admin } }`

### 3. Logout
- **Endpoint**: `POST /admin/auth/logout`
- **Headers**: `Authorization: Bearer {admin_token}`
- **Response**: `{ success, message }`

### 4. Create Admin (Protected)
- **Endpoint**: `POST /admin/auth/create`
- **Headers**: `Authorization: Bearer {admin_token}`
- **Body**: `{ email, password, fullName, nickname? }`
- **Response**: `{ success, message, data: { admin } }`

## LocalStorage Keys

### Admin Auth
- `admin_token` → JWT access token
- `admin_refresh_token` → Refresh token
- `admin` → Admin user object

### Client Auth
- `token` → JWT access token
- `refresh_token` → Refresh token
- `user` → Client user object

## API Interceptor Logic

### Request Interceptor
```typescript
// Check if route is admin route
const isAdminRoute = config.url?.startsWith('/admin');

// Use appropriate token
const token = isAdminRoute 
    ? localStorage.getItem('admin_token')
    : localStorage.getItem('token');
```

### Response Interceptor (401 Handling)
```typescript
// Detect admin route
const isAdminRoute = originalRequest.url?.startsWith('/admin');

// Use appropriate refresh token
const refreshToken = isAdminRoute
    ? localStorage.getItem('admin_refresh_token')
    : localStorage.getItem('refresh_token');

// Call appropriate refresh endpoint
const endpoint = isAdminRoute 
    ? '/admin/auth/refresh' 
    : '/auth/refresh';
```

## Usage Examples

### Admin Login Component
```tsx
import { authService } from "@/services"

const { user } = await authService.login({
  email: "admin@example.com",
  password: "password123"
})
```

### Check Admin Authentication
```tsx
import { authService } from "@/services"

const isAuthenticated = authService.isAuthenticated()
const adminUser = authService.getStoredUser()
```

### Logout
```tsx
import { authService } from "@/services"

await authService.logout()
router.push('/admin')
```

## Security Notes

1. **Separate Storage**: Admin dan Client menggunakan localStorage keys yang berbeda
2. **Route Protection**: Semua admin routes protected dengan `AdminAuthGuard`
3. **Token Refresh**: Automatic token refresh via axios interceptor
4. **Session Validation**: `checkSession()` validates token dengan backend
5. **Clean Logout**: Semua tokens dan user data dihapus saat logout

## Next Steps

1. ✅ Admin login page
2. ✅ Admin auth guard
3. ✅ Admin layout dengan logout
4. ⏳ Implement admin dashboard pages
5. ⏳ Add "Create Admin" functionality (protected route)
6. ⏳ Add password reset flow (if needed)
