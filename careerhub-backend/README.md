# CareerHub Backend — Express + MongoDB API

Backend for the CareerHub frontend: candidate/employer/admin auth, job
postings, and an admin dashboard API. Built with Express, Mongoose, JWT
(httpOnly cookies), and `express-validator`.

## Stack
- **Express 4** — HTTP layer
- **MongoDB + Mongoose** — data store / ODM
- **jsonwebtoken** — session tokens, stored in an httpOnly cookie (not localStorage)
- **bcryptjs** — password hashing (12 salt rounds)
- **express-validator** — request-shape validation (password/phone/required-field rules)
- **helmet, cors, express-rate-limit, express-mongo-sanitize, xss-clean** — security middleware

## Setup
```bash
cd careerhub-backend
npm install
cp .env.example .env      # then edit JWT_SECRET, MONGO_URI, etc.
npm run seed:admin        # creates the one admin account from .env
npm run dev                # http://localhost:5000
```
You need a MongoDB instance — either local (`mongod` running, `MONGO_URI=mongodb://127.0.0.1:27017/careerhub`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (`MONGO_URI=mongodb+srv://...`).

## Security features (as requested)

### 1. Password: 8–15 characters
Enforced in **two layers** so it can't be bypassed by calling the model directly:
- `src/validators/authValidators.js` — `express-validator` chain: `isLength({ min: 8, max: 15 })`, plus `matches(/[A-Za-z]/)` and `matches(/\d/)` (must contain at least one letter and one number).
- `src/models/User.js` — the same rule re-checked in a Mongoose `pre('save')` hook via `PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&^_-]{8,15}$/` before hashing with bcrypt (12 rounds).

### 2. Phone number: exactly 10 digits, numbers only
- Validator: `isLength({ min: 10, max: 10 })` + `isNumeric({ no_symbols: true })` — rejects `+91...`, spaces, dashes, letters.
- Schema: `match: /^[0-9]{10}$/`, plus a **unique index** so the same phone number can't register twice.

### 3. All registration fields required
Every field (`name`, `email`, `phone`, `password`, `confirmPassword`, and `companyName` for employers) has a `.notEmpty()` rule. `express-validator`'s `validationResult` collects **every** failing field in one pass (not just the first), so the frontend can show all problems at once. See `src/middleware/validateRequest.js`.

### Other hardening included
- **Rate limiting** on `/api/auth/*` (default: 20 attempts / 15 min per IP) and a lighter global limit on `/api` — mitigates brute-force and credential stuffing.
- **Account lockout**: 5 failed login attempts locks the account for 15 minutes (`User.failedLoginAttempts` / `lockUntil`).
- **httpOnly, sameSite cookies** for the JWT — never exposed to client-side JS, so an XSS bug can't steal the session token.
- **bcrypt** password hashing, 12 salt rounds; passwords are never returned in any API response (`select: false` on the schema field, plus a `toSafeJSON()` method used everywhere).
- **helmet** sets secure HTTP headers; **cors** is locked to `CLIENT_URL` with `credentials: true`.
- **express-mongo-sanitize** strips `$`/`.` operators from input (NoSQL injection); **xss-clean** strips script-like input.
- **Centralized error handling** — every error (validation, duplicate email/phone, bad auth, 404, unexpected 500) comes back in one consistent JSON shape with a machine-readable `code` (see below), never a raw stack trace.
- Admin accounts **cannot be self-registered** — only created via `npm run seed:admin`, or promoted through the DB directly.

## API reference

All responses are JSON. Errors always look like:
```json
{ "success": false, "code": "VALIDATION_ERROR", "message": "One or more fields are invalid", "errors": [{ "field": "password", "message": "Password must be between 8 and 15 characters" }] }
```

### Error codes (`src/utils/errorCodes.js`)
| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 400 | One or more fields failed validation |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already registered |
| `PHONE_ALREADY_EXISTS` | 409 | Phone number already registered |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password (or role mismatch) on login |
| `ACCOUNT_DISABLED` | 401 | Account deactivated, or locked from failed attempts |
| `USER_NOT_FOUND` | 401/404 | Token valid but user no longer exists |
| `JOB_NOT_FOUND` | 404 | Job id doesn't exist |
| `NOT_AUTHENTICATED` | 401 | No/invalid session cookie |
| `TOKEN_EXPIRED` | 401 | JWT expired — log in again |
| `TOKEN_INVALID` | 401 | JWT malformed/tampered |
| `FORBIDDEN_ROLE` | 403 | Logged in, but wrong role for this action |
| `FORBIDDEN_OWNER` | 403 | Employer trying to edit another employer's job |
| `ROUTE_NOT_FOUND` | 404 | No matching route |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

### Auth — `/api/auth`
| Method | Path | Body | Access |
|---|---|---|---|
| POST | `/register/candidate` | `name, email, phone, password, confirmPassword` | Public |
| POST | `/register/employer` | `name, email, phone, password, confirmPassword, companyName` | Public |
| POST | `/login` | `email, password, role?` | Public |
| POST | `/logout` | — | Public |
| GET | `/me` | — | Requires cookie |

### Jobs — `/api/jobs`
| Method | Path | Access |
|---|---|---|
| GET | `/?query=&location=&mode=&experience=&page=&limit=` | Public |
| GET | `/:id` | Public |
| GET | `/mine` | Employer |
| POST | `/` | Employer |
| PATCH | `/:id` | Owning employer or admin |
| DELETE | `/:id` | Owning employer or admin |

### Admin — `/api/admin` (all routes require `role: admin`)
| Method | Path |
|---|---|
| GET | `/stats` |
| GET | `/jobs?status=&query=` |
| PATCH | `/jobs/:id/status` `{ status }` |
| GET | `/candidates` |
| GET | `/employers` |
| PATCH | `/users/:id/active` `{ isActive }` |

## Connecting the frontend
See the frontend's own README for the full walkthrough — in short: set
`VITE_API_URL=http://localhost:5000/api` in the frontend's `.env`, set this
backend's `CLIENT_URL` to match the frontend's dev origin (default
`http://localhost:5173`), and run both `npm run dev` processes side by
side. The frontend's `axios` client is configured with
`withCredentials: true`, which is what lets the browser store and resend
the httpOnly auth cookie this API issues.
