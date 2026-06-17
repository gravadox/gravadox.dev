# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack
npm run build     # Production build with Turbopack
npm run lint      # Run ESLint
```

No test suite is configured. Prisma client is auto-generated on `npm install` via the `postinstall` hook.

**Prisma:**
```bash
npx prisma migrate dev   # Apply schema changes
npx prisma studio        # Browse DB in browser
npx prisma generate      # Regenerate client manually
```

## Environment Variables

Copy `example.env` to `.env` and fill in:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_SECRET` | Password for the admin login endpoint |
| `SESSION_SECRET` | Secret for signing JWT session tokens |
| `GITHUB_TOKEN` | GitHub personal access token for contributions API |
| `NEXT_PUBLIC_ABOUT` | About page text rendered directly |

## Architecture

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript + Prisma + PostgreSQL + Tailwind v4

### Data Layer

- `lib/db.ts` — singleton Prisma client (globalThis pattern for dev HMR safety)
- `lib/auth.ts` — JWT session management via `jose`; `isAdmin()` and `requireAdmin()` for server-side auth checks
- `actions/` — all Server Actions; `admin.ts` for CRUD on posts/apps, `cv.ts` for CV management, `getPublicBlog.ts` / `getPublicApps.ts` for public reads

### Content Model

Content is structured as `Post` or `App` records, each containing an ordered array of `Block` records. Blocks are polymorphic — the `type` enum (`TEXT`, `IMAGE`, `VIDEO`, `CODE`, `EMBED`, `BUTTON`, `CANVAS`) determines how `data: Json` is interpreted. Type definitions for each block's data shape live in `types.ts`.

### Admin Area

- `proxy.ts` — middleware matcher for `/admin/**`; redirects unauthenticated requests to `/admin/login`
- `app/admin/login/api/route.ts` — POST endpoint; compares hashed `ADMIN_SECRET` with timing-safe equality, sets an `httpOnly` `admin` JWT cookie on success
- Admin pages under `app/admin/` handle creating/editing posts (`post/`), apps (`app/`, `edit/app/[id]/`), and CV management (`cv/`)

### Internationalization

- Languages: `en` (default) and `de`
- Translation files: `public/locales/{en,de}/common.json`
- `components/lang/i18n.ts` — i18next init (client-side, bundled translations)
- `components/lang/I18nProvider.tsx` — wraps the app; initial language is read from the `i18next` cookie set by the language switcher
- Use the `useAppTranslation` hook in client components for translations

### External APIs

- `app/api/github/contributions/route.ts` — proxies GitHub GraphQL API for contribution calendar; cached for 500s
- `app/api/github/profile/route.ts` — proxies GitHub REST API for profile data
- Image remotePatterns in `next.config.ts` allow `avatars.githubusercontent.com` and `s5x6jha3wl.ufs.sh` (UploadThing CDN)

### UI

- `components/ui/` — shadcn/ui primitives
- `components/3d/` — Three.js / Spline 3D components
- `components/blog/` — block renderers (text, image, video, code, canvas, button, embed) used in both blog article and project article pages
- Fonts: Geist Sans (body) + VT323 (accent/display)
