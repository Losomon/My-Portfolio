# Solomon Mwangi — Software Engineer Portfolio

A modern, interactive developer portfolio showcasing my work, technical capabilities, and approach to building digital experiences.

Built with **Next.js, React, TypeScript, and Tailwind CSS**, the portfolio combines modern web technologies, immersive 3D visuals, custom animations, and a server-side contact system with distributed rate limiting and spam protection.

**Live Website:** [solo-portfolio-six.vercel.app](https://solo-portfolio-six.vercel.app/)

---

## Overview

This portfolio is designed to be more than a collection of projects. It provides an interactive experience where visitors can explore my work, understand my technical interests, and get in touch.

The implementation focuses on:

- Interactive and responsive user experiences.
- Smooth transitions and motion design.
- Real-time 3D graphics and WebGL.
- Performance-conscious visual effects.
- Secure server-side contact processing.
- Maintainable, component-based architecture.

## Features

### Interactive Experience
- Smooth scrolling powered by GSAP and Lenis.
- Custom scroll-triggered animations and transitions.
- Interactive 3D scenes using Three.js and WebGL.
- Draggable 3D silhouette artwork.
- Particle field effects powered by Web Workers.
- Responsive layouts across desktop, tablet, and mobile.

### Visual Design
- Custom animation sequences.
- Immersive visual elements and interactive components.
- Tailwind CSS v4 styling.
- Responsive navigation and page layouts.

### Contact System
A custom server-side contact system designed to handle visitor inquiries reliably.

- Next.js API route for server-side request processing.
- Server-side field validation.
- Formspree integration for email delivery.
- Upstash Redis for distributed rate limiting.
- Atomic duplicate-submission prevention.
- Honeypot spam detection.
- SHA-256 hashing for duplicate identifiers.
- Graceful handling of Redis failures.
- Distinct frontend error states.

**Protection configuration:**
- Rate limit: 5 submissions per IP address per minute.
- Duplicate prevention: 20-second lock.
- Excessive requests: HTTP 429.
- Invalid submissions: HTTP 400.

The implementation has passed nine production verification checks.

## Technology Stack

| Category | Technologies |
|---|---|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | GSAP, Anime.js, Framer Motion |
| Smooth Scrolling | Lenis |
| 3D Graphics | Three.js, WebGL |
| Background Processing | Web Workers |
| Backend | Next.js Route Handlers |
| Email Delivery | Formspree |
| Distributed Storage | Upstash Redis |
| Deployment | Vercel |

## Architecture

The application uses Next.js for both the frontend and server-side request processing.

### Contact request flow

```text
Visitor
   |
   v
Contact Form
   |
   v
Next.js API Route
   |
   v
Input Validation
   |
   v
Spam & Security Checks
   |
   +------> Upstash Redis
   |          |
   |          +-- Rate Limiting
   |          +-- Duplicate Prevention
   |
   v
Formspree
   |
   v
Email Notification
```

Upstash Redis provides shared protection across Vercel serverless instances. Formspree handles email delivery independently of the frontend.

If Redis becomes unavailable, the contact system uses a fail-open strategy: submissions can continue, although distributed protection is temporarily degraded.

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
cd YOUR_PROJECT_DIRECTORY
```

Replace the placeholders with your actual GitHub repository URL and directory name.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
FORMSPREE_ENDPOINT=your_formspree_endpoint

UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_redis_token
```

| Variable | Required | Purpose |
|---|---|---|
| `FORMSPREE_ENDPOINT` | Yes | Formspree email delivery endpoint |
| `UPSTASH_REDIS_URL` | No | Upstash Redis REST URL |
| `UPSTASH_REDIS_TOKEN` | No | Upstash Redis authentication token |

Redis credentials must remain server-side. Never expose them through `NEXT_PUBLIC_` variables or commit `.env.local` to Git.

The contact form can continue accepting submissions when Redis is unavailable, but distributed rate limiting and duplicate protection will be degraded.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application will automatically reload as you modify the source files.

## Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

## Production Verification

The contact API has a dedicated production verification script.

Run it against the deployed application:

**PowerShell:**

```powershell
$env:PRODUCTION_URL="https://solo-portfolio-six.vercel.app"
node scripts/verify-contact.mjs
```

The verification suite checks:

- Input validation.
- Empty-field rejection.
- Field-level validation errors.
- Honeypot spam detection.
- Successful submission.
- Duplicate prevention.
- Rate limiting.
- Retry-After response headers.
- Error-response security.

**Latest verification:** 9 out of 9 checks passed.

Note: Running production verification sends requests to the live endpoint and can consume rate-limit capacity.

## SEO & Domain Configuration

Canonical URLs, Open Graph tags, structured data, the sitemap and `robots.txt` all read from a single public environment variable.

```env
NEXT_PUBLIC_SITE_URL=https://solomonmwangi.com
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | No | Canonical origin for canonical links, social previews, `sitemap.xml` and `robots.txt`. Defaults to the current Vercel URL. |

Generated routes:

- `/sitemap.xml` — every page and case study.
- `/robots.txt` — crawl rules plus sitemap reference.
- `/opengraph-image` — 1200×630 social card.
- `/work/[slug]/opengraph-image` — per-case-study social card.

Structured data (`Person` and `WebSite` JSON-LD) is rendered from the root layout.

### Moving to a custom domain

1. Set `NEXT_PUBLIC_SITE_URL` in Vercel (Production and Preview) to the new origin.
2. Add the domain in the Vercel project settings and point DNS at it.
3. Redeploy, then submit `https://<domain>/sitemap.xml` in Google Search Console.

No component changes are required; every canonical URL, social tag, and sitemap entry follows the variable.

## Deployment

The portfolio is deployed on [Vercel](https://vercel.com/).

To deploy your own instance:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy the application.
5. Verify the production contact endpoint.

For additional information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Project Goals

This project represents my approach to software engineering: combining functional implementation, thoughtful architecture, interactive design, and practical problem-solving.

I continue to improve the portfolio as I explore new technologies and build software solutions.

## Contact

**Solomon Mwangi**
Software Engineer | Full-Stack Development

- **Portfolio:** [solo-portfolio-six.vercel.app](https://solo-portfolio-six.vercel.app/)
- **GitHub:** [github.com/Losomon](https://github.com/Losomon)
- **LinkedIn:** [Solomon Mwangi](https://linkedin.com/in/solomon-mwangi-73b217352)

---

*Designed and developed by Solomon Mwangi.*