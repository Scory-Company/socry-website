# Admin Authentication API Documentation

## Base URL
`http://localhost:3000/api/v1/admin/auth`

## Endpoints

### 1. Login Admin
Authenticates an admin and returns a session token.

- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**
```json
{
  "email": "admin@example.com",
  "password": "secretpassword"
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "cm5...",
      "email": "admin@example.com",
      "fullName": "Admin Name",
      "nickname": "SuperAdmin",
      "avatarUrl": null,
      "authProvider": "LOCAL",
      "role": "ADMIN",
      "isVerified": true
    },
    "token": "sess_..."
  }
}
```

### 2. Create Admin
Creates a new admin account. This endpoint is protected and requires an existing admin to invoke it.

- **URL**: `/create`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token, Role: ADMIN)

**Request Body**
```json
{
  "email": "newadmin@example.com",
  "password": "securepassword123",
  "fullName": "New Admin",
  "nickname": "new_admin"
}
```

**Success Response (201 Created)**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "id": "cm5...",
      "email": "newadmin@example.com",
      "fullName": "New Admin",
      "nickname": "new_admin",
      "role": "ADMIN",
      "isVerified": true
    }
  }
}
```

### 3. Get Current Admin Profile (Me)
Retrieves the profile of the currently logged-in admin.

- **URL**: `/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Role: ADMIN)

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Admin profile retrieved successfully",
  "data": {
    "admin": {
      "id": "cm5...",
      "email": "admin@example.com",
      "fullName": "Admin Name",
      "nickname": "SuperAdmin",
      "authProvider": "LOCAL",
      "role": "ADMIN",
      "isVerified": true
    }
  }
}
```

### 4. Logout Admin
Invalidates the current session.

- **URL**: `/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
