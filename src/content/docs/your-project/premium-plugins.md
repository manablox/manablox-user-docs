---
title: "Premium plugins and licenses"
description: "The website and AI plugins need a license key. How to start a trial, buy a subscription, add the key, and what happens when a license ends."
---

Two plugins are premium: the **website** plugin (designing a site in the admin, see [A website without code](../design/index.md)) and the **AI** plugin (see [AI](../admin/ai.md)). They need a license key from a subscription. Everything else, the CMS itself, workflows and webhooks, is open source under the MIT license and needs none.

Licenses are sold on the license portal, [licenses.manablox.io](https://licenses.manablox.io). The portal shows the current prices, monthly or yearly, for each plugin and for the bundle of both.

## Start a trial or buy

Each plugin has a free 14-day trial, once per plugin. The bundle has no trial of its own: to try both, start a trial of each.

From the project folder, run:

```sh
pnpm exec manablox license buy
```

It asks which plugins you want, opens the portal in your browser and shows a short code. Check that the portal shows the same code, sign in with your email address (the portal sends a sign-in link) and finish the checkout. The portal offers the trial when you have not used it yet. Back in the terminal the key arrives on its own: the command writes it into `.env` and activates it. Restart the CMS.

To go straight to the trial, add `--trial`; the portal then leads with it and still checks that the plugin's trial is unused. On a server without a terminal (a script, CI), say which plugins and how often you pay, since nothing can be asked:

```sh
pnpm exec manablox license buy --plugins ai --trial --monthly
pnpm exec manablox license buy --plugins ai,website --yearly
```

You can also buy on the portal directly (**Pricing**, then **Start free trial** or **Buy**). The portal then shows the key under **Subscriptions**, and the same key comes by email.

See [The manablox command](../help/cli.md#manablox-license) for every `manablox license` command.

## Add a key you already have

A key looks like `MBX-XXXXX-XXXXX-XXXXX-XXXXX-XXXXX`. Either:

- run `pnpm exec manablox license add MBX-...` in the project folder, which writes it into `.env` and activates it, or
- put it into `.env` yourself and restart: `MANABLOX_LICENSE_KEYS=MBX-...`, several keys separated by commas, or
- in the admin, open **Settings > Licenses**, click **Add key** and paste it (superadmins only).

Keys are secrets, like passwords. Keep them in `.env` or the server's environment, never in `manablox.config.ts` or in git. Keys added in the admin are stored encrypted in the database; keys from `.env` show there as coming from the environment and can only be changed there.

**Settings > Licenses** lists every key with the plugins it covers, when the paid period ends, when the current lease runs out and the last refresh. **Refresh now** asks the license server at once, **Deactivate** frees the key on this instance, and **Buy or manage** opens the portal.

In the terminal, `pnpm exec manablox license status` shows the same: every key, its plugins, state, period end and last refresh, then the state of each premium plugin. It ends with code `1` while a premium plugin of your config is locked, so a deploy script or a health check can stop on it. `pnpm exec manablox license refresh` asks the license server at once.

## One key per subscription

A subscription holds one plugin, or the bundle of both, and has one key. Buying the two plugins separately gives two keys; put both into `MANABLOX_LICENSE_KEYS`. The instance gets everything its keys cover together.

Changing the plan on the portal (a single plugin to the bundle, monthly to yearly, more seats) keeps the key.

## Development and production

Every instance needs a key, also your laptop and a staging server. What differs is whether it takes a seat:

| | Development | Production |
| --- | --- | --- |
| Where | Every address of the instance is private: `localhost`, names ending in `.localhost`, `.test`, `.local` or `.internal`, and addresses of your own network | Any public address |
| Seats | None; as many instances as you like | One seat per instance |
| Limits | Serves private addresses only. A designed site on a public domain answers "This site runs on a development license", AI refuses to work on a public address | None |

The instance decides on its own: it activates as development when it does not run with `NODE_ENV=production` and all its addresses (its URLs, every space's URL and API hosts, the website's domains) are private. The admin then shows a "Development license" notice. A preview server with a public name of its own can count as private: list it in `MANABLOX_LICENSE_DEV_HOSTS` (see [The .env file](./environment.md#premium-plugin-licenses)).

A subscription's quantity is its number of seats, one per production instance. When every seat is taken, activating another production instance is refused and names the instances that hold the seats: deactivate one, or add a seat on the portal.

## Moving to another server

A seat belongs to the instance, not to the server. To move a production instance:

1. On the old instance, deactivate the key: **Settings > Licenses > Deactivate**, or `pnpm exec manablox license remove <key id>`. On the portal, the subscription's page can deactivate an instance too, for a server that is gone.
2. On the new instance, add the key and restart.

A restored backup is the same instance. When the original and a copy both run with the same license (a backup restored on a second server, a copied database), the license server notices: the copy shows "this license is active on another instance" and locks when its lease runs out, unless you run `pnpm exec manablox license activate` there, which moves the seat to it.

## When a license ends

The instance checks its licenses on its own, with no call to the license server while it serves requests. Once a day it asks the license server for a fresh lease, a signed note of what it may use and until when. A lease lasts at most 14 days after its last refresh, and at most 14 days after the end of the period paid for.

| What happened | What you see |
| --- | --- |
| A payment failed | A banner that links to the billing page. Nothing locks while the payment is retried |
| The subscription was canceled | Everything works until the paid period ends, then 14 days of grace with a banner naming the date |
| The license server cannot be reached | A banner. Nothing locks until the lease runs out, 14 days after the last refresh |
| The lease ran out, or there is no key | The plugin locks, with a buy link |

Locked never means lost: your data stays, the CMS keeps starting, and a valid key unlocks everything again at once. What locks:

- **AI**: the whole plugin. The wands, **Generate** and the **Describe** buttons show a lock, and AI steps in workflows stop. Providers, keys and the history stay.
- **Website**: designing (the designers open read-only), adding or changing site domains, and setting up forms. **Designed sites keep rendering** on their domains and their forms keep taking submissions.

## Manablox Cloud

Instances hosted on Manablox Cloud come with their licenses. **Settings > Licenses** says "Managed by Manablox Cloud", and there is nothing to buy per plugin.

## Offline instances

An instance must reach the license server now and then, over HTTPS from the server that runs the admin and API. Instances without internet access (air-gapped) are not supported yet: without a refresh a lease runs out after 14 days.

## What the instance sends

When it activates or refreshes a key, the instance sends the key, a random id of the instance, whether it runs as development or production, the Manablox and plugin versions, its addresses (its URLs, space URLs and API hosts, the website's domains) with the admin's address as its name, and a secret that proves each refresh comes from the same instance. It sends no content, no users and nothing else from your database.
