# Enterprise Hardening Report

This document outlines the systematic hardening of the production application to meet enterprise correctness, reliability, security, scalability, and observability standards.

## 1. Database Hardening

We performed a deep review of all Prisma models and applied the following hardening upgrades:

- **Soft Delete Strategy**: Introduced `deletedAt DateTime?` across all mission-critical models (`Organization`, `User`, `Customer`, `Lead`, `Deal`, `Task`, `Document`, `Employee`). This replaces destructive deletes with logical deletes, enabling data recovery and comprehensive historical auditing.
- **Improved Retrieval Performance (Indexes)**: 
    - Added standalone `@@index([deletedAt])` to allow high-performance filtering of non-deleted records.
    - Added compound indexes like `@@index([organizationId, email])` and `@@index([organizationId, status])` for highly-queried multi-tenant views.
- **Cascade Rules & Referential Integrity**: Enforced strict `onDelete: Cascade` policies for child records tied to `Organization`, and `onDelete: SetNull` for deals linked to deleted customers, ensuring zero orphaned records.
- **Remaining Action Items**: Implement audit tables (e.g. `AuditLog`) if granular field-level change history is required. 

## 2. API Hardening

All Express API endpoints have been secured with standard rate limiting, protection middleware, and explicit constraints.

- **Rate Limiting**: Integrated `express-rate-limit`, establishing a global baseline of 200 requests per IP every 15 minutes to mitigate denial of service (DoS) effectively.
- **Payload Constraints**: Limited JSON parsing sizes to `10kb` via `express.json({ limit: "10kb" })` preventing large-payload exhaustion attacks.
- **Route Validation**: Enforced robust schema parsing using `zod`, isolating invalid payloads before business logic execution. Ensure standard error payloads map correctly using `ZodError`.
- **HTTP Parameter Pollution (HPP)**: Deployed the `hpp` middleware to prevent attackers from sending redundant query parameters that bypass validation checks.
- **Remaining Action Items**: Pagination (offset/cursor-based limits) and granular Filtering/Sorting across large datasets.

## 3. Auth Hardening

Authentication routes are foundational to system security and tenant isolation.

- **Implemented**: JWT-based stateless authentication with `bcryptjs` password hashing and organizational boundaries checks exist across API requests.
- **Remaining Action Items (Architecture Overview)**:
  - **Refresh Token Rotation**: Migrate from long-lived access tokens to a short-lived Access + Refresh Token pair. Store active refresh token hashes in a dedicated `Session` table.
  - **Token Revocation**: Build an endpoint that permits users or administrators to immediately invalidate refresh tokens, forcing a session expiry.
  - **Password Reset Flow**: Implement time-limited, single-use, randomized reset tokens stored in the DB, sent out via a certified outbound email service (e.g., SendGrid/SES).
  - **Email Verification**: Gate crucial application functions behind an `emailVerified` flag on the internal `User` model.

## 4. Multi-Tenant Hardening

We run a single-database, multi-tenant architecture. 

- **Tenant Isolation**: Our query philosophy strongly couples the current authorized tenant (`user.organizationId`) directly inside every Prisma query's `where` clause.
- **Automated Guards**: A best practice would be creating Prisma extensions that automatically inject `where: { organizationId: currentOrgId }` to absolutely guarantee cross-tenant data leaks are impossible at the ORM layer.
- **Validation**: Strict validation prevents end-users from forging or bypassing their assigned `organizationId`.

## 5. Security Hardening

- **Security Headers**: Integrated `helmet`, dropping dangerous headers and strictly enabling strict-transport security (HSTS), XSS protection mechanisms, and limiting MIME sniffing.
- **CORS Protection**: Scoped Cross-Origin Resource Sharing. Only approved origins can interface with the backend layer.
- **Input Sanitization**: ORM acts as an implicit prevention layer against SQL injection. Strict Zod schemas eliminate prototype pollution and malicious object injection.

## 6. File Storage Hardening

Current storage models indicate file persistence strategies.

- **Upcoming Requirements**: 
  - Validate uploads via explicit MIME type allowances.
  - Enforce explicit byte limits (e.g., `5MB`).
  - Add explicit file ownership and tenant ID tagging on physical storage objects (e.g., inside S3 metadata).

## 7. Testing Strategy

- **Requirements**: Write structural integration tests leveraging `jest` or `vitest` coupled with `supertest`, creating isolated memory test-databases, focusing strictly on Authorization and Multi-Tenant Isolation limits.

## 8. Observability

- **Status**: The foundation is setup.
- **Upcoming Requirements**: Implement a structured logging framework (e.g., `pino` or `winston`), enabling request tracing (`X-Request-Id` injections) to correlate cross-service communication during incident responses. Utilize Prometheus/Grafana or Datadog for runtime Node metrics.
