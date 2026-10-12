# dragons-cli

Plays a full game as a cmd-line tool.

Tech stack: Bun, TS

## Running locally

### Docker

Run from this folder. The build uses the repo root (`..`) as its context, since the image needs the shared `bun.lock` and `dragons-api`:

```bash
$ docker build -f Dockerfile -t dragons-cli ..
```

```bash
$ docker run --rm -t dragons-cli
```

### Bun

To run locally you need [Bun](https://bun.com/docs/installation) 1.4.3 or newer. Then, from this folder:

```bash
$ bun install
$ bun start
```

## Options

| Flag     | Values                                  | Default   |
| -------- | --------------------------------------- | --------- |
| `--ads`  | `optimal`, `cheapest`, `most-expensive` | `optimal` |
| `--shop` | `optimal`, `cheapest`, `most-expensive` | `optimal` |

With Docker, put the flags after the image name:

```bash
docker run --rm -t dragons-cli --ads cheapest --shop most-expensive
```

With Bun:

```bash
bun start --ads cheapest --shop most-expensive
```

## Configuration

The CLI reads `API_URL` from the environment (see `.env.example`). It defaults to `https://dragonsofmugloar.com/api/v2`. With Docker, pass it with `-e`:

```bash
docker run --rm -t -e API_URL=https://dragonsofmugloar.com/api/v2 dragons-cli
```
