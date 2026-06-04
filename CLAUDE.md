# HCSG Field Advisor Copilot — Claude Instructions

## Token-Efficient Reading Rule

Before reading files:
1. Identify the specific task.
2. Search only for relevant file names, component names, routes, visible UI text, state/store names, and function names.
3. Read only the smallest set of files needed to understand and complete the task.
4. Do not scan the whole codebase unless absolutely necessary.
5. Do not open large files fully unless the relevant section cannot be found another way.
6. Prefer targeted search commands over broad file reads.
7. If a file is large, inspect only the relevant functions/components/sections.
8. Avoid re-reading files already inspected unless they changed.
9. Do not print full file contents in the chat.
10. Summarize only the relevant findings before making changes.

When making changes:
- Modify existing files/components instead of creating replacements.
- Keep edits small and targeted.
- Do not refactor unrelated code.
- Do not inspect unrelated screens.
- Do not explore dependencies unless required for the task.
- Preserve the existing app structure.

Before every task, state:
- Relevant area being changed
- Files/components you expect to inspect
- Why those files are necessary

After every task, state:
- Files changed
- What changed
- Any files intentionally not touched
