# MONRE design lock

## Scope

- Mode: production, preserve.
- Register: e-commerce marketing with utility authentication screens.
- Anchor: Aesop-style restraint for the storefront; Clerk-style clarity for social sign-in controls.
- Direction: preserve MONRE's warm, quiet editorial system. This task is a targeted component correction, not a redesign.

## Existing tokens

The source of truth remains `css/base.css`.

| Role | Token |
| --- | --- |
| Page / surface | `--page: #f2eee6`, `--surface: #fbf9f4`, `--card: #fffdfa` |
| Text | `--text: #1b241e`, `--muted: #6f6a61` |
| Brand accent | `--primary: #8a6a45`, `--gold: #b8976a` |
| Dark surfaces | `--dark: #14100c`, `--footer-bg: #181916` |
| Border | `--border: #e4dcce`, `--border-control: #d3c8b6` |
| Type | Jost display, DM Sans body, Cormorant Garamond wordmark |
| Spacing | Existing 4/8px-derived scale; no new parallel scale |
| Radius | Pill for transient messages and actions; existing card radii elsewhere |
| Motion | Toast timer uses the toast timeout; close transition 200ms; reduced-motion respected |

## Component decisions

- Footer artwork uses the supplied transparent `assets/img/footer-plant.png` as one decorative composition, bottom-right aligned, without masks or duplicate foreground art.
- Every transient corner toast displays a bottom-edge countdown bar. Hover or keyboard focus pauses both the countdown and dismissal; leaving resumes from the remaining time.
- Apple and Google quick sign-in buttons use recognizable inline vector marks, remain semantic buttons, and preserve visible keyboard focus.
- Existing routes, field names, copy, DOM order, layout, and public-page metadata stay unchanged.
