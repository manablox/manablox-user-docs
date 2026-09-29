# Manablox user guide

The user guide of [Manablox](https://github.com/manablox/manablox-cms), published at
**https://docs.manablox.io**: [Astro Starlight](https://starlight.astro.build) pages that
explain how to use Manablox, for developers who are new to running a CMS and for editors
who only use the admin. It starts from the `manablox` command (`manablox create`,
`manablox frontend`), never from a clone of the Manablox source.

How Manablox is built and extended in depth is the developer documentation,
https://dev.manablox.io, in its own repository.

## Development

Node 24 and pnpm (pinned by `packageManager`), plus Docker for the development stack. The
theme, `@manablox/docs-theme`, comes from the CMS repository; in development it installs
from the local registry of the CMS stack (`pnpm dev:services` and `pnpm dev:publish` in
manablox-cms).

```sh
pnpm dev:up      # install and start the dev server in docker: http://localhost:3008
pnpm check       # lint, dead code, wording, astro check, build, link check
```

`scripts/dev.sh` creates the gitignored `.npmrc` that points `@manablox/*` at that registry
(`@manablox:registry=http://localhost:4873/`); inside the container the install reaches it
as `verdaccio:4873` on the docker network `manablox-registry`. CI and releases install from
npmjs. [CONTRIBUTING.md](./CONTRIBUTING.md) has the details and the rules for writing pages.

| Command | What it does |
| --- | --- |
| `pnpm dev:up` | Build the dev image, install and start `astro dev` on port 3008 |
| `pnpm dev:logs` | Follow the dev server's log |
| `pnpm dev:down` | Stop the stack |
| `pnpm dev:reset` | Stop the stack, delete its containers and volumes, remove `.astro/` and `dist/` |
| `pnpm dev:services` | Check that the CMS stack's registry answers; the guide has no services of its own |
| `pnpm dev` | The dev server on the host, without Docker |
| `pnpm build` | The static site in `dist/` |
| `pnpm preview` | Serve `dist/` on port 3008 |
| `pnpm lint` / `pnpm format` | Biome |
| `pnpm knip` | Unused files and dependencies |
| `pnpm docs:words` | Wording that describes a change, and names Manablox removed |
| `pnpm typecheck` | `astro check` |
| `pnpm links` | Every internal link in `dist/` resolves |
| `pnpm links:cross` | Every link into the developer documentation resolves, against its build in `DEV_DOCS_DIST` (or `DEV_DOCS_URL`); see CONTRIBUTING |
| `pnpm docker:build` | The production image |

## Layout

| Path | What lives there |
| --- | --- |
| `src/content/docs/` | The pages, one folder per section; a folder's `index.md` is the section's page |
| `astro.config.mjs` | The title, the site URL and the sidebar; everything else comes from `@manablox/docs-theme` |
| `public/` | Files served as they are (the favicon) |
| `scripts/` | The wording and link checks, the dev and image scripts |
| `docker/` | The dev stack (`compose.dev.yml`, `Dockerfile.dev`) and the production image (`Dockerfile`, `nginx.conf`) |

## Image and release

`pnpm docker:build` builds `ghcr.io/manablox/user-docs:<version>` from `docker/Dockerfile`:
the built site behind nginx, with no runtime dependency on a Manablox instance. With the
development `.npmrc` present it installs `@manablox/*` from the local registry.

```sh
pnpm docker:build                          # ghcr.io/manablox/user-docs:0.50.0
pnpm docker:build --tag test
pnpm docker:build --prefix my.registry/me --push
DOCS_SITE_URL=https://staging.example.com pnpm docker:build
docker run --rm -p 8080:80 ghcr.io/manablox/user-docs:0.50.0
```

`DOCS_SITE_URL` sets the origin of the canonical links and the sitemap (default
`https://docs.manablox.io`), `DOCS_BASE_PATH` a base path. CI builds the image on every
change; `.github/workflows/release.yml`, dispatched by hand after the CMS release, pushes
the version tags.

## Licence

[MIT](./LICENSE). Contributions come in under the [CLA](./CLA.md).
