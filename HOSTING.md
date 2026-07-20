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

## Create a production build

```bash
npm ci
npm run build
```

The verified production output is generated in `dist/`.

## Hosting choices

### Cloudflare Workers

The production build generates a Cloudflare-compatible Worker in
`dist/server/index.js` and static assets under `dist/assets/`.

### Vercel or another Node host

Connect the repository, select Node.js 20+, use `npm ci` for installation,
and `npm run build` as the build command. If your provider does not recognize
Vinext automatically, deploy the generated Cloudflare Worker output or host
the project using Cloudflare Workers.

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

