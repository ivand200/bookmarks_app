# Frontend Guide

## Purpose

Use this document for the product's durable frontend direction and implementation rules.

- this file defines what the app should feel like
- this file defines the practical UI rules contributors should follow in code
- [frontend-workflow.md](./frontend-workflow.md) explains how to apply this guidance during real feature work

## Intent

- Refine the app visually without leaving DaisyUI's core operating model
- Make the bookmark app feel calmer, more intentional, and more ownable than stock component defaults
- Keep implementation light: theme tokens first, component discipline second, minimal custom CSS third

## Chosen Direction

- Working direction: `quiet archive`
- Product metaphor: a personal reference shelf
- Mood: calm, precise, private, editorial, lightly tactile

This app should not feel like:

- an analytics dashboard
- a startup landing page
- a playful productivity toy
- a generic CRUD admin panel

## Why This Fits The Product

- The product is about collecting and returning to links, so the interface should feel dependable and low-noise
- The current layout already uses one dominant collection workspace, which fits an archival tool better than a card-heavy dashboard
- The next phase of the product will likely introduce tags and folder-style organization, so the visual system should be able to support category-aware navigation without losing calmness
- DaisyUI provides the right primitives already, so the design should evolve through disciplined use rather than custom component invention

## Core Rules

- Keep the UI DaisyUI-native whenever possible
- Prefer one dominant workspace per page instead of many equal-weight panels
- Build hierarchy first, then decoration
- Repeat a few visual ideas consistently instead of inventing one-off flourishes
- Keep the interface private, calm, and useful rather than promotional

## Approved Visual Traits

- warm-neutral surfaces in light mode
- deep ink-like text and restrained contrast
- one calm accent color for the main CTA
- rounded corners with consistent softness
- soft elevation and visible borders
- small metadata labels that feel like catalog markers, not marketing chrome

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
  - avoid deep glossy or floating card stack shadows
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
- When bookmark organization is added, a narrow left navigation is allowed if it represents real top-level collections such as folders or curated shelf sections
- Do not add a sidebar just to decorate the layout; navigation must map to actual product structure
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
- `archive-band`
  - unified workspace header band that groups title, count, filters, and add flow
- `archive-band-form`
  - hairline-separated form row inside a workspace band
- `archive-rule-list`
  - editorial list rhythm with quiet row dividers
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
- Prefer a compact unified header band when title, count, filters, and add actions belong to the same workspace
- Prefer a single banded header over stacking multiple small cards above the list
- Avoid splitting the user's attention between multiple same-weight containers

### Collection Navigation

- Folder-style navigation may live in a narrow left rail when it reflects real product structure
- Left navigation should feel like a shelf index, not application chrome
- Keep labels short, calm, and scannable
- Hide the left rail on small screens and collapse navigation into a simpler mobile control
- Tags should not automatically become sidebar navigation; treat them as filters or row metadata unless the product model changes

### Add Row

- MVP visible form stays `URL + Add`
- When the add flow lives in a workspace band, keep it visually attached to the title/count region with a quiet divider
- Validation stays inline under the field
- Success feedback should be present but quieter than the content region
- Inputs and actions should share the same radius rhythm

### Tables

- Tables belong in the main content region
- Headers should be clean, compact, and scannable
- Destructive actions should be obvious but visually contained
- Metadata under primary row content should remain quieter than the main link text
- Dates and domains can stay visible when they help scanning, but they should remain clearly secondary to the bookmark title
- A ruled editorial list is preferred over a heavy boxed table when the content is primarily for scanning and reading

### Mobile Cards

- Use cards only as the small-screen adaptation of the collection list
- Keep each card simple: primary URL, quiet metadata, one clear delete action
- Mobile cards should inherit the same calm hierarchy as desktop rows rather than becoming more colorful or feature-heavy
- Do not make mobile cards more decorative than the desktop table

### Badges And Chips

- Use for counts, hostnames, tags, and short metadata
- Prefer neutral and outline treatments by default
- Reserve stronger color chips for true emphasis
- If tag filtering is introduced, selected states should be clear without making the chip row louder than the bookmark list

### Alerts

- Use only for action feedback and errors
- Keep copy short
- Place feedback near the action that triggered it

### Empty State

- Use one icon or simple mark
- One short title
- One supporting sentence
- One clear next action

## Foreground vs Background

This is an important rule for the app.

- The page background may carry atmosphere through subtle gradients, blur, and soft shape fields
- Foreground UI must stay disciplined, readable, and calm
- Special should come from hierarchy, spacing, and restraint, not from loud chrome

That means:

- subtle atmospheric backgrounds are allowed
- loud foreground gradients are not the default direction
- content surfaces should remain stable even when the page background has character

## What Makes The App Feel Special

The app should feel more like a private archive than a generic CRUD screen.

Its identity should come from restraint:

- stronger hierarchy
- calmer palette
- better spacing rhythm
- deliberate use of labels, chips, and metadata
- one dominant workspace instead of many competing panels
- organization that feels like a private shelf, not a productivity dashboard

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

## Current Translation In The App

The current implementation already expresses this direction through:

- warm/cool theme token customization in `src/app.css`
- one dominant collection workspace on the bookmark page
- a unified header band for title, count, and add flow
- a quieter ruled list rhythm for bookmark scanning
- quiet metadata labels and chips
- restrained action color usage
- soft atmospheric page background with calmer foreground surfaces

Future screens should feel like siblings of this page, not reinventions.

## Near-Term UI Direction

- The app should be ready to grow from a single bookmark list into an organized archive with tags and likely folders
- Category-style navigation is an approved direction when it represents real collections rather than invented marketing structure
- If both folders and tags exist, folders should carry more navigational weight and tags should stay secondary as filters or metadata
- The preferred mood for future organization UI is editorial and ruled rather than card-heavy or panel-heavy

## Out Of Scope For Now

- custom icon set
- custom font loading pipeline
- illustration system
- advanced motion language
- new complex components outside DaisyUI primitives
- a full design-system package

## References

- DaisyUI themes support custom themes and customization of built-in themes: [daisyUI Themes](https://daisyui.com/docs/themes/)
- Carbon recommends using data tables in the main content area with enough space for user resources: [Carbon Data Table Usage](https://carbondesignsystem.com/components/data-table/usage/)
- Atlassian foundations frame design decisions around tokens, spacing, grid, color, typography, elevation, border, and radius: [Atlassian Foundations](https://atlassian.design/foundations/)
