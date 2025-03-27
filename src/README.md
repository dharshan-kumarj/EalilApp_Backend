
# Telecare Authentication API Documentation

This document provides details about the authentication endpoints for the Telecare application.

## Base URL

```
https://api.selfmade.plus
```

## Authentication Endpoints

### 1. Register a New User

Register a new patient or caretaker user in the system.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's email address |
| password | string | Yes | Password (minimum 6 characters) |
| role | string | Yes | User role: either "PATIENT" or "CARETAKER" |
| name | string | Yes | Full name of the user |
| phoneNumber | string | Yes | Contact phone number |
| address | string | Yes (for patients) | Physical address (required only for patients) |

#### Example Request - Patient Registration

```json
POST /auth/register
{
  "email": "patient@example.com",
  "password": "securepassword123",
  "role": "PATIENT",
  "name": "John Smith",
  "phoneNumber": "1234567890",
  "address": "123 Health Street, Medical City, 10001"
}
```

#### Example Request - Caretaker Registration

```json
POST /auth/register
{
  "email": "caretaker@example.com",
  "password": "securepassword456",
  "role": "CARETAKER",
  "name": "Sarah Johnson",
  "phoneNumber": "9876543210"
}
```

#### Success Response

- **Status Code**: `201 Created`
- **Content-Type**: `application/json`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-klmno123456",
    "email": "patient@example.com",
    "role": "PATIENT"
  }
}
```

#### Error Responses

- **Status Code**: `400 Bad Request`
  - When user already exists:
    ```json
    {
      "statusCode": 400,
      "message": "User already exists",
      "error": "Bad Request"
    }
    ```
  
  - When address is missing for patients:
    ```json
    {
      "statusCode": 400,
      "message": "Address is required for patients",
      "error": "Bad Request"
    }
    ```

  - When validation fails:
    ```json
    {
      "statusCode": 400,
      "message": [
        "email must be a valid email",
        "password must be at least 6 characters"
      ],
      "error": "Bad Request"
    }
    ```

### 2. User Login

Authenticate an existing user and receive a JWT token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | string | Yes | User's registered email address |
| password | string | Yes | User's password |

#### Example Request

```json
POST /auth/login
{
  "email": "patient@example.com",
  "password": "securepassword123"
}
```

#### Success Response

- **Status Code**: `200 OK`
- **Content-Type**: `application/json`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-klmno123456",
    "email": "patient@example.com",
    "role": "PATIENT"
  }
}
```

#### Error Responses

- **Status Code**: `401 Unauthorized`
  ```json
  {
    "statusCode": 401,
    "message": "Invalid credentials",
    "error": "Unauthorized"
  }
  ```

### 3. Get User Profile

Retrieve the current user's profile information.

- **URL**: `/auth/profile`
- **Method**: `GET`
- **Content-Type**: `application/json`
- **Authorization**: Bearer Token (JWT obtained from login/register)

#### Example Request

```
GET /auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response

- **Status Code**: `200 OK`
- **Content-Type**: `application/json`

##### Patient Response Example:
```json
{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-klmno123456",
  "email": "patient@example.com",
  "role": "PATIENT",
  "patient": {
    "id": "p1q2r3s4-t5u6-v7w8-x9y0-zabcdef12345",
    "name": "John Smith",
    "phoneNumber": "1234567890",
    "address": "123 Health Street, Medical City, 10001"
  },
  "caretaker": null
}
```

##### Caretaker Response Example:
```json
{
  "id": "f1e2d3c4-b5a6-9g8h-7i6j-klmno654321",
  "email": "caretaker@example.com",
  "role": "CARETAKER",
  "patient": null,
  "caretaker": {
    "id": "c1b2a3z4-y5x6-w7v8-u9t0-srqpon54321",
    "name": "Sarah Johnson",
    "phoneNumber": "9876543210"
  }
}
```

#### Error Responses

- **Status Code**: `401 Unauthorized`
  ```json
  {
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
  }
  ```

- **Status Code**: `400 Bad Request`
  ```json
  {
    "statusCode": 400,
    "message": "User not found",
    "error": "Bad Request"
  }
  ```

## Authentication Token

- All protected endpoints require a valid JWT token
- The token should be included in the Authorization header as a Bearer token
- Tokens expire after 24 hours from issuance

## Status Codes

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request contains invalid parameters
- `401 Unauthorized`: Authentication failed or token is invalid/expired
- `500 Internal Server Error`: Something went wrong on the server

## Token Usage Example

```
curl -X GET https://api.selfmade.plus/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```