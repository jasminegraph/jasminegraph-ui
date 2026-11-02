# JasmineGraph UI Coding Standards
These rules must be strictly followed by all developers and AI agents when modifying the TypeScript codebase (Frontend & Backend).

## 1. Frontend (Next.js & React)
*   **State Management**: NEVER use local state (`useState`) or Context for data that needs to be shared across pages (e.g., Graph Data, Cluster ID). Always use Redux Toolkit slices.
*   **Network Calls**: NEVER use raw `fetch()` or raw `axios.get()` in components. Use the pre-configured `authApi` instance from `services/axios.tsx` for any endpoint that requires the `Cluster-ID` header. For pre-authentication endpoints (e.g., login, register, ping) that don't require tokens or cluster context, raw `axios` may be used directly as seen in `auth-service.tsx`.
*   **App Router**: Respect Next.js Server Components. Only add `'use client';` at the client entry boundary; child modules imported by a client boundary inherit client behavior automatically. Do not add `'use client';` to every child component unnecessarily.

## 2. Backend (Node.js & Express)
*   **Architecture**: Strict 3-tier pattern. NEVER write SQL queries in Controllers. All feature data access must be inside the `repository/` directory (with exceptions for infrastructure queries like health checks).
*   **Database**: ALWAYS use parameterized queries with the `pg` pool to prevent SQL injection.
*   **Security**: Top-level API routes (like `/clusters`) must be protected using `keycloakAuthMiddleware`. Note that `/graph` and `/query` currently only use `clusterMiddleware`, which does NOT verify JWT tokens. Agents should explicitly document or expect a trusted upstream verifier, or apply `keycloakAuthMiddleware` if securing these routes is intended.

## 3. General
*   **TypeScript**: Use strict typing in all new code. Avoid `any` types; define proper interfaces for all data structures. Do not refactor existing `any` types unless explicitly asked.
