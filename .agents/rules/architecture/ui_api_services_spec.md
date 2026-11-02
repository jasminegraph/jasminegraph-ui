# UI API & Services Specification

**Location**: `Frontend/src/services/`
**Status**: Spec
**Date**: 2026-09-21

## 1. Overview
The Services layer acts as the single point of entry for all network requests going from the Next.js frontend to the Node.js backend. 

## 2. Core Architecture
The frontend uses **Axios** (`axios.tsx`) for API requests.
* **Interceptors**: Two axios instances are defined: `authApi` (with a request interceptor for `Cluster-ID`) and `api` (with a response interceptor for 401 token refresh). In practice, only `authApi` is actively used by service files. Pre-authentication services (e.g., `auth-service.tsx`) use raw `axios` directly since tokens don't exist yet.
* **Automatic Refresh**: The `api` instance contains complex logic to catch `401 Unauthorized` responses and automatically hit the `/backend/auth/refresh-token` endpoint, pausing other requests using a shared `refreshTokenPromise`. Note: this instance is currently not imported by any service.

## 3. Implicit Contracts & Constraints (Important for AI Agents)
* **Never use raw `fetch`**: AI agents MUST NEVER write native `fetch()` calls or raw `axios.get()` calls inside React components. All network calls must be wrapped in a service function (e.g., inside `graph-service.tsx`) and use the pre-configured `authApi` instance. For pre-auth endpoints, raw `axios` is acceptable inside service files.
* **Cluster-ID Header**: The `authApi` automatically injects the `Cluster-ID` header from local storage. Agents must use `authApi` for any endpoints that require cluster context so the backend routes correctly.
* **Token Refresh Collision**: Do not attempt to write custom token refresh logic in new services, as the centralized interceptor in `axios.tsx` already handles this safely against race conditions.
