# Auth System

A basic **authentication and authorization** system built with **Node.js + Express.js**.

It uses:
- **bcryptjs** to hash passwords
- **jsonwebtoken** for JWT-based auth
- **dotenv** for environment variables
- An **in-memory array** as the user store (no database)

## Setup

```bash
cd auth-system
npm install
cp .env.example .env
```

Then open `.env` and set a real value for `JWT_SECRET`:

```ini
PORT=3000
JWT_SECRET=some_long_random_secret
JWT_EXPIRES_IN=1h
```

## Run

```bash
# development (auto-reloads with nodemon)
npm run dev

# production-style
npm start
```

The server runs at `http://localhost:3000`.

## Folder structure

```
auth-system/
├── src/
│   ├── config/env.js              # loads .env, validates JWT_SECRET
│   ├── data/users.js              # in-memory user array
│   ├── middleware/authenticate.js # verifies the JWT
│   ├── middleware/authorize.js    # role-based access control
│   ├── middleware/errorHandler.js # 404 + central error handler
│   ├── validators/authValidator.js# register/login validation rules
│   ├── controllers/authController.js # register + login logic
│   ├── controllers/userController.js  # profile logic
│   ├── routes/authRoutes.js       # /api/auth/*
│   ├── routes/userRoutes.js       # /api/profile, /api/admin/*
│   ├── app.js                     # express app wiring
│   └── server.js                  # entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API overview

| Method | Route                   | Auth required       | Description                          |
| ------ | ----------------------- | ------------------- | ------------------------------------ |
| POST   | `/api/auth/register`    | no                  | Create a `user` or `admin` account   |
| POST   | `/api/auth/login`       | no                  | Get a JWT token                      |
| GET    | `/api/profile`          | Bearer token        | View your own profile                |
| GET    | `/api/admin/dashboard`  | Bearer token + admin| Admin-only welcome message + stats   |

## Example requests (curl)

### 1. Register a normal user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123",
    "role": "user"
  }'
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" }
}
```

> The password hash is never returned.

### 2. Register an admin

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Admin",
    "email": "jane@example.com",
    "password": "secret123",
    "role": "admin"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "user" }
  }
}
```

Save the token, e.g.:

```bash
export TOKEN="eyJhbGciOi..."
```

### 4. GET /api/profile — without a token (`401`)

```bash
curl http://localhost:3000/api/profile
```

**Response:** `401 Unauthorized`

```json
{ "success": false, "message": "Missing or malformed Authorization header. Use: Bearer <token>" }
```

### 5. GET /api/profile — with a token (`200`)

```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Response:** `200 OK` — your profile (no password).

### 6. GET /api/admin/dashboard — as a normal user (`403`)

Login with the `user` account, then:

```bash
curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Response:** `403 Forbidden`

```json
{
  "success": false,
  "message": "Forbidden: you need role \"admin\" to access this resource."
}
```

### 7. GET /api/admin/dashboard — as an admin (`200`)

Login with the `admin` account, then:

```bash
curl http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Welcome to the admin dashboard, jane@example.com!",
  "data": { "admin": { "id": 2, "email": "jane@example.com", "role": "admin" }, "totalUsers": 2 }
}
```

## Error handling

- Unknown routes → `404` `"Route not found: <METHOD> <path>"`
- Any uncaught error → a clean JSON `500` response. Stack traces are logged
  on the server but **never** sent to the client.
- Expired token → `401` `"Token expired"`
- Invalid/garbage token → `401` `"Invalid token"`

## Known limitations (learning project)

1. **Users are lost on restart.** Data lives in an in-memory array
   (`src/data/users.js`), so every time the server restarts all accounts
   disappear. A real app would use a database.
2. **Clients can choose their own role.** Registration accepts a `role` field
   from the client, which is insecure — anyone could register as `admin`.
   In a real app the role should be assigned server-side (e.g. "new accounts
   are always `user`") or managed by an admin. This is done this way here
   purely so the role-based authorization flow is easy to try out.