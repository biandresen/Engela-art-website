# Developer Tooling Decisions

## Purpose

This document records the main development tools for v1 of the artist website. The goal is to use a modern, professional stack that is still simple enough to learn from.

Chosen direction:

- **Framework:** TanStack Start
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Component approach:** shadcn-style headless components
- **Testing baseline:** Vitest for focused tests, Playwright later for core browser flows
- **Code quality:** ESLint and Prettier

The project should avoid tooling that is impressive but not useful yet. Every dependency should either improve product quality, teach a useful professional pattern, or reduce repeated work.

## Main Decisions

### Use TanStack Start

TanStack Start is the application framework for the site. It provides routing, server-side rendering, server functions, and a full-stack React structure.

Why:

- It fits the decision to build a type-safe, explicit React app.
- Routes and data flow are easier to reason about than more magical framework conventions.
- Server functions are a good fit for the inquiry/contact form.
- It supports a professional architecture without needing a separate backend service in v1.

Pros:

- Strong type-safety mindset.
- Explicit routing model.
- Good learning value for full-stack React.
- Works well with Vite-style frontend tooling.

Cons:

- Newer than Next.js.
- Smaller ecosystem and fewer examples.
- More situations may require reading official docs instead of following tutorials.

Decision:

Use TanStack Start for v1.

### Use TypeScript

TypeScript should be used throughout the project.

Why:

- Painting records have a clear shape.
- Route params and server function inputs benefit from type checking.
- It catches many beginner mistakes before runtime.
- It teaches production-style frontend development.

Pros:

- Safer refactoring.
- Better editor autocomplete.
- Clearer contracts between components and data.

Cons:

- More syntax to learn.
- Some errors feel confusing until the type system becomes familiar.

Decision:

Use strict, practical TypeScript. Avoid advanced type tricks unless they make the code easier to understand.

### Use Tailwind CSS

Tailwind CSS is the main styling tool.

Why:

- You already like it.
- It is fast for responsive layouts.
- It keeps styling close to the component being built.
- It works naturally with shadcn-style components.
- It generates static CSS at build time, so there is no runtime styling cost.

Pros:

- Fast UI iteration.
- Excellent responsive design workflow.
- Easy to keep spacing, color, and typography consistent.
- Good fit for component-based React.

Cons:

- Class names can become long.
- It can hide repeated design patterns if components are not extracted.
- Without design discipline, pages can become visually inconsistent.

Project rules:

- Use Tailwind for layout, spacing, typography, color, and responsive states.
- Extract repeated UI into components instead of copying long class strings everywhere.
- Use a small design token mindset: consistent spacing, color, radius, and typography.
- Add custom CSS only when Tailwind is awkward for a specific repeated pattern.

Decision:

Use Tailwind CSS as the primary styling system.

### Use shadcn-Style Components

Use shadcn-style components as the component library approach.

Important distinction: shadcn/ui is not a traditional black-box component library. It gives you component source code that you copy into your project and own. The components are built with TypeScript, Tailwind CSS, and accessible primitives such as Radix UI.

Why:

- You want to learn component libraries.
- The site should still feel custom and art-directed.
- Accessibility details are easier with proven primitives.
- You can inspect and modify the code instead of only configuring a library from the outside.

Pros:

- Good learning experience.
- Accessible starting point.
- Customizable.
- Works well with Tailwind.
- Avoids the generic look of many full UI kits.

Cons:

- You own the copied code.
- Updates are not as automatic as package-only UI kits.
- You still need design judgment.
- Some components may be unnecessary for a portfolio site.

Use shadcn-style components for:

- Button
- Input
- Textarea
- Label
- Dialog or sheet only if needed
- Toast or alert only if needed
- Form-related primitives if useful

Avoid overusing heavy UI components. This site needs a refined portfolio interface, not a dashboard.

Decision:

Use shadcn-style headless components selectively.

### Prefer Headless Components Over a Full UI Kit

Do not use a full styled UI kit like MUI, Chakra, or Mantine for v1.

Why:

- Full UI kits are excellent for dashboards, admin systems, and internal tools.
- This project needs a custom, artwork-led visual direction.
- A full UI kit may make the site look more like software than an artist portfolio.

Tradeoff:

- A full UI kit would be faster for generic UI.
- Headless/shadcn-style components require more design effort.
- The extra design effort is worth it because the site's visual identity matters.

Decision:

Use headless/customizable components, not a full styled UI kit.

## Practical V1 Dependency Set

Use this as the starting dependency direction. Exact package versions should be chosen when the project is scaffolded.

### Core Runtime Dependencies

- `@tanstack/react-start`
- `@tanstack/react-router`
- `react`
- `react-dom`

### Styling and UI Dependencies

- `tailwindcss`
- Tailwind Vite integration required by the chosen TanStack Start setup
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- Radix primitives only for components that need them
- `lucide-react` for icons if icon buttons are needed

Why these matter:

- `class-variance-authority` helps define component variants like button intent and size.
- `clsx` helps conditionally join class names.
- `tailwind-merge` prevents conflicting Tailwind classes from fighting each other.
- Radix primitives provide accessible behavior for complex UI.
- `lucide-react` gives consistent icons without hand-drawing SVGs.

### Forms and Validation

Recommended:

- `zod`

Optional later:

- `react-hook-form`

Why:

- V1 forms are simple enough that native form handling plus server-side validation may be enough.
- `zod` is useful for validating server function input.
- `react-hook-form` becomes useful if forms become more complex.

Decision:

Use `zod` for validation. Add `react-hook-form` only if form complexity justifies it.

### Email

Choose one transactional email provider during implementation.

Good options:

- Resend
- Postmark
- SendGrid

Selection criteria:

- Simple developer experience
- Reliable delivery
- Good free or low-cost tier
- Easy environment variable setup

Decision:

Pick one email provider during implementation. Do not abstract over multiple providers in v1.

### Testing

Recommended baseline:

- `vitest`
- Testing utilities that fit the TanStack Start setup
- `playwright` later for browser-level inquiry flow testing

Use Vitest for:

- Painting data validation
- Slug uniqueness
- Helper functions
- Server validation logic

Use Playwright for:

- Home to gallery to detail navigation
- Inquiry form success/failure flow
- Basic mobile/desktop smoke tests

Decision:

Start with Vitest. Add Playwright when there is enough UI to test end-to-end.

### Code Quality

Use:

- ESLint
- Prettier

Optional later:

- Husky
- lint-staged
- commitlint

Why:

- ESLint catches likely code mistakes.
- Prettier removes formatting debates.
- Git hooks are useful, but they are not necessary before the first working app exists.

Decision:

Use ESLint and Prettier in v1. Add Git hooks later if manual quality checks become unreliable.

## What To Avoid In V1

Avoid:

- Storybook
- Visual regression testing
- Full design token build systems
- Complex animation libraries
- Global state libraries
- Full UI kits
- CMS SDKs
- Database clients
- Payment SDKs

Why:

These tools are useful in the right project phase, but they would distract from the v1 goal: build a polished portfolio and inquiry flow.

## When To Add More Tools

Add tools when a real problem appears.

Examples:

- Add Storybook if components become numerous and need isolated development.
- Add Playwright when the inquiry flow exists and should be protected from regressions.
- Add a CMS when developer-managed content becomes too slow.
- Add a database when inquiries, orders, or admin workflows need persistence.
- Add Vipps or Stripe when direct checkout becomes a real sales requirement.
- Add animation tools only if motion becomes part of the design direction.

This is an important professional habit: dependencies should solve actual problems, not theoretical future problems.

## Recommended V1 Stack Summary

```txt
TanStack Start
  -> React
  -> TypeScript
  -> TanStack Router
  -> Server functions

Styling
  -> Tailwind CSS
  -> shadcn-style components
  -> Radix primitives where needed
  -> lucide-react for icons where useful

Validation and forms
  -> zod
  -> native forms first
  -> react-hook-form only if needed

Quality
  -> ESLint
  -> Prettier
  -> Vitest
  -> Playwright later for core browser flows
```

## Learning Goals

This toolset should teach:

- How to structure a modern React app.
- How typed routes and server functions work.
- How to build reusable UI components.
- How Tailwind supports responsive design.
- How accessible UI primitives reduce common mistakes.
- How to validate data at server boundaries.
- How to add tests where they protect real behavior.

The best learning path is to keep the first version focused, then add complexity when the project has earned it.

# Artwork image preparation

Maintain original artwork photographs outside Git. Add or document one repeatable local command that produces responsive, watermarked, web-ready AVIF/WebP/JPEG derivatives and reports output dimensions and sizes before assets are committed.

Generated public painting derivatives should be deterministic and reviewable. The preparation command applies the approved Engela Art watermark with configurable placement for exceptional compositions. Do not copy private master files into the public asset tree.

## Preview verification

Use Netlify deploy previews to review route, responsive, language, image, form, and content changes before production. Preview submissions must not contact real buyers or the artist through production email.

## Continuous integration

Add a GitHub Actions workflow that runs on pull requests and pushes to `main`:

1. Check out the repository.
2. Set up Node 22.12.0 with npm caching.
3. Install the lockfile exactly with `npm ci`.
4. Run `npm run verify`.

After the workflow is stable, configure branch protection so its verification check is required before merging to `main`.
