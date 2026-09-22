# Music Playlist API

A layered Node.js/Express REST API for managing users, music tracks, and playlists, backed by MongoDB/Mongoose. Built with JWT-based authentication, role-based access control, and a strict layered architecture separating routing, request handling, validation, business logic, and data access.

## Features

- **Authentication** — signup, login, logout, and identity resolution via JWT (cookie or Bearer token)
- **User management** — admin-controlled user CRUD with role-based access (`admin`, `artist`, `user`)
- **Music catalog** — create/update/delete tracks with structured duration and release-date handling, restricted to `admin`/`artist` roles
- **Playlists** — user-owned playlists with song management (add/remove songs without overwriting the existing list), ownership-based access control, and admin override
- **Centralized error handling** — consistent JSON error responses, with detailed output in development and sanitized messages in production

## Architecture

The API follows a strict layered flow for every feature:

```
Router → Handler → Controller → Domain → Repository
              │
         Validators
```

| Layer          | Responsibility                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Router**     | Maps HTTP method + path to a handler. No logic.                                                                                |
| **Handler**    | Orchestrates the request: runs validators, calls the controller, shapes the HTTP response.                                     |
| **Validator**  | Checks input shape, required fields, and authorization _before_ business logic runs.                                           |
| **Controller** | Translates `req`/HTTP data into plain objects for the domain layer. Contains no business rules.                                |
| **Domain**     | Business logic — authorization decisions, cross-entity checks (e.g. verifying songs exist), orchestration across repositories. |
| **Repository** | Data access only — talks directly to Mongoose models. Owns timestamping and existence checks.                                  |

This separation keeps business logic (`Domain`) fully decoupled from Express, making it framework-agnostic and easier to test or reuse.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB with Mongoose ODM
- **Auth:** JSON Web Tokens (`jsonwebtoken`), password hashing (`bcryptjs`)
- **Validation:** [`validator`](https://www.npmjs.com/package/validator)
- **Logging:** Morgan (development only)

## Project Structure

```
├── Controllers/       # Translate req → domain calls
├── Domains/            # Business logic & authorization
├── Repositories/       # Mongoose data access
├── Models/              # Mongoose schemas
├── Handlers/
│   └── Validators/
│       └── Validation_utils/  # Shared validation helpers
├── Routers/             # Express route definitions
├── Utilities/           # AppError class, global error handler
├── app.js               # Express app setup & middleware
└── Server.js            # DB connection & server bootstrap
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB instance (local or hosted, e.g. MongoDB Atlas)

### Installation

```bash
git clone <repo-url>
cd <repo-folder>
npm install
```

### Environment Variables

Create a `config.env` file in the project root:

```env
NODE_ENV=development
PORT=3000
DATABASE=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXP_DATE=<jwt-expiry, e.g. 90d>
```

### Running the server

```bash
nodemon Server.js
```

The API will be available at `http://localhost:<PORT>/api/v1`.

## API Overview

### Auth — `/api/v1`

| Method | Endpoint  | Description                        |
| ------ | --------- | ---------------------------------- |
| POST   | `/signup` | Register a new user                |
| POST   | `/login`  | Log in and receive a JWT           |
| GET    | `/me`     | Get the current authenticated user |
| GET    | `/logout` | Clear the auth cookie              |

### Users — `/api/v1/user` _(admin only)_

| Method | Endpoint | Description      |
| ------ | -------- | ---------------- |
| GET    | `/`      | List all users   |
| POST   | `/`      | Create a user    |
| GET    | `/:id`   | Get a user by ID |
| PATCH  | `/:id`   | Update a user    |
| DELETE | `/:id`   | Delete a user    |

### Music — `/api/v1/music`

| Method | Endpoint | Description       | Access                 |
| ------ | -------- | ----------------- | ---------------------- |
| GET    | `/`      | List all tracks   | Any authenticated user |
| POST   | `/`      | Add a track       | `admin`, `artist`      |
| GET    | `/:id`   | Get a track by ID | Any authenticated user |
| PATCH  | `/:id`   | Update a track    | `admin`, `artist`      |
| DELETE | `/:id`   | Delete a track    | `admin`, `artist`      |

### Playlists — `/api/v1/playlist`

| Method | Endpoint | Description                  | Access                 |
| ------ | -------- | ---------------------------- | ---------------------- |
| GET    | `/`      | List all playlists           | `admin` only           |
| POST   | `/`      | Create a playlist            | Any authenticated user |
| GET    | `/:id`   | Get a playlist by ID         | Owner or `admin`       |
| PATCH  | `/:id`   | Update name and/or add songs | Owner or `admin`       |
| DELETE | `/:id`   | Delete a playlist            | Owner or `admin`       |

> All routes except `/signup` and `/login` require a valid JWT, sent as an `httpOnly` cookie or a `Bearer` token in the `Authorization` header.

## Error Handling

All errors are funneled through a global error handler and returned as JSON:

```json
{
  "status": "fail",
  "error": "Descriptive error message"
}
```

In development mode, responses include the full error object and stack trace for debugging.
