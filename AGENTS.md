# AGENTS.md

Use this file only for agent workflow rules that are not already covered by repository code or steering docs.

## Read First

- Treat `specs/product.md`, `specs/tech.md`, and `specs/structure.md` as the durable source of truth.
- For UI work, also use `specs/frontend.md`.
- Do not duplicate durable product, tech, or structure facts here.

## Working Rules

- Prefer the simplest implementation that keeps boundaries clear.
- Keep auth and protected-route enforcement on the server.
- Validate with shared schemas before business logic or persistence.
- Keep route server modules focused on HTTP/load/action orchestration.
- Keep domain rules in focused server-side modules and raw Supabase access in repository-style modules.
- Reuse established UI primitives and documented visual patterns before adding new ones.
- Run the narrowest relevant checks first, then broader checks if the change scope warrants it.

## Svelte / DaisyUI

- If Svelte MCP is available, follow the repo rule: `list-sections` first, fetch the relevant docs, run `svelte-autofixer` for Svelte code, and ask before generating a playground link.
- For DaisyUI component facts, use `https://daisyui.com/llms.txt` instead of guessing classes or modifiers.

## Planning Docs

- For non-trivial work, keep related task artifacts in `tasks/` aligned with the implemented reality.
- Update only the planning docs affected by the change.
- Source-of-truth priority: user decisions in chat, current code, `specs/`, then older planning artifacts.
