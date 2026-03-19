# Visual Direction

## Intent

- Refine the app visually without leaving DaisyUI’s core operating model
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
- DaisyUI provides the right primitives already, so the design should evolve through disciplined use rather than custom component invention

## Approved Visual Traits

- warm-neutral surfaces in light mode
- deep ink-like text and restrained contrast
- one calm accent color for the main CTA
- rounded corners with consistent softness
- soft elevation and visible borders
- small metadata labels that feel like catalog markers, not marketing chrome

## Foreground vs Background

This is an important rule for the app.

- The page background may carry atmosphere through subtle gradients, blur, and soft shape fields
- Foreground UI must stay disciplined, readable, and calm
- “Special” should come from hierarchy, spacing, and restraint, not from loud chrome

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

## Approved Adjectives

Use these when designing new screens:

- quiet
- archival
- editorial
- dependable
- private
- precise

## Anti-Goals

Avoid trying to stand out through:

- loud gradients on content surfaces
- too many colors in one screen
- novelty widgets
- decorative motion
- glossy glassmorphism as the main visual idea
- marketing-style hero sections inside product screens

## Stay Inside DaisyUI

- Prefer customizing built-in `light` and `dark` themes over introducing custom component systems
- Prefer DaisyUI component variants and token changes over bespoke CSS overrides
- Use custom CSS only when it supports the chosen tone, removes repetition, or formalizes a real app primitive

## Current Translation In The App

The current implementation already expresses this direction through:

- warm/cool theme token customization in `src/app.css`
- one dominant collection workspace on the bookmark page
- quiet metadata labels and chips
- restrained action color usage
- soft atmospheric page background with calmer foreground surfaces

Future screens should feel like siblings of this page, not reinventions.

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
