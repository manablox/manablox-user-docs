# Contributing

## Licensing

Everything in this repository is [MIT licensed](./LICENSE). Contributions are accepted
under the [Contributor Licence Agreement](./CLA.md): a contribution is licensed under MIT,
and the maintainer may relicense it. You keep the copyright in what you wrote.

Accepting it is one flag: sign off every commit with `git commit -s`, which appends

```
Signed-off-by: Your Name <your.email@example.com>
```

A pull request whose commits are signed off is your acceptance for those commits. If your
employer holds the rights to your work, say so in the pull request before the first merge.

Third-party material (an image, a diagram, a quoted text) needs its licence named in the
pull request.

## Setup

The site is [Astro Starlight](https://starlight.astro.build); its theme,
`@manablox/docs-theme`, is a package of the CMS repository
([manablox-cms](https://github.com/manablox/manablox-cms)). In development it installs from
the local registry of the CMS stack, so start that first:

```sh
# in manablox-cms
pnpm dev:services  # postgres, valkey, minio, mailpit and the registry, verdaccio
pnpm dev:publish   # every @manablox/* package, into that registry
```

Then, here:

```sh
pnpm dev:up        # installs and starts the dev server: http://localhost:3008
pnpm dev:logs      # follow it
pnpm dev:down      # stop it; pnpm dev:reset also removes .astro/ and dist/
```

`scripts/dev.sh` creates the gitignored `.npmrc` with
`@manablox:registry=http://localhost:4873/` the first time, so a `pnpm install` on the
host uses the same registry. Without Docker: write that line into `.npmrc` yourself, then
`pnpm install` and `pnpm dev`.

The stack's install writes `node_modules` with the container's store, so a later
`pnpm install` on the host wants to rebuild it: answer yes, or stay with one of the two.

A newer build of the theme under the same version needs a fresh install:
`pnpm cache delete '@manablox/*' && pnpm update '@manablox/*'`.

Node 24 (`.node-version`) and pnpm (pinned by `packageManager`). VS Code users get the
recommended extensions prompt; Biome formats on save.

## Writing pages

The pages live in `src/content/docs/`, one folder per section (`getting-started/`,
`your-project/`, `admin/`, `website/`, ...); a folder's `index.md` is the section's page.
Adding a page means a markdown file there with `title` and `description` frontmatter and a
`sidebar` entry in `astro.config.mjs`.

- Two audiences: developers who are new to running a CMS, and editors who only use the admin. Admin pages use click paths (`Settings > Users`) and no code.
- Everything happens in a project made by `manablox create`: `pnpm dev`, `pnpm migrate`, `pnpm exec manablox ...`. No paths into the Manablox source, no `git clone`.
- Explain a technical word the first time a page uses it, and say what the reader should see after each step.
- Describe what is, not what changed: nothing is released yet. `pnpm docs:words` fails on wording that tells a history and on names Manablox removed.
- Plain ASCII, no indented lines outside code fences, one line per list item.
- Commands, options and defaults match the `manablox` command of the release the guide describes (its README in manablox-cms, `packages/cli`).

Pages link to each other by file (`./create-your-cms.md`, `../admin/assets.md`); the theme
turns those into site routes and fails the build on a link that leaves
`src/content/docs/`. How Manablox is built and extended in depth belongs in the developer
documentation (https://dev.manablox.io); link there with a full URL.

A ```` ```mermaid ```` fence renders as a diagram in the browser (`astro-mermaid`) and
follows the light/dark toggle.

## Checks

```sh
pnpm check       # everything CI runs before the image: the lines below in order
pnpm lint        # Biome
pnpm knip        # unused files and dependencies; configured in knip.jsonc
pnpm docs:words  # wording that describes a change, and removed names
pnpm typecheck   # astro check: the frontmatter of every page and the config
pnpm build       # the static site in dist/
pnpm links       # every internal link in dist/ resolves
```

The links into the developer documentation (`https://dev.manablox.io/...`) point at another
repository, so `pnpm check` leaves them out. After changing one, build manablox-dev-docs
next to this repository and run

```sh
pnpm build && DEV_DOCS_DIST=../manablox-dev-docs/dist pnpm links:cross
```

which fails on a page or `#fragment` that the developer documentation does not have.
`DEV_DOCS_URL=https://dev.manablox.io` checks the deployed pages instead.

The pre-commit hook runs Biome on staged files.

## Conventions

- Commit messages: `type(scope): what` - `docs`, `fix`, `feat`, `chore`. The body says why.
- A page follows the product: a change to a command or a screen in another Manablox repository comes with the change to its page here.

## The Manablox repositories

The user guide is one of several repositories. They share one set of conventions:

- Every package and app has the same version; a release bumps them together.
- Dependencies between the repositories go through npm package names (`@manablox/*`) only: npmjs in CI and production, the CMS stack's local registry in development. No repository reaches into another's folders.
- pnpm workspace, Node 24, Biome, TypeScript through `@manablox/config-typescript` where there is TypeScript to check (here `astro check` with Astro's own config).
- Each repository has a `README.md`, `LICENSE`, `CHANGELOG.md`, `.editorconfig`, `.gitignore` and `.env.example` files; the public ones also `CONTRIBUTING.md` and `CLA.md`.
- A development docker setup in `docker/compose.dev.yml`, driven by `scripts/dev.sh` as `pnpm dev:up`, `dev:down`, `dev:logs`, `dev:reset` and `dev:services`, on ports of its own so every repository's stack runs side by side. This one uses 3008.
- `scripts/docker-build.sh [--tag <tag>] [--push]` builds the production image from `docker/Dockerfile`, as `pnpm docker:build`.
- `.github/workflows/ci.yml` runs the checks, the build and the image build; `release.yml`, dispatched by hand, pushes the image to `ghcr.io/manablox`.
- No compatibility shims, deprecated APIs or dead files: each repository passes its checks from a fresh clone.
