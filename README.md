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
validates the submission, applies rate limiting and spam protection, and emails the
inquiry to `solomboni5@gmail.com` through [Resend](https://resend.com).

No email is sent unless the visitor's mail app is irrelevant — submission happens
server-side, so visitors do not need any email application installed.

### Environment variables

Set these in `.env.local` (development) or your host's environment settings
(production). They are server-side only and are never exposed to the browser:

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key from https://resend.com/api-keys |
| `CONTACT_TO_EMAIL` | no | Recipient address (defaults to `solomboni5@gmail.com`) |
| `RESEND_FROM_EMAIL` | yes | Sender on a domain verified in Resend. `onboarding@resend.dev` works for testing but only delivers to the Resend account owner's email. |

The form shows a success message only after the Resend API accepts and queues the
message; if sending fails, the visitor sees an error and their entries are preserved.
