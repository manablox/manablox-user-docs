#!/usr/bin/env bash
# Control the development docker compose stack.
#
# Every command is a thin wrapper around `docker compose -f docker/compose.dev.yml`, so
# the stack can be driven without node or pnpm on the host. Arguments after the command
# are passed straight through to docker compose (e.g. `dev.sh logs user-docs -n 100`).
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# The local registry of the CMS stack, which the install reads `@manablox/*` from.
REGISTRY_NETWORK=manablox-registry
REGISTRY_URL=http://localhost:4873

usage() {
  cat <<'USAGE'
Usage: scripts/dev.sh <command> [docker compose args...]

  up               install the dependencies and start the dev server in the background
  down             stop the stack
  logs             follow the logs
  reset            stop the stack, delete its volumes and containers, and remove the
                   generated .astro/ and dist/ folders
  services:up      check the one service the stack needs from outside: the CMS stack's
                   local registry (the guide has no backing services of its own)
  services:down    stop the stack (same as `down`)
  <other>          any other docker compose command, forwarded as-is

  -h, --help       this message

Port: the guide on 3008. `@manablox/*` comes from the CMS stack's Verdaccio: run
`pnpm dev:services` and `pnpm dev:publish` in manablox-cms first.
USAGE
}

if [ $# -eq 0 ]; then
  usage >&2
  exit 2
fi

command="$1"
shift

case "$command" in
  -h|--help) usage; exit 0 ;;
esac

# The install joins the CMS stack's registry network; without it compose fails with a
# message that does not say what to start.
require_registry() {
  docker network inspect "$REGISTRY_NETWORK" >/dev/null 2>&1 ||
    die "the docker network '$REGISTRY_NETWORK' is missing: start the CMS stack's services first (pnpm dev:services in manablox-cms)"
}

# A container still attached to a deleted network cannot start; remove it so `up` recreates it.
drop_stale_containers() {
  local id net stale=()
  for id in $(compose ps -aq); do
    for net in $(docker inspect -f '{{range .NetworkSettings.Networks}}{{.NetworkID}} {{end}}' "$id"); do
      if ! docker network inspect "$net" >/dev/null 2>&1; then
        stale+=("$id")
        break
      fi
    done
  done
  if [ ${#stale[@]} -gt 0 ]; then
    log "recreating ${#stale[@]} container(s) whose network is gone"
    docker rm -f "${stale[@]}" >/dev/null
  fi
}

require_docker

case "$command" in
  up)
    require_registry
    drop_stale_containers
    # `--wait` returns once the dev server answers, so the guide is there when this returns.
    compose up -d --build --wait "$@"
    printf '\n  user guide   http://localhost:3008\n'
    ;;
  down|services:down|services-down) compose down "$@" ;;
  logs) compose logs -f "$@" ;;
  reset)
    compose down -v --remove-orphans "$@"
    # What the dev server and a build generate; the next `up` writes them again.
    rm -rf "$ROOT/.astro" "$ROOT/dist" "$ROOT/node_modules/.astro"
    ;;
  services:up|services-up)
    require_registry
    # From a container of this stack, the way the install reaches it.
    if compose run --rm --no-deps install \
      node -e "fetch('http://verdaccio:4873/-/ping').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"; then
      log "the local registry answers ($REGISTRY_URL, verdaccio:4873 on $REGISTRY_NETWORK)"
    else
      die "the local registry does not answer on $REGISTRY_NETWORK: start the CMS stack's services (pnpm dev:services in manablox-cms)"
    fi
    ;;
  *) compose "$command" "$@" ;;
esac
