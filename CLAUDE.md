# Claude Code Configuration

Welcome to the JasmineGraph UI repository. This project uses a unified rule system for all AI coding agents to ensure PR consistency and architectural safety across the Next.js Frontend and Node.js Backend.

<instructions>
1. **Core Rules**: Before writing any TypeScript code, you MUST read and follow the constraints defined in `.agents/rules/01_coding_standards.md` and `.agents/rules/02_agent_behavior.md`.
2. **Architecture Specs**: If you are asked to modify specific components (like `redux` state or `repository` layers), first check `.agents/rules/architecture/` for existing architectural constraints.
3. **Commit Style**: Strictly use Conventional Commits (e.g., `feat: ...`, `fix: ...`).
4. **Scope Limit**: Keep your changes as small and localized as possible. Do not perform sweeping refactors unless explicitly commanded.
</instructions>
