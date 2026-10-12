# dragons-web

React UI for playing in the browser.

Tech stack: React 19, Vite, TS, Zustand

## Running locally

### Docker

Run from this folder. The build uses the repo root (`..`) as its context, since the image needs the shared `bun.lock` and `dragons-api`:

```bash
$ docker build -f Dockerfile -t dragons-web ..
```

```bash
$ docker run --rm -p 8080:8080 dragons-web
```

Then open [http://localhost:8080](http://localhost:8080).

### Bun

To run locally you need [Bun](https://bun.com/docs/installation) 1.4.3 or newer. Then, from this folder:

```bash
$ bun install
$ bun dev
```

Open the URL that Vite prints ([http://localhost:5173](http://localhost:5173) by default).

## Smoke test

One Playwright test builds the app, opens it in Chromium and starts a game against the real API. It needs Node installed, plus a one-time browser download:

```bash
$ bunx playwright install chromium
$ bun run test:e2e
```

Since it depends on the real API, it isn't part of `bun check`.
