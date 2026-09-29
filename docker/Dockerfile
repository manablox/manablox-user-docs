# syntax=docker/dockerfile:1.7

# The production image of the user guide (docs.manablox.io): the site built to plain files,
# served by nginx. It has no runtime dependency on a Manablox instance.
#
#   MANABLOX_REGISTRY  optional: the registry `@manablox/*` installs from, for a build
#                      against the CMS stack's local registry (`scripts/docker-build.sh`
#                      passes it from `.npmrc`). Unset, everything comes from npmjs.
#   DOCS_SITE_URL      optional: the origin for canonical links and the sitemap
#                      (default https://docs.manablox.io, from astro.config.mjs)
#   DOCS_BASE_PATH     optional: the base path when the guide is not served at `/`

FROM node:24-bookworm-slim AS build
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH
RUN corepack enable
WORKDIR /app
# `CI` keeps pnpm non-interactive: without it, an install that wants to replace a
# `node_modules` directory aborts rather than prompting.
ENV CI=true ASTRO_TELEMETRY_DISABLED=1

# The manifests first, so an edited page leaves the install layer cached. The `prepare`
# script runs during install; it finds no git and leaves the hooks alone.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY scripts/git-hooks.mjs scripts/
ARG MANABLOX_REGISTRY
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    if [ -n "$MANABLOX_REGISTRY" ]; then echo "@manablox:registry=$MANABLOX_REGISTRY" > .npmrc; fi \
 && pnpm install --frozen-lockfile \
 && rm -f .npmrc

COPY astro.config.mjs tsconfig.json ./
COPY public public
COPY src src
ARG DOCS_SITE_URL
ARG DOCS_BASE_PATH
RUN for name in DOCS_SITE_URL DOCS_BASE_PATH; do \
      eval "[ -n \"\$$name\" ]" || unset "$name"; \
    done \
 && pnpm build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=15s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
