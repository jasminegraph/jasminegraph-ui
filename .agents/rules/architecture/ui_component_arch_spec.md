# UI Component Architecture Specification

**Location**: `Frontend/src/app/`, `Frontend/src/components/`
**Status**: Spec
**Date**: 2026-09-21

## 1. Overview
The UI follows modern Next.js conventions, separating routing layouts from reusable UI components.

## 2. Core Architecture
* **App Router (`app/`)**: Handles the file-system based routing.
* **Client vs Server Components**: The frontend uses Next.js App Router. Client boundaries are established by explicitly declaring `"use client";` at the top of an entry file. Child modules imported by a client boundary automatically inherit client behavior.

## 3. Implicit Contracts & Constraints (Important for AI Agents)
* **"use client" Directives**: AI agents must not place interactive hooks (or Redux hooks) into Server Components. However, do not unnecessarily add `"use client";` to every interactive child component. Only add it at the required client entry boundary to avoid bloating the client bundle.
* **Component Granularity**: Do not build massive monolithic components for new Temporal GraphRAG visualizers. Break them down into smaller pieces in `src/components/` and compose them in the `app/` pages.
