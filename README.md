# @ballast/tokens

Single source of truth for Ballast's design values. Consumed by `ballast-web`
and `ballast-landing` today, and by `ballast-ios` in Phase 2.

## Rule

`src/tokens.mjs` is the only place a design value is defined. Never hand-write
CSS, and never hardcode a hex value, size, or radius in a client. If a value is
missing, add it here and rebuild.

## Targets

`node build.js` emits into `dist/`:

| File | Consumer |
| --- | --- |
| `theme.css` | Tailwind v4 `@theme` block — web and landing |
| `Tokens.swift` | SwiftUI constants — Phase 2 |
| `tokens.json` | Tooling and design handoff |
| `tokens.js` | JS consumers needing raw values |

`dist/` is gitignored. Consumers install this package by git URL, and npm runs
`prepare` on install, so the build happens on the consumer's machine.

## Consuming

```jsonc
// package.json
"dependencies": {
  "@ballast/tokens": "git+file:../ballast-tokens"   // local dev
  // "@ballast/tokens": "github:USER/ballast-tokens#v0.1.0"  // pinned tag
}
```

```css
/* app.css */
@import "tailwindcss";
@import "@ballast/tokens/theme.css";
```

## Direction

Zed IDE: dark-first, dense, quiet chrome, regions separated by luminance
rather than heavy borders, small radii, fast unshowy motion. The edge is one
high-chroma accent doing real work — money rendered in monospace and coloured
like syntax, so a price increase reads like a diff.
