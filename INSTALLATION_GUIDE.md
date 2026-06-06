# Market ERP - Installation & Deployment Guide

This guide provides step-by-step instructions for installing, configuring, and deploying the Market ERP application. The architecture is a full-stack monolithic container deployment running React (Vite) on the frontend, and an Express.js backend with Prisma (PostgreSQL).

## 1. System Requirements

Before you begin, ensure you have the following installed on your machine or deployment environment:

*   **Node.js**: `v18.x` or higher (required by Vite and Prisma)
*   **npm**: `v9.x` or higher
*   **PostgreSQL**: `v13.x` or higher
*   **Operating System**: Linux, macOS, or Windows (via WSL2 recommended)

## 2. Project Structure

The project follows a unified monolithic pattern, where both the React SPA and the Node.js API are served by a single Express.js instance.

*   `src/components/`: Reusable React components (UI components).
*   `src/pages/`: Main application screen components (Dashboard, Sales, HR, etc).
*   `src/lib/`: Frontend utilities, types, and the main `api.ts` Axios client.
*   `src/server/routes/`: Express.js background API routers handling CRUD.
*   `src/server/middleware/`: Express.js interceptors (Auth, JWT, Error Handling).
*   `prisma/`: Contains `schema.prisma` mapping the PostgreSQL architecture.
*   `server.ts`: The primary Node.js entry point bootstrapping Express and Vite.
*   `package.json`: Dependency manifests and build scripts.
*   `vite.config.ts`: Vite bundling configuration.
*   `tsconfig.json`: TypeScript configurations.

## 3. Environment Variables

Create a file named `.env` in the root directory. You can copy the structure from `.env.example`.

```env
# DATABASE_URL: PostgreSQL connection string required by Prisma
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="postgresql://postgres:password@localhost:5432/market_erp"

# CORS_ALLOWED_ORIGINS: Comma-separated list of origins allowed to interact with the API
# During local development, allow localhost. In production, lock this to your actual domains.
CORS_ALLOWED_ORIGINS="http://localhost:3000,https://your-production-app.run.app"

# JWT_SECRET: A strong 256-bit cryptographic key used to sign Access Tokens
JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"

# REFRESH_SECRET: A strong 256-bit cryptographic key used to sign Refresh Tokens
REFRESH_SECRET="YOUR_SUPER_SECRET_REFRESH_KEY"

# LOG_LEVEL: Configures Pino structured logging verbosity.
# Development: 'debug'. Production: 'info' or 'warn'.
LOG_LEVEL="info"
```

## 4. Database Setup

1.  **Install PostgreSQL** (if not already installed). Use Homebrew (`brew install postgresql`), apt (`sudo apt install postgresql`), or the official installer.
2.  **Start the PostgreSQL service**:
    *   Linux: `sudo systemctl start postgresql`
    *   macOS: `brew services start postgresql`
3.  **Create the Database and User**:
    Open the `psql` terminal:
    ```bash
    psql -U postgres
    ```
    Execute the following SQL commands:
    ```sql
    CREATE DATABASE market_erp;
    CREATE USER market_user WITH ENCRYPTED PASSWORD 'password';
    GRANT ALL PRIVILEGES ON DATABASE market_erp TO market_user;
    -- For PostgreSQL 15+ you must also assign schema permissions
    \c market_erp
    GRANT ALL ON SCHEMA public TO market_user;
    ```
4.  Update your `.env` file's `DATABASE_URL` with the corresponding credentials.

## 5. Prisma Setup

Once `.env` is configured and the database is active, synchronize the Prisma ORM.

1.  Generate the strictly-typed generated client libraries:
    ```bash
    npx prisma generate
    ```
2.  Push the schema definitions into the newly created database (for development):
    ```bash
    npx prisma db push
    ```
    *Note: For production deployments, you should use `npx prisma migrate deploy` instead of `db push` to apply incremental, structured SQL migrations.*

## 6. Dependency Installation

To install all required backend, frontend, and development dependencies run:

```bash
npm install
```

## 7. Development Startup

The local development environment uses `tsx` and the Vite middleware for live-reloading features mapped natively through Express.

To start the full-stack project in development mode:

```bash
npm run dev
```

*   The server binds to port `3000`.
*   Navigate your browser to `http://localhost:3000`.
*   Both API routes (`/api/*`) and the Frontend React UI are hosted simultaneously from this process.

## 8. Production Build

To configure the application for an external deployment environment (such as Google Cloud Run, AWS Fargate, or a VPS):

1.  **Build the Project**:
    This compiles the React SPA via Vite and transforms the TypeScript server into a high-performance bundled `server.cjs` file using `esbuild`.
    ```bash
    npm run build
    ```
2.  **Start the Production Server**:
    Execute the compiled CommonJS artifact cleanly via Node.js native runtime.
    ```bash
    npm run start
    ```
    *(Optional): Depending on your CI/CD, the actual start command may look like `NODE_ENV=production node dist/server.cjs`.*

## 9. Verification Checklist

After launching, perform these verification checks:

*   **Database Connectivity**: Ensure that during startup, an error concerning connection limits mapping to Prisma does not appear in your `stdout` logs.
*   **Authentication Flow**: Navigate to the App and Register a New Account. Log out and log back in. The `/api/auth/register` and `/api/auth/login` calls should return a `200 OK` network tab response with a `token`.
*   **Customer CRUD**: Create a test customer. Edit their details, then delete them. Validate that the UI refreshes accurately and Network payloads trigger smoothly.
*   **Paginator Functionality**: If you seed over 50 records of Leads, Deals, Tasks, Employees or Documents, the API will output `{ data, meta: { totalPages } }`. Make sure UI mappings decode this `data` array correctly.

## 10. Troubleshooting

| Symptom | Cause & Fix |
| :--- | :--- |
| `P2002: Unique constraint failed` | Attempted to register an email address that already belongs to a user. Use a different email or clear the database. |
| `P1001: Can't reach database server` | Incorrect `DATABASE_URL` or PostgreSQL service is turned off. Verify the host and port mapping. |
| `Not allowed by CORS` | The client origin making the API request is not listed in `CORS_ALLOWED_ORIGINS` inside the `.env` file. |
| `Invalid or expired token` | `JWT_SECRET` may have changed, or the token reached its 15-minute expiration boundary without utilizing a valid Refresh Token sequence. |
| `Vite: not found` during build | A missing `npm install`. Run `npm install` again to guarantee `devDependencies` exist. |
| `EADDRINUSE: port 3000 is already in use` | Another Node process is running. Identify and kill it via `lsof -i :3000` (macOS/Linux). |

## 11. Architecture Summary

### Prisma Models
*   **Organization**: Primary architectural boundary for multi-tenant data containment.
*   **User**: Authenticatable identities linked to Organizations.
*   **Session**: Short-lived persistence tokens for managing JWT refresh operations.
*   **VerificationToken**: Security mappings for 1hr limited password resets.
*   **Customer**, **Lead**, **Deal**, **Task**, **Document**, **Employee**: Core business domain logic entities natively linked via Cascade/Soft-Delete constraints to its parent Organization.

### REST API Endpoints
All API endpoints are strictly grouped via Express Routers scoped natively with `/api/`:
*   `auth.ts`: `/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`.
*   `customers.ts`, `leads.ts`, `deals.ts`, `tasks.ts`, `documents.ts`, `employees.ts`: Follow standard RESTful semantic design `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, `DELETE /:id`.

### Middleware Layers
*   **Helmet**: Configures extensive CSP, HSTS, and XSS transport policies.
*   **Pino Http**: Advanced JSON structured request mapping and request-id propagation.
*   **Rate & Payload Limiters**: Blocks IP payload abuse mapping beyond 200 items / 15 minutes, capping active request objects at `10kb`.
*   **JWT Authorizer**: Extracts `Bearer` headers to seamlessly inject `req.user` multi-tenant attributes inside every route request.

### Authentication & Multi-Tenancy Design
*   **Auth Flow**: End-users receive a 15-minute `Access Token` and a 7-day `Refresh Token` backed by a physical `Session` database mapping. A logout cleanly invalidates the `Session`.
*   **Multi-tenant Boundary**: The application executes strict Logical Isolation. No tables have global state. Every record holds an `organizationId`, and all Express Routers append `where: { organizationId: req.user.organizationId }` statically to enforce data fencing safely directly within the Prisma invocation.
