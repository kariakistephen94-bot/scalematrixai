# ScaleMatrix AI

A local Next.js App Router landing page.

## Development

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000.

## Project structure

- `app/page.jsx` — assembles the landing page sections.
- `app/layout.jsx` — page metadata, fonts, and root layout.
- `app/globals.css` — responsive styles and visual theme.
- `components/` — header, hero, results, process, application, footer, and dialogs.
- `components/SiteInteractions.jsx` — client-side interaction lifecycle.
- `lib/interactions.js` — form progression and dialog event handlers, with cleanup.
- `public/` — logo and favicon SVG assets.

## Commands

- `npm run dev` — local development server.
- `npm run build` — verify and create a production build.
- `npm start` — serve the production build.
- `npm run format` — format project files.
- `npm run format:check` — check formatting without changing files.

## Preview integrations

Video playback and legal content are placeholders. Booking is embedded with Calendly at https://calendly.com/kariakistephen/30min. Completed applications are sent through the server-side Resend API route.

## Application emails (Resend)

Copy `.env.example` to `.env.local`. Set `RESEND_API_KEY`. Optionally set `RESEND_FROM_EMAIL` (a verified sender) and `APPLICATION_TO_EMAIL` (your receiving inbox); defaults are `ScaleMatrix AI <applications@scalematrixai.com>` and `stephen@scalematrixai.com`. Restart the development server after changing environment variables. These values are server-only; do not prefix them with `NEXT_PUBLIC_`.

The contact step submits four fields (name, email, phone, company) to `POST /api/applications`, then opens embedded Calendly immediately. Revenue and service-focus questions have been removed. Email delivery runs independently: a missing key, provider outage, or timeout cannot block booking. The page reports email delivery only after Resend accepts it. Calendly receives name/email prefill. The applicant address is set as Reply-To. No confirmation email is sent to the applicant. Identical submissions within an hour share a Resend idempotency key. Live delivery requires your Resend configuration.

## Embedded booking

`components/CalendlyBooking.jsx` loads the official Calendly inline widget only when an application reaches the booking step. Visitors select a time and confirm on the same page. The application expands to fit the calendar, with a taller mobile layout. An optional external link is available if a browser blocks the widget. Booking confirmation is shown only after a Calendly event from the embedded iframe. This UI confirmation is not a server-side booking record or webhook integration.

## Local and production form origins

`ALLOWED_ORIGINS` is a server-only, comma-separated list in `.env.local`. It includes localhost:3000, 127.0.0.1:3000, and the HTTP/HTTPS versions of scalematrixai.com and www.scalematrixai.com. Copy the same variable into your production host's environment configuration and restart or redeploy that server for it to take effect. Origin matching remains exact; unrelated domains are not permitted.

## Mobile and positioning

The page presents ScaleMatrix AI as a lead-generation and outreach agency for growing businesses, with an outcome-led headline about qualified sales meetings. Mobile layouts support narrow phones, stacked contact inputs, readable input sizes without iOS zoom, touch-friendly buttons, and an inline Calendly calendar. Production environment variables must be configured on the production host separately from `.env.local`; this repository does not automatically deploy changes.
