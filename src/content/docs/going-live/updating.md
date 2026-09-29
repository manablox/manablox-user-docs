---
title: "Updating Manablox"
description: "Move your CMS to a newer Manablox version: back up, change the versions, rebuild, and bring the database up to date."
---

New Manablox versions bring fixes, security updates and new features. Updating is the same few steps every time: make a backup, raise the version numbers in `package.json`, rebuild, start. The CMS itself never changes the database tables: in a `docker` project the `migrate` service updates them before the CMS starts, and in a `local` project you run `pnpm migrate`.

## How versions work

Your CMS is made of five `@manablox/*` packages, listed in `package.json`:

```json
"dependencies": {
  "@manablox/admin": "^0.50.0",
  "@manablox/cli": "^0.50.0",
  "@manablox/core": "^0.50.0",
  "@manablox/fields": "^0.50.0",
  "@manablox/server": "^0.50.0"
}
```

Each feature you picked adds its plugin: `@manablox/plugin-website` for designed websites, `@manablox/plugin-ai` for AI, `@manablox/plugin-workflows` for workflows and `@manablox/plugin-webhooks` for webhooks. The two premium plugins, website and AI, also bring `@manablox/plugin-license`, which checks their license keys.

They are released together, always with the same version number. Keep them all on the same version: update them together, never one alone.

`package.json` holds a version range (the `^` means "this version or a compatible newer one"). The exact versions that get installed are recorded in `pnpm-lock.yaml`. That is why the lockfile has to be written again after every change.

To see the newest version, look up `@manablox/cli` on npmjs.com, or ask npm from the server (this runs npm in a temporary Node.js container, so it needs only Docker):

```sh
docker run --rm node:24-bookworm-slim npm view @manablox/cli version
```

## Before you update

Read what changed between your version and the new one in the [changelog](https://github.com/manablox/manablox-cms/blob/main/CHANGELOG.md), especially changes that need you to do something. While Manablox is in the `0.x` versions, a change in the second number (for example from `0.50` to `0.51`) can include such changes.

Then make a backup, so you can go back if something goes wrong:

```sh
./scripts/backup.sh
```

Also keep a copy of the two files you are about to change:

```sh
cp package.json package.json.before-update
cp pnpm-lock.yaml pnpm-lock.yaml.before-update
```

See [Backups](./backups.md) for what the backup contains.

## Update a docker project

Run these steps in your project folder on the server.

1. Open `package.json` (for example with `nano package.json`) and change the version of every `@manablox/*` package to the new one, for example from `^0.50.0` to `^0.51.0`. Leave `typescript` and `@types/node` as they are.
2. Write the lockfile again. The script runs pnpm in a temporary container:

```sh
./scripts/lockfile.sh
```

3. Build the new image:

```sh
docker compose build
```

4. Start it:

```sh
docker compose up -d
```

5. Watch the logs until the admin is back:

```sh
docker compose logs -f migrate api
```

Compose runs the `migrate` service first. It brings the database tables up to date for the new version and then stops. Only when it has finished successfully do `api` and `public` start again. So a migration problem stops the update before any visitor sees a half-updated CMS.

You should see `migrate` finish and `api` start. `docker compose ps` should show `api` as `(healthy)` again after about half a minute. Open the admin and check that you can sign in and see your content.

If you keep the project in Git, commit the new `package.json` and `pnpm-lock.yaml`.

:::tip
If you develop the project on your computer as well, run `pnpm install` and then `pnpm typecheck` there after changing the versions. It checks that your config files still fit the new version before you build on the server.
:::

## Update a local project

On your computer, with a project made with the `local` preset:

1. Change every `@manablox/*` version in `package.json`, as above.
2. Install them:

```sh
pnpm install
```

3. Update the database:

```sh
pnpm migrate
```

4. Stop `pnpm dev` with Ctrl+C if it is running and start it again.

Instead of editing `package.json` by hand you can let pnpm do it. This moves every `@manablox/*` package to the newest version and updates `package.json` and the lockfile:

```sh
pnpm update "@manablox/*" --latest
```

Run `pnpm migrate` afterwards in any case.

## Your website

Your website is a separate project. If it uses `@manablox` packages (for example `@manablox/public-sdk`), update them there the same way, then build and deploy the website again.

## If something goes wrong

First look at the logs:

```sh
docker compose logs migrate api
```

If `migrate` failed, `api` does not start, and the message in the `migrate` log says why. [Common problems](../help/troubleshooting.md) covers the usual causes.

If you cannot fix it and need to go back to the old version:

1. Put the old files back:

```sh
cp package.json.before-update package.json
cp pnpm-lock.yaml.before-update pnpm-lock.yaml
```

2. Build the old image again:

```sh
docker compose build
```

3. Restore the backup you made before the update (use the folder name `backup.sh` printed):

```sh
./scripts/restore.sh backups/2026-09-11_03-00-00
```

The restore is needed because database updates only go forward: there is no command that undoes them, so the backup is your way back to the old database. The restore puts the database and the uploads back to the moment of the backup, then starts the CMS again with the old version.

:::caution
Anything editors changed between the backup and the restore is lost. Update at a quiet time, and ask editors to wait until you are done.
:::
