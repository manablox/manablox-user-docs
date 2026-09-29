#!/usr/bin/env bash
# Shared helpers for the scripts in this directory. Source it, do not run it:
#
#   source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"
#
# It sets ROOT to the repository root and defines the few things every script needs:
# a prefixed logger, a fatal-error helper and the docker compose wrapper that `dev.sh`
# owns.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export ROOT

# The script's own name, for log prefixes: `dev: ...`.
SCRIPT_NAME="$(basename "${BASH_SOURCE[1]:-$0}" .sh)"

log() { printf '%s: %s\n' "$SCRIPT_NAME" "$*"; }
warn() { printf '%s: %s\n' "$SCRIPT_NAME" "$*" >&2; }
die() { warn "$@"; exit "${DIE_STATUS:-1}"; }

# `usage_error "unknown option '$1'"` - prints the message, then the caller's usage(),
# and exits 2, which is what every script here does on a bad flag.
usage_error() {
  warn "$1"
  if declare -F usage >/dev/null; then usage >&2; fi
  exit 2
}

require_docker() {
  command -v docker >/dev/null 2>&1 || die "docker is required but not installed"
  docker info >/dev/null 2>&1 || die "docker is installed but the daemon is not reachable"
}

# The compose environment `.env` is gitignored, so a fresh clone has only the committed
# `.env.example`. Seed it when it is missing and leave an existing file alone.
seed_env() {
  if [ ! -e "$ROOT/.env" ]; then
    cp "$ROOT/.env.example" "$ROOT/.env"
    log "created .env from .env.example"
  fi
}

# The registry `@manablox/*` installs from on this machine: the CMS stack's Verdaccio. The
# `.npmrc` is gitignored (CI and releases install from npmjs); seeded when it is missing.
LOCAL_REGISTRY_LINE='@manablox:registry=http://localhost:4873/'
seed_npmrc() {
  if [ ! -e "$ROOT/.npmrc" ]; then
    printf '%s\n' "$LOCAL_REGISTRY_LINE" > "$ROOT/.npmrc"
    log "created .npmrc: $LOCAL_REGISTRY_LINE"
  fi
}

# The development stack. Compose takes its project directory from the compose file's own
# directory, so the files it reads are named relative to `docker/`.
COMPOSE_FILE="$ROOT/docker/compose.dev.yml"
compose() {
  seed_env
  seed_npmrc
  # The containers write `node_modules` into the bind-mounted working copy, so they run as
  # the invoking user. Without this compose falls back to 1000:1000.
  DEV_UID="$(id -u)" DEV_GID="$(id -g)" docker compose -f "$COMPOSE_FILE" "$@"
}
