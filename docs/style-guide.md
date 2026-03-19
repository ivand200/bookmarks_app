# Style Guide

## Purpose

Use this document for implementation rules.

- [visual-direction.md](./visual-direction.md) defines the product mood and creative direction
- this file defines the practical UI rules contributors should follow in code
- [frontend-workflow.md](./frontend-workflow.md) explains how to use both docs during real feature work

## Core Rules

- Keep the UI DaisyUI-native whenever possible
- Prefer one dominant workspace per page instead of many equal-weight panels
- Build hierarchy first, then decoration
- Repeat a few visual ideas consistently instead of inventing one-off flourishes
- Keep the interface private, calm, and useful rather than promotional

## Theme Strategy

- Keep DaisyUI `light` and `dark` as the active theme names
- Customize those built-in themes instead of introducing many named themes
- Light mode should feel warm, paper-like, and softly tactile
- Dark mode should feel calm, deep, and readable, never neon

## Token Decisions

These are the current implementation anchors and should stay stable unless there is a deliberate visual reset.

- Shell max width: `72rem`
- Surface radius rhythm:
  - primary large surfaces: around `1.8rem` to `2.2rem`
  - inputs and buttons: around `1rem` to `1.2rem`
  - chips and pills: fully rounded
- Borders:
  - soft visible borders are preferred over borderless glass
  - use `base-300` with transparency before inventing custom grays
- Shadows:
  - prefer soft low-contrast shadows
  - avoid deep glossy or “floating card stack” shadows
- Background treatment:
  - subtle atmospheric gradients and blur are allowed at the page level
  - foreground content surfaces must remain quiet and readable

## Color Usage

- `primary`: main CTA, logo mark, strongest positive emphasis
- `secondary`: restrained supporting emphasis only
- `accent`: rare highlights, never the default chrome color
- `neutral`: avatar blocks, high-contrast small surfaces, utility emphasis
- `success`, `warning`, `error`, `info`: system feedback only

Color discipline rules:

- one screen should read primarily as base surfaces + one strong action color
- avoid mixing multiple bright accents in the same region
- metadata should usually use muted `base-content` opacity, not semantic colors

## Typography

- Page title should be concise and stable
- Workspace title should be the most visually dominant text inside the page body
- Kicker/meta labels should be uppercase, letter-spaced, and used sparingly
- Body copy should be short, practical, and low-drama
- Avoid stacking too many type styles in one region

## Layout Rules

- Center the app in one stable shell width
- Keep the top bar visually distinct from the main workspace
- Place the primary action flow close to the content it changes
- Let tables breathe; do not squeeze them into secondary mini-cards
- Mobile can collapse to stacked cards, but desktop should preserve scanability
- Empty states should occupy the real content region, not appear as tiny side notes

## Current App Primitives

These are the current reusable visual patterns and should be preferred over creating similar alternatives.

- `archive-shell`
  - outer page container and stable width wrapper
- `archive-surface`
  - dominant content surface for the main workspace
- `archive-soft-surface`
  - lighter supporting surface, currently used for the top bar
- `archive-kicker`
  - small uppercase metadata label
- `archive-chip`
  - neutral count/meta pill
- `archive-table`
  - bookmark table styling with restrained hover behavior

If a new pattern repeats on two screens, it should either reuse one of these or be added here intentionally.

## Component Rules

### Top Bar

- Logo on the left, utility actions on the right
- Keep it compact and calm
- Do not flood the whole bar with accent color
- Theme toggle and avatar controls should feel utility-like, not hero-like

### Main Workspace

- Treat the collection area as the dominant page surface
- Heading, count, add row, and content list should read as one flow
- Avoid splitting the user’s attention between multiple same-weight containers

### Add Row

- MVP visible form stays `URL + Add`
- Validation stays inline under the field
- Success feedback should be present but quieter than the content region
- Inputs and actions should share the same radius rhythm

### Tables

- Tables belong in the main content region
- Headers should be clean, compact, and scannable
- Destructive actions should be obvious but visually contained
- Metadata under primary row content should remain quieter than the main link text

### Mobile Cards

- Use cards only as the small-screen adaptation of the collection list
- Keep each card simple: primary URL, quiet metadata, one clear delete action
- Do not make mobile cards more decorative than the desktop table

### Badges And Chips

- Use for counts, hostnames, and short metadata
- Prefer neutral and outline treatments by default
- Reserve stronger color chips for true emphasis

### Alerts

- Use only for action feedback and errors
- Keep copy short
- Place feedback near the action that triggered it

### Empty State

- Use one icon or simple mark
- One short title
- One supporting sentence
- One clear next action

## Accessibility Rules

- Every page needs a descriptive `<title>`
- Form errors should be inline and linked to the relevant field
- Buttons and menus must stay keyboard-usable
- Color should not be the only signal for important feedback
- Decorative background treatments must not reduce readability of foreground surfaces

## Do / Avoid

- Do refine through theme tokens and consistent component usage
- Do prefer DaisyUI variants before writing custom component CSS
- Do reuse existing app primitives before inventing new ones
- Do document repeated patterns once they become part of the visual language
- Avoid turning CRUD pages into marketing layouts
- Avoid one-off visual flourishes that do not repeat
- Avoid multiple competing accent colors on one screen
- Avoid adding special-case spacing, radius, or shadow values without a repeatable reason
