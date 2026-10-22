# Backend Auth & Middleware Specification

**Location**: `Backend/src/middleware/` & `Keycloak/`
**Status**: Spec
**Date**: 2026-09-21

## 1. Overview
Security is handled at the gateway level in the Node.js backend using Keycloak as the Identity Provider (IdP).

## 2. Core Architecture
* **Keycloak Middleware (`keycloak.middleware.ts`)**: Uses `express-jwt` and `jwks-rsa` to validate JWT Access Tokens.
* **Validation**: It fetches the public JSON Web Key Set (JWKS) directly from the Keycloak server (`http://keycloak:8080/...`) to cryptographically verify signatures, ensuring the token wasn't tampered with.

## 3. Implicit Contracts & Constraints (Important for AI Agents)
* **Route Protection**: When an AI agent creates a new route in `Backend/src/routes/`, the required middleware (like `keycloakAuthMiddleware`) should be attached at the `app.use` mount point in `index.ts`, rather than inside the route module itself.
* **Silent Failures**: The `jwks-rsa` library is configured with `cache: true`. However, on a cache miss or key rotation, if the Keycloak server is down, the middleware will fail to fetch the JWKS and reject requests. Agents debugging "401 Unauthorized" issues should verify Keycloak container health.
