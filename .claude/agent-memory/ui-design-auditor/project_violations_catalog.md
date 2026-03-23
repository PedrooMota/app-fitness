---
name: Recurring violations catalog — first full-app audit (2026-03-22)
description: All hardcoded colors and design inconsistencies found across every screen and component in the app
type: project
---

## Hardcoded Color Violations Found in Full Audit

### Screens
| File | Line | Hardcoded Value | Should Be |
|---|---|---|---|
| `screens/personal/DashboardScreen.tsx` | 74 | `"#FFF0F3"` (StatCard bg for Treinos) | `colors.dangerLight` or add `secondaryLight` token |
| `screens/personal/ClientDetailScreen.tsx` | 124 | `'#F0FDF4'` (diet icon bg) | `colors.successLight` |
| `screens/personal/WorkoutDetailScreen.tsx` | 181 | `'#fff'` (exNumberText color) | `colors.white` |
| `screens/personal/WorkoutDetailScreen.tsx` | 199 | `'rgba(0,0,0,0.75)'` (modal backdrop) | No token — unavoidable rgba, but duplicated in user version |
| `screens/personal/UpgradePlanScreen.tsx` | 73–74 | `'#7C3AED'`, `'#F5F3FF'` (Pro plan color) | Should be new theme tokens `colors.pro` / `colors.proLight` |
| `screens/personal/UpgradePlanScreen.tsx` | 310 | `'#FDE68A'` (paymentNotice border) | Should be `colors.warning` with opacity, or new token |
| `screens/user/WorkoutDetailScreen.tsx` | 166 | `'#fff'` (exNumberText color) | `colors.white` |
| `screens/user/WorkoutDetailScreen.tsx` | 184 | `'rgba(0,0,0,0.75)'` (modal backdrop) | Acceptable rgba — same as personal version |
| `screens/user/DietScreen.tsx` | 82 | `'#F0FDF4'` (diet icon bg) | `colors.successLight` |
| `screens/user/HistoryScreen.tsx` | 114 | `'#000'` in shadow (shadowColor) | `colors.text` or token — shadow #000 is semi-acceptable |
| `screens/user/HistoryScreen.tsx` | 118 | `'#F0FDF4'` (icon bg) | `colors.successLight` |
| `screens/auth/LoginScreen.tsx` | 125 | `'rgba(255,255,255,0.7)'` (tagline) | Acceptable design-specific rgba on solid primary bg |

### Components
| File | Line | Hardcoded Value | Notes |
|---|---|---|---|
| `components/Button.tsx` | 53, 60, 90, 91, 93 | `'#fff'` | Should be `colors.white`; minor since component is internal |
| `components/TeamScreen.tsx` | 122 | `"#fff"` in FAB icon | Should be `colors.white` |
| `components/VideoThumb.tsx` | 103, 131 | `"#FF0000"` (YouTube logo) | Brand color — acceptable exception |
| `components/VideoThumb.tsx` | 160, 171, 175, 184, 219 | Various `rgba(0,0,0,...)` | Overlay/player chromatics — no theme equivalent exists; acceptable |
| `components/VideoThumb.tsx` | 198, 202, 206 | `'#000'` (video player bg) | Intentional video player black — acceptable |

## Structural / Consistency Issues Found

### Cross-screen inconsistencies
- **Avatar shape**: DashboardScreen (personal) uses `borderRadius: 14` (rect), TeamScreen uses `borderRadius: 24` (circle), ClientDetailScreen uses `borderRadius: 36` (circle) — three different shapes for the same conceptual element
- **StatCard design divergence**: Personal Dashboard StatCards (`padding: 14`, `borderRadius: 16`, centered, floating overlap) vs HistoryScreen StatCards (`padding: 12`, `borderRadius: 12`, `borderTopWidth: 3`, separate shadow config) — not visually unified
- **Icon container shape**: WorkoutsScreen uses `borderRadius: 12`, ClientDetail uses `borderRadius: 10`, DashboardScreen (user) uses `borderRadius: 14` — inconsistent for same icon container pattern
- **Empty state inconsistency**: DashboardScreen (user) empty state has `emptyHint` text below (personal dashboard), UserDashboardScreen does not — missing hint text
- **`#F0FDF4` repeated 3 times**: ClientDetailScreen:124, DietScreen:82, HistoryScreen:118 — all should use `colors.successLight`

### Missing loading/null states
- `PersonalWorkoutDetailScreen` and `UserWorkoutDetailScreen`: return `null` while loading — no loading skeleton or spinner shown to the user
- `PersonalDietDetailScreen` and `UserDietDetailScreen`: same `return null` pattern — blank screen flash
- `UserDashboardScreen`: stats section is conditionally rendered only when `stats !== null` — but no loading placeholder for the stats row gap

### Touch target issues
- `TeamScreen` `removeBtn` (line 166): `padding: 4` only — total touch target ~26×26pt, below 44×44pt minimum
- `TeamScreen` FAB: 56×56pt — compliant
- `HistoryScreen` `deleteBtn` (line 123): `padding: 4` only — same issue as removeBtn
- `CreateWorkoutScreen` trash icon on exercise (line 111): no padding wrapper — likely below 44pt

### Component reuse bypasses
- `HistoryScreen` StatCard is a local implementation with hardcoded shadow values — should match the StatCard pattern from Dashboard or be extracted into a shared component
- `MacroChip` in `PersonalDietDetailScreen` and `MacroBox` in `UserDietDetailScreen` are two different implementations of the same concept across the two diet detail screens

**Why:** Institutional knowledge for future audits — these patterns recur and should be checked whenever these screens are modified.
**How to apply:** When reviewing PRs that touch any of these files, verify the violations have not been reintroduced or expanded.
