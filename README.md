# gravadox.dev

Personal portfolio and blog — built with Next.js 15, React 19, TypeScript, Prisma, PostgreSQL, and Tailwind v4.

## Stack

- **Framework:** Next.js 15 (App Router) with Turbopack
- **UI:** React 19, Tailwind CSS v4, shadcn/ui, Framer Motion
- **3D:** Three.js, Spline
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT sessions with `jose` (httpOnly cookie)
- **i18n:** i18next — English (`en`) and German (`de`)
- **Email:** Nodemailer (contact form)

## Routes

| Path | Description |
|---|---|
| `/` | Home — 3D black hole, GitHub profile, typed intro |
| `/blog` | Blog post listing |
| `/blog/[slug]` | Blog article (block-based renderer) |
| `/projects` | Projects / apps listing |
| `/projects/[slug]` | Project article (block-based renderer) |
| `/about` | About page |
| `/contact` | Contact form + social links |
| `/admin` | Admin dashboard (protected) |

## Development

Copy the environment template and fill in values:

```bash
cp example.env .env
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `ADMIN_SECRET` | Password for `/admin` login |
| `SESSION_SECRET` | Secret for signing JWT session tokens |
| `GITHUB_TOKEN` | GitHub personal access token (contributions graph) |
| `NEXT_PUBLIC_ABOUT_EN` | English about/intro text |
| `NEXT_PUBLIC_ABOUT_DE` | German about/intro text |

Install and run:

```bash
npm install       # also runs prisma generate via postinstall
npm run dev       # dev server on http://localhost:3000
```

**Prisma:**

```bash
npx prisma migrate dev   # apply schema changes
npx prisma studio        # browse DB in browser
```

**Other scripts:**

```bash
npm run build    # production build
npm run lint     # ESLint
```

## Content Model

Content is structured as `Post` (blog) or `App` (project) records, each containing an ordered array of `Block` records. Blocks are polymorphic — the `type` enum (`TEXT`, `IMAGE`, `VIDEO`, `CODE`, `EMBED`, `BUTTON`, `CANVAS`) determines how the `data: Json` field is interpreted.

## Admin

Protected by JWT cookie set at `/admin/login`. The `ADMIN_SECRET` env var is the password. All content creation and editing is done through the block editor at `/admin`.

## License

See [LICENSE](LICENSE).
