#!/usr/bin/env bash
# Build the production image from docker/Dockerfile: the user guide as static files behind
# nginx, named <prefix>/user-docs:<tag>, ghcr.io/manablox/user-docs:0.50.0 by default - the
# name the release workflow pushes. CI builds with the docker actions instead, for the layer
# cache; the Dockerfile is the same.
#
# With a `.npmrc` that points `@manablox` at a local registry (the development setup), the
# build installs from that registry, over the host network; without one, from npmjs.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"
cd "$ROOT"

prefix="${IMAGE_PREFIX:-ghcr.io/manablox}"
tag=""
push=false

usage() {
  cat <<'USAGE'
Usage: scripts/docker-build.sh [options]

  --tag <tag>       image tag (default: the version in package.json, e.g. 0.50.0)
  --prefix <name>   registry and namespace (default: $IMAGE_PREFIX or ghcr.io/manablox)
  --push            push the image after building it (log in to the registry first)
  -h, --help        this message

DOCS_SITE_URL and DOCS_BASE_PATH in the environment are passed to the build.
USAGE
}

while [ $# -gt 0 ]; do
  case "$1" in
    --tag) tag="${2:?--tag needs a tag}"; shift ;;
    --prefix) prefix="${2:?--prefix needs a name}"; shift ;;
    --push) push=true ;;
    -h|--help) usage; exit 0 ;;
    *) usage_error "unknown option '$1'" ;;
  esac
  shift
done

if [ -z "$tag" ]; then
  tag="$(sed -nE 's/^  "version": "([^"]+)",?$/\1/p' package.json | head -n1)"
  [ -n "$tag" ] || die "could not read the version from package.json; pass --tag"
fi

require_docker

build_args=(--build-arg "DOCS_SITE_URL=${DOCS_SITE_URL:-}" --build-arg "DOCS_BASE_PATH=${DOCS_BASE_PATH:-}")
network=()
registry="$(sed -nE 's/^@manablox:registry=(.+)$/\1/p' .npmrc 2>/dev/null | head -n1 || true)"
if [ -n "$registry" ]; then
  log "installing @manablox/* from $registry"
  build_args+=(--build-arg "MANABLOX_REGISTRY=$registry")
  # A registry on the host's loopback is only reachable from the host network.
  network=(--network host)
fi

name="$prefix/user-docs:$tag"
log "building $name from docker/Dockerfile"
DOCKER_BUILDKIT=1 docker build \
  --file docker/Dockerfile \
  --tag "$name" \
  "${network[@]}" \
  "${build_args[@]}" \
  --label "org.opencontainers.image.source=https://github.com/manablox/manablox-user-docs" \
  --label "org.opencontainers.image.version=$tag" \
  .

if [ "$push" = true ]; then
  log "pushing $name"
  docker push "$name"
fi

log "built: $name"
