---
name: Design System — theme.ts tokens and usage conventions
description: Complete color palette, shadow tokens, and semantic usage rules discovered in src/theme.ts and across all screens
type: project
---

## Color Tokens (src/theme.ts)

| Token | Hex | Semantic usage |
|---|---|---|
| `colors.primary` | #6C63FF | Personal trainer accent, primary buttons, active state, links |
| `colors.primaryLight` | #EEF0FF | Icon backgrounds, chip backgrounds, avatar backgrounds (personal) |
| `colors.primaryDark` | #5A52D5 | (unused in screens, available for pressed states) |
| `colors.secondary` | #FF6584 | Workout count stat in Personal Dashboard — no other consistent use |
| `colors.success` | #22C55E | User (aluno) accent, confirmations, diet icons |
| `colors.successLight` | #F0FDF4 | Diet icon backgrounds, success chip backgrounds |
| `colors.danger` | #EF4444 | Destructive actions (delete buttons), form error borders |
| `colors.dangerLight` | #FEF2F2 | (defined but unused in screens) |
| `colors.warning` | #F59E0B | Calorie/stat highlights |
| `colors.warningLight` | #FFFBEB | Warning notice backgrounds |
| `colors.background` | #F5F5F7 | All screen root backgrounds |
| `colors.card` | #FFFFFF | Card backgrounds, tab bar background |
| `colors.inputBg` | #F3F4F6 | TextInput field backgrounds |
| `colors.border` | #E5E7EB | Dividers, input borders (unfocused) |
| `colors.text` | #111827 | Primary text |
| `colors.textSecondary` | #6B7280 | Subtitles, descriptions |
| `colors.muted` | #9CA3AF | Tertiary text, inactive icons, empty states |
| `colors.placeholder` | #9CA3AF | TextInput placeholder text |
| `colors.white` | #FFFFFF | Text on colored backgrounds |
| `colors.personal` | #6C63FF | Same as primary — role-specific alias (unused in practice) |
| `colors.user` | #22C55E | Same as success — role-specific alias (unused in practice) |

## Shadow Tokens
- `shadows.sm` — elevation 1, subtle (Card default)
- `shadows.md` — elevation 3, StatCards, prominent UI
- `shadows.lg` — elevation 6, tab bar
- `shadows.colored(color)` — elevation 6, Button component glow

## Role-Specific Accent Convention
- Personal Trainer: `colors.primary` (#6C63FF purple) for tab bar active, header tint, button CTA
- Aluno: `colors.success` (#22C55E green) for tab bar active, header tint

## Spacing Scale in Use
- Base unit: 4px
- Common values: 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40
- Screen horizontal padding: 16px (most screens) or 20px (Profile, UpgradePlan)
- Section header bottom margin: 10–12px consistently
- Card margin bottom: 12px (Card component default)
- Screen bottom padding: 40px content bottom

**Why:** Needed for cross-screen audit consistency checks.
**How to apply:** Flag any spacing value not in the scale above or inconsistent with siblings.
