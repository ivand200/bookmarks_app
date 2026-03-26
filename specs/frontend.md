# Frontend Spec

## Purpose

- Keep the UI direction in one small steering file.
- Prefer this file over separate frontend guide and workflow docs.

## Direction

- Mood: calm, private, editorial, shelf-like.
- Avoid dashboard chrome, marketing-page styling, and decorative sidebars.
- Stay DaisyUI-first: use theme tokens and existing component primitives before custom CSS.

## Core Layout Pattern

- Use one dominant workspace per page.
- Prefer the current shelf pattern:
  - `shelf-sitebar` for thin top identity + utility actions
  - `shelf-frame` for the bordered main workspace
  - `shelf-sidebar` only when it maps to real views or navigation
  - `shelf-band` for title, search, add flow, and inline feedback
  - `shelf-rule-list` / `shelf-entry` for calm ruled content rows
- On mobile, prefer a ruled stacked list over decorative cards.

## Practical Rules

- Keep auth and data-heavy controls server-backed; keep UI hierarchy simple.
- Put the primary action close to the content it changes.
- Keep metadata quieter than primary content.
- Keep destructive actions visible but restrained.
- When organization arrives, folders or other real top-level collections may replace the temporary shelf rail views. Do not invent fake taxonomy.

## Workflow

- Start from the user job on the screen, then preserve one dominant workspace.
- Reuse the existing `shelf-*` primitives in `src/app.css` before inventing new ones.
- Add a new primitive only when the pattern repeats or would otherwise drift.
- Update this file when the durable visual direction or standard page pattern changes.

## Examples

- Bookmark page: top rail, narrow desktop rail, sticky band, ruled list.
- Search state: keep the same workspace and show filtering as a state, not a new dashboard.
- Empty state: one title, one support sentence, one clear next action.
