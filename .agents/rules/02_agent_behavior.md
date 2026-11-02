# AI Agent Behavioral Constraints
These rules apply to any AI Coding Agent (Antigravity, Claude Code, etc.) operating in this workspace.

## 1. PR Size & Commits
*   **Small PRs**: Limit your code modifications to a maximum of 150-200 lines of code per task. If a user requests a massive feature, stop and ask them to break it down into smaller, verifiable chunks.
*   **Commits**: Use Conventional Commits format (e.g., `feat(frontend): add graph visualizer`, `fix(backend): resolve token refresh loop`).

## 2. Verification
*   **Docker Environment & IDE Errors**: This repository relies heavily on Docker containers. Local IDE warnings may stem from missing or out-of-sync `node_modules` on the host environment, but do not ignore actual compilation failures.
*   **Type Checking**: You must verify that the code passes compilation by checking the Docker container logs or by running the appropriate type-check/build commands inside the container, rather than relying exclusively on host IDE diagnostics.
*   Ensure that any new frontend components do not break existing Redux state flows.
