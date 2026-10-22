# UI State Management Specification

**Location**: `Frontend/src/redux/` & `Frontend/src/hooks/`
**Status**: Spec
**Date**: 2026-09-21

## 1. Overview
The JasmineGraph UI Frontend relies on global state management to share complex graph and cluster data across the Next.js application without excessive prop drilling.

## 2. Core Architecture
The frontend uses **Redux Toolkit (RTK)**.
* **Store (`store.ts`)**: The central store combines multiple slices: `appData`, `authData`, `clusterData`, `cacheData`, `queryData`, and `activityData`.
* **Slices (`features/`)**: Each slice handles a distinct domain of the application state.

## 3. Implicit Contracts & Constraints (Important for AI Agents)
* **No Local State for Global Data**: AI agents MUST NOT use `useState` or `useContext` to store data that needs to be accessed by multiple unrelated components (e.g., the currently selected Cluster ID or fetched Graph data). Always create or update an RTK Slice.
* **Immutability**: RTK uses Immer under the hood, allowing "mutating" syntax in reducers. However, agents must still respect this pattern and never mutate state directly outside of slice reducers.
* **Async Logic**: For complex API fetching workflows in new code, agents should prefer Redux Thunks or RTK Query rather than raw `useEffect` blocks in components to keep the UI clean. Note: existing code currently uses `useEffect` for async logic.
