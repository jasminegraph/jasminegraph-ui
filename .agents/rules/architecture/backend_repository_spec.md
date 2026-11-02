# Backend Repository Specification

**Location**: `Backend/src/repository/` & `Backend/src/databaseConnection.ts`
**Status**: Spec
**Date**: 2026-09-21

## 1. Overview
The Node.js backend acts as a middleware and orchestration layer. It follows a strict 3-tier architecture: Routes $\rightarrow$ Controllers $\rightarrow$ Repositories.

## 2. Core Architecture
* **Database Connection (`databaseConnection.ts`)**: Uses the `pg` (node-postgres) library to manage a connection pool to a PostgreSQL database.
* **Repository Pattern (`repository/`)**: All database operations (e.g., `cluster.repository.ts`) are encapsulated here as raw SQL queries executed via `pool.query()`.

## 3. Implicit Contracts & Constraints (Important for AI Agents)
* **No SQL in Controllers**: AI agents MUST NEVER write SQL queries directly inside `controllers/`. If a new GraphRAG feature needs a database lookup, the SQL must be written in a new or existing file inside `repository/`, which is then called by the controller.
* **SQL Injection Prevention**: When writing raw SQL queries in the repository layer, agents MUST ALWAYS use parameterized queries (e.g., `WHERE id = $1`) provided by the `pg` library. Never use string concatenation or template literals for SQL variables.
