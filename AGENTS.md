## Project Configuration

- **Language**: TypeScript
- **Package Manager**: bun
- **Add-ons**: mcp
- **Frontend**: DaisyUI, docs: https://daisyui.com/llms.txt
- **Auth**: Logto
- **Database**: Supabase Postgres

---

## Engineering Principles

- Follow DRY: avoid duplicating business rules, validation logic, and UI patterns when a shared abstraction would keep the code clearer.
- Follow YAGNI: implement only what the current task and agreed scope require; defer speculative features, abstractions, and configuration.
- Prefer low coupling: keep modules narrowly connected, minimize cross-layer knowledge, and avoid designs where one change forces unrelated changes elsewhere.
- Prefer high cohesion: keep related responsibilities together so each file, module, and function has a clear focused purpose.
- When tradeoffs appear, prefer the simplest design that preserves readability, testability, and future maintainability.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

## Planning artifact sync

For non-trivial work, planning artifacts must stay consistent with the current agreed approach and the actual implementation.

When requirements, architecture decisions, sequencing, or implementation reality change:

- update the affected planning documents once the divergence is clear
- do not leave `*-context.md`, `*-design.md`, or `*-tasks.md` stale if later work depends on them
- update only the documents affected by the change
- if the chosen implementation diverges from the prior design, record the new decision and rationale
- prefer small targeted edits over full rewrites
- do not create missing planning artifacts unless the active workflow or skill explicitly requires them

Document roles:

- `<task-name>.md`: agreed requirements and scope
- `<task-name>-context.md`: current-state findings and evidence
- `<task-name>-design.md`: intended solution and key decisions
- `<task-name>-tasks.md`: dependency-ordered implementation plan

Source of truth priority:

1. explicit user decisions in chat
2. actual code / implementation reality
3. design document
4. task breakdown
5. older context notes

Before considering work complete, check whether any related planning document became outdated and refresh it if needed.
