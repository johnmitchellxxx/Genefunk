# GeneFunk Character Sheet

## Overview

A dynamic, interactive character sheet for the GeneFunk TTRPG (D&D 5e-based sci-fi/cyberpunk RPG). Features a cyberpunk aesthetic with neon accents, rollable dice, auto-calculated stats, and per-user character storage.

## Rulebook DB Tables

| Table | Rows | Notes |
|---|---|---|
| `rulebook_classes` | 8 | Biohacker, Codehacker, Crook, Engineer, Gunfighter, Hardcase, Samurai, Suit |
| `rulebook_backgrounds` | 11 | Full skill profs + features |
| `rulebook_genomes` | 18 | Ability bonuses, traits, senses, categories |
| `rulebook_cadres` | 9 | Mercenary / Corporate / Underground / Military / Scientific / Espionage / Medical / Resistance / Freelance |

Seed script: `node_modules/.pnpm/node_modules/.bin/tsx lib/db/src/seed-rulebook.ts`

API routes: `/api/rulebook/classes`, `/api/rulebook/backgrounds`, `/api/rulebook/genomes`, `/api/rulebook/cadres`

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/genefunk-sheet)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Auth**: Replit Auth (OpenID Connect with PKCE)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── genefunk-sheet/     # React character sheet frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── replit-auth-web/    # Replit Auth browser package
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Tables

- `users` — Replit Auth user accounts
- `sessions` — Auth sessions (required by Replit Auth)
- `characters` — Character sheet data (JSON columns for complex fields)
- `rulebook_classes` — GeneFunk 2090 class reference data (8 classes with per-level features, subclasses, proficiencies)
- `rulebook_backgrounds` — Background reference data (11 backgrounds with skill proficiencies, features)
- `rulebook_genomes` — Genome reference data (18 genomes with ability bonuses, senses, traits)

## Key Features

- **Per-user character storage** — each player manages their own characters
- **Cyberpunk dark theme** with neon cyan/green/purple accents
- **Rollable dice** — click any stat/skill to roll d20 + modifier
- **Auto-calculated values** — proficiency bonus, skill modifiers, saving throws
- **D&D Beyond single-screen layout** — all core info visible at once: horizontal ability scores, combat stats strip, three-column body (Saves+Proficiencies | Skills | Conditions+mini-tabs)
- **Mini tab panel** (bottom-right) — Actions, Spells, Inventory, Gene Mods, Cybernetics, Features, Bio
- **Death saves & conditions** — interactive tracker with clickable circles and condition badges
- **Weapon Picker** — searchable modal with all 68 GeneFunk 2090 weapons pre-loaded (melee, firearms, premium, explosives) from the official rulebook; selecting a weapon auto-fills damage, type, range, and properties
- **Character Creation Wizard** — multi-step full-screen wizard (Genome → Class → Background → Ability Scores → Skill Picks → Review) replacing the old text prompt; auto-applies all proficiencies, features, senses, and ability bonuses from static GeneFunk 2090 rulebook data
- **Level Up Flow** — slide-out panel on the character sheet showing features gained at the next level; supports ASI (+2 or +1/+1) at appropriate class levels; enforces level cap of 20
- **Debounced auto-save** to backend
- **Animated dice roller** with toast notifications
- **Rulebook reference dropdowns** — Class, Genome, and Background fields use dropdowns populated from the database, with a "Custom" option for homebrew entries
- **Rulebook API** — public GET endpoints at `/api/rulebook/classes`, `/api/rulebook/backgrounds`, `/api/rulebook/genomes`

## Development

- Run codegen: `pnpm --filter @workspace/api-spec run codegen`
- Push DB schema: `pnpm --filter @workspace/db run push`
- API server dev: `pnpm --filter @workspace/api-server run dev`
- Frontend dev: `pnpm --filter @workspace/genefunk-sheet run dev`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all lib packages as project references.

Production migrations are handled by Replit when publishing. In development, use `pnpm --filter @workspace/db run push`, and fallback to `pnpm --filter @workspace/db run push-force`.
