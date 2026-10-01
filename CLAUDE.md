# CLAUDE.md

Context for Claude Code working in this repository.

## What this project is

A reusable, admin-configurable website template for Indonesian souvenir (oleh-oleh) brands, used as a portfolio piece to pitch website projects to clients (e.g. lecturers/teachers with research or community-service grants building sites for local UMKM). Reference sites: toraya-group.co.jp (Japanese) and mpokmumun.com (Indonesian, WordPress + Elementor — this project is meant to beat it on speed, security and ease of editing).

The demo brand is **Sari Priangan**, a fictional oleh-oleh shop from Bandung/Garut. All demo content comes from `src/seed/`.

Public site language: **Bahasa Indonesia**. Admin UI: Indonesian by default (English available per user). Code, comments and commit messages: English.

## Stack

- **Next.js 16** (App Router, `output: 'standalone'`) + **Payload CMS 3.90** in the same app (admin at `/admin`, REST at `/api`, GraphQL at `/api/graphql`).
- **SQLite** via `@payloadcms/db-sqlite` (libSQL). Local file by default; Turso URL works too.
- **Lexical** rich text, **sharp** for image resizing (WebP sizes: `thumb` 400, `card` 800, `wide` 1600).
- Plain CSS (no Tailwind) in `src/app/(frontend)/styles.css`.
- Deploy: Docker + Caddy (auto HTTPS) on a VPS; GitHub Actions builds to GHCR and deploys over SSH.
- Node 22, npm (lockfile committed — keep using npm, not pnpm/yarn).

Payload and all `@payloadcms/*` packages must stay on the **same exact version**. Next.js must satisfy `@payloadcms/next` peer range. Upgrade them together.

## Commands

```bash
npm run dev               # dev server, http://localhost:3000 (DB schema auto-pushed)
npm run build             # production build (does NOT need a database)
npm run typecheck         # tsc --noEmit
npm run seed              # demo content + admin user (skips if products exist)
npm run seed -- --force   # wipe catalogue content and reseed
npm run generate:types    # regenerate src/payload-types.ts after schema changes
npm run payload migrate:create <name>   # create a migration after schema changes
npx payload migrate       # apply migrations manually
```

Default seeded admin: `admin@example.com` / `ganti-password-ini` (override with `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).

Required env (see `.env.example`): `PAYLOAD_SECRET`, `DATABASE_URI` (e.g. `file:./data/site.db`), `NEXT_PUBLIC_SERVER_URL`. Optional: `DATABASE_AUTH_TOKEN` (Turso), `MEDIA_DIR` (upload folder, default `./media`).

## Layout

```
src/
  payload.config.ts        collections, globals, DB adapter, i18n, prodMigrations
  access/index.ts          isAdmin, isLoggedIn, publishedOrLoggedIn, isAdminOrSelf
  fields/slug.ts           slugField() — auto slug from title, unique, indexed
  collections/             Products, Categories, Stories, Media, Users
  globals/                 Home, About, Settings
  migrations/              generated migrations — always commit
  payload-types.ts         generated — never edit by hand
  seed/                    index.ts (content), placeholder.ts (SVG→JPEG via sharp), richtext.ts (Lexical helper)
  lib/payload.ts           payloadClient(), getSettings() — React cache()-wrapped
  lib/format.ts            rupiah(), tanggal(), imgUrl(), asMedia(), waLink(), safeHex()
  components/              Img (plain <img> + srcset + focal point), ProductCard, RichText
  app/(frontend)/          public site: /, /products, /products/[slug], /stories, /stories/[slug], /about
  app/(payload)/           Payload admin + API routes (generated — avoid editing)
  app/healthz/route.ts     health check (app + DB), used by Docker and deploy
  app/sitemap.ts, robots.ts
deploy/Caddyfile           reverse proxy, HTTPS, long cache for /api/media/file/*
scripts/                   server-setup.sh, backup.sh, restore.sh
.github/workflows/         ci.yml, deploy.yml
docs/OPERATIONS.md         full DevOps runbook
```

## Content model

- **products** (drafts enabled): title, price (IDR number), unit, summary (≤180), description (rich text), image (required), gallery, specs[{label,value}], shopLinks[{label,url}] (overrides site-wide shops), category, badges (bestseller|new|halal|limited), featured (shows on home), order, slug.
- **categories**: title, order, slug.
- **stories** (drafts enabled): culture/heritage articles — title, excerpt, cover, content, relatedProducts, publishedAt (auto-set on publish), slug.
- **media**: alt (required), image sizes in WebP, focal point.
- **users**: auth with lockout; role `admin` (everything) or `editor` (content only; cannot edit Settings or users).
- **settings** global (admin-only update): brandName, tagline, logo, footerNote, five theme colours (`colorPrimary`, `colorAccent`, `colorInk`, `colorPaper`, `colorDeep`, hex-validated), whatsapp (digits only, e.g. `6281234567890`), whatsappMessage (`{produk}` placeholder), email, phone, address, hours, mapsUrl, shops[], socials[], seoTitle, seoDescription, ogImage.
- **home** global: hero (heroTitle — each line break becomes a display line), heroText, heroImage, CTA labels, promises[≤4], section titles, about teaser, testimonials[≤6].
- **about** global: title, intro, image, content, milestones[{year,text}] (rendered as a timeline).

## Conventions and rules

### Schema changes (most important)
After editing anything in `collections/` or `globals/`:
1. `npm run generate:types`
2. `npm run payload migrate:create <descriptive-name>`
3. Commit the new files in `src/migrations/`.

Production runs migrations on boot via `prodMigrations`. CI fails if the schema changed without a migration. **Never** point production at a database created by `npm run dev` — dev mode uses schema push and production will then prompt interactively about data loss and hang.

### Rendering
- The frontend layout sets `export const dynamic = 'force-dynamic'`: every page renders on request so admin edits appear instantly and `next build` never touches the DB. Keep it that way unless deliberately adding caching (then add `revalidatePath` hooks and make sure the Docker build still works without a DB).
- Fetch data with the Payload Local API via `payloadClient()` in server components. Do not call the REST API from the frontend.
- Upload fields may be an ID or a populated object — use `asMedia()` / `imgUrl()` / `<Img>`; query with enough `depth` (1 for lists, 2 for detail pages with relations).
- Public reads of products/stories only return published docs (`publishedOrLoggedIn`). Anything new with drafts should use the same access helper.

### Theming
Colours are not hard-coded: `layout.tsx` injects the Settings colours as CSS variables (`--primary`, `--accent`, `--ink`, `--paper`, `--deep`), always passed through `safeHex()`. Derived tones (`--muted`, `--line`, `--tint`) use `color-mix()`. New styles must use these variables so admin colour changes keep working.

### Design language (keep consistent)
- Fonts: **Rozha One** (display, weight 400 only) + **Albert Sans** (body 400/500/700), loaded via Google Fonts `<link>`.
- Signature shape: the **arch** (`.arch`, `.arch-soft`, `.arch-small`, `.arch-wide`) — a gapura-like rounded-top frame for hero/story/feature images. Product tiles use a plain small radius; don't put arches on everything.
- Left-aligned layouts, hairline dividers (`--line`), no drop shadows on cards, no gradients, no all-caps eyebrow labels, no "→" on links.
- Motion: only the hero title line reveal; respect `prefers-reduced-motion`.
- Mobile first-class: check 390px width; buttons ≥ 40–48px tall.
- Copy: plain, sentence-case Indonesian; buttons say what happens ("Pesan lewat WhatsApp", "Lihat produk").

### Code style
- TypeScript strict; import types from `@/payload-types`.
- Path aliases: `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`. Seed scripts import the config relatively (`../payload.config`).
- Admin labels and descriptions in Indonesian, written for a non-technical shop owner.
- Keep the WhatsApp ordering flow working everywhere — it is the primary conversion path for UMKM clients.

## Deployment summary

- `Dockerfile` stages: `deps` → `builder` → `runner` (standalone, user 1001, healthcheck on `/healthz`) and `tools` (full source, for `docker compose run --rm tools npm run seed`).
- `docker-compose.yml`: `app` + `caddy`; `./data` and `./media` are bind-mounted and must be owned by uid 1001.
- Deploy workflow: build → push `ghcr.io/<owner>/<repo>:<sha>` → SSH → `scripts/backup.sh` → update `IMAGE=` in `.env` → `docker compose up -d` → wait for `/healthz`.
- Secrets: `VPS_HOST`, `VPS_SSH_KEY` in the GitHub `production` environment.
- Details, rollback and troubleshooting: `docs/OPERATIONS.md`.

## Known gaps / ideas for next work

- No live preview of drafts in the admin yet (Payload live preview could be added).
- Indonesian only; English could be added with Payload `localization` + a `[locale]` route segment.
- No cart/checkout by design — orders go to WhatsApp or marketplaces.
- No automated tests yet (good candidates: `lib/format.ts` unit tests, a Playwright smoke test of main routes + `/healthz`).
- Email adapter not configured (password reset emails print to console).

## Before finishing any task

1. `npm run typecheck`
2. If schema changed: types regenerated + migration created and committed.
3. `npm run build` passes.
4. Check the affected page at desktop and ~390px mobile width.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
