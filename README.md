# Dragons of Mugloar

Monorepo with three packages:

- `dragons-api`: shared, typed client for the Dragons of Mugloar API
- `dragons-cli`: plays a full game automatically from the terminal. See [dragons-cli/README.md](dragons-cli/README.md).
- `dragons-web`: React UI for playing the game in the browser. See [dragons-web/README.md](dragons-web/README.md).

## Running

Instructions for running each app, with Bun or Docker, are in its README:

- CLI: [dragons-cli/README.md](dragons-cli/README.md)
- Web: [dragons-web/README.md](dragons-web/README.md)

## Development

From the repo root:

```bash
bun check
```

This runs lint, format check, typecheck, and tests for every package. Run `bun run fix` to auto-fix lint and formatting issues.
