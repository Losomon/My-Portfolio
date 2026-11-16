This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contact form

The contact form on `/contact` posts to the `app/api/contact` route handler, which
validates the submission, applies rate limiting and spam protection, and delivers the
inquiry through [Formspree](https://formspree.io) to `solomboni5@gmail.com`.

Submission happens server-side, so visitors do not need any email application
installed.

### Environment variables

Set these in `.env.local` (development) or your host's environment settings
(production). They are server-side only and are never exposed to the browser:

| Variable | Required | Description |
| --- | --- | --- |
| `FORMSPREE_ENDPOINT` | yes | Formspree form URL, e.g. `https://formspree.io/f/xrpqpdzr`. Create one at https://formspree.io and set the notification recipient in the Formspree dashboard. |

The form shows a success message only after Formspree accepts the submission; if
sending fails, the visitor sees an error and their entries are preserved.
