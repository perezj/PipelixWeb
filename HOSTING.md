# Hosting the Pipelix website

This package contains the complete source for the Pipelix marketing website.
It is a React/Vinext application, so it is not limited to one HTML file.

## Run locally

Install Node.js 20 or newer, then run:

```bash
npm ci
npm run dev
```

Open the local address printed in the terminal.

## Create a Cloudflare Pages build

```bash
npm ci
npm run build
```

The static production site is generated in `dist/client/`.

## Hosting choices

### Cloudflare Pages

Create a Pages project from this repository with:

- Build command: `npm run build`
- Build output directory: `dist/client`

Cloudflare Pages will deploy the static site and the `functions/api/contact.ts`
endpoint. In **Settings → Variables and Secrets**, add these encrypted secrets:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` (for example, `Pipelix Website <hello@yourdomain.com>`)
- `CONTACT_TO_EMAIL` (the inbox that receives contact requests)

`RESEND_FROM_EMAIL` must use a domain verified in Resend. Copy
`.dev.vars.example` to `.dev.vars` for local secret values; do not commit it.

### Vercel or another Node host

Connect the repository, select Node.js 22.13+, use `npm ci` for installation,
and `npm run build` as the build command. Deploy `dist/client` as static files.

## Contact form

The current contact form prepares an email to `hello@pipelix.ai` in the
visitor's email application. Change that address in `app/page.tsx` if needed.
For direct server-side submissions, connect the form to your CRM, email API,
or a form service before launch.

## Main files to customize

- `app/page.tsx` — website content and interactions
- `app/globals.css` — layout, colors, responsive styling, and animation
- `app/layout.tsx` — page title and metadata
- `public/favicon.svg` — Pipelix logo asset
