# Frontend Workflow

## Purpose

Use this workflow when building or changing screens in this app.

- [visual-direction.md](./visual-direction.md) tells you what the app should feel like
- [style-guide.md](./style-guide.md) tells you how to implement that feeling consistently

## Default Process

1. Start with the product job

- What is the user trying to do on this screen?
- What should be the dominant workspace?
- What is the primary action?

2. Check visual direction

- Make sure the screen still fits `quiet archive`
- Reject ideas that feel like dashboards, hero pages, or generic admin chrome

3. Reuse existing primitives first

- check `src/app.css`
- reuse `archive-*` primitives where they already fit
- prefer existing page patterns before inventing new ones

4. Use DaisyUI before custom CSS

- start with DaisyUI structure and variants
- use theme tokens for most visual changes
- write custom CSS only if the pattern repeats or DaisyUI alone becomes noisy

5. Build one responsive hierarchy

- desktop: preserve scanability and strong structure
- mobile: simplify and stack without changing the product’s tone

6. Run the frontend quality pass

- is the hierarchy obvious in 3 seconds?
- is the primary action near the content it affects?
- is metadata quieter than primary content?
- is the page still calm after adding states and feedback?

## When To Add A New Primitive

Add a new reusable class or documented pattern when:

- it appears on at least two screens, or
- it captures a real visual rule that contributors are likely to repeat inconsistently

Do not add a new primitive for a one-off decorative flourish.

## Definition Of Done For UI Changes

- fits the `quiet archive` direction
- follows the style guide rules
- works on desktop and mobile
- keeps good contrast and readable hierarchy
- uses descriptive page title
- keeps validation and action feedback near the source action
- reuses or intentionally extends the app’s current visual language

## What To Update When The Style Evolves

Update docs in the same task when:

- a new repeated primitive is introduced
- the tone of the app changes
- the token strategy changes
- a page pattern becomes a standard for future screens

This keeps design decisions discoverable and reduces visual drift over time.
