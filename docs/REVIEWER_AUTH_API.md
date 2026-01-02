# Reviewer Authentication API Documentation

## Base URL
`http://localhost:3000/api/v1/reviewer/auth`

## Endpoints

### 1. Register Reviewer
Registers a new reviewer account. The account must be approved by an Admin before login is possible.

- **URL**: `/register`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**
```json
{
  "email": "reviewer@example.com",
  "password": "securepassword123",
  "fullName": "Reviewer Name",
  "nickname": "ReviewerOne"
}
```

**Success Response (201 Created)**
```json
{
  "success": true,
  "message": "Registration successful. Please wait for admin approval.",
  "data": {
    "reviewer": {
      "id": "cm5...",
      "email": "reviewer@example.com",
      "fullName": "Reviewer Name",
      "nickname": "ReviewerOne",
      "role": "REVIEWER",
      "isVerified": false
    }
  }
}
```

### 2. Login Reviewer
Authenticates a reviewer and returns a session token. Fails if the account is not yet verified/approved.

- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No

**Request Body**
```json
{
  "email": "reviewer@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "reviewer": {
      "id": "cm5...",
      "email": "reviewer@example.com",
      "fullName": "Reviewer Name",
      "role": "REVIEWER",
      "isVerified": true,
      // ...other fields
    },
    "token": "sess_..."
  }
}
```

**Error Response (403 Forbidden - Not Verified)**
```json
{
  "success": false,
  "message": "Your account is pending approval. Please wait for admin verification"
}
```

### 3. Get Current Reviewer Profile (Me)
Retrieves the profile of the currently logged-in reviewer.

- **URL**: `/me`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token, Role: REVIEWER)

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Reviewer profile retrieved successfully",
  "data": {
    "reviewer": {
      "id": "cm5...",
      "email": "reviewer@example.com",
      "fullName": "Reviewer Name",
      "role": "REVIEWER",
      "isVerified": true
    }
  }
}
```

### 4. Approve Reviewer (Admin Only)
Approves a reviewer account, allowing them to login.

- **URL**: `/:reviewerId/approve`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token, Role: ADMIN)

**Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Reviewer approved successfully",
  "data": {
    "reviewer": {
      "id": "cm5...",
      "isVerified": true
      // ...
    }
  }
}
```

### 5. Logout Reviewer
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
