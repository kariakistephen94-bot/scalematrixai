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

Video playback, scheduling, and legal content are placeholders. Application data stays in browser memory and is not submitted.
