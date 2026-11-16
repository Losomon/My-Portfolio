# Solomon Mwangi — Portfolio

A modern full-stack developer portfolio built with Next.js, React, TypeScript, and Tailwind CSS. Features custom GSAP animations, Three.js WebGL scenes, and a working contact system with rate limiting and spam protection.

## Features

- Smooth scroll animations with GSAP and Lenis
- Interactive 3D WebGL scenes using Three.js
- Particle field effects with Web Workers
- Draggable 3D silhouette artwork
- Responsive design with Tailwind CSS v4
- Working contact form with spam protection
- Formspree integration for email notifications

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Animation:** GSAP, Anime.js, Framer Motion, Lenis smooth scroll
- **3D:** Three.js
- **Backend:** Next.js API routes, Formspree

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Contact form

The contact form on `/contact` posts to the `app/api/contact` route handler, which
validates the submission, applies rate limiting and spam protection, and delivers the
inquiry through [Formspree](https://formspree.io).

Submission happens server-side, so visitors do not need any email application
installed.

### Environment variables

Set these in `.env.local` (development) or your host's environment settings
(production). They are server-side only and are never exposed to the browser:

| Variable | Required | Description |
| --- | --- | --- |
| `FORMSPREE_ENDPOINT` | yes | Formspree form URL. Create one at https://formspree.io and set the notification recipient in the Formspree dashboard. |
| `UPSTASH_REDIS_URL` | no | Upstash Redis REST URL. Create a free database at https://upstash.com. |
| `UPSTASH_REDIS_TOKEN` | no | Upstash Redis REST token. Leave unset to disable distributed protection (submission still works, but rate limiting and duplicate prevention fall back to local-only behavior). |

The form shows a success message only after Formspree accepts the submission; if
sending fails, the visitor sees an error and their entries are preserved.

### Distributed protection

Rate limiting and duplicate prevention are backed by Upstash Redis so they work
across Vercel serverless instances. Limits: 5 submissions per IP per minute
(sliding window); duplicate submissions blocked for 20 seconds. If Redis is
temporarily unavailable, submissions are allowed through and a sanitized
operational warning is logged — delivery is prioritized over blocking.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Live

https://solo-portfolio-six.vercel.app/
