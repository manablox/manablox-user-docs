---
title: "Webhooks"
description: "Let other systems know when your content changes, and give them a web address to call you back. With a log of every call."
---

A **webhook** is one system tapping another on the shoulder: "something happened". It is just a call to a web address.

Manablox does this in both directions:

- **Outgoing** webhooks: your space calls an address of yours when content changes. For example, it tells your website's hosting to rebuild the site after a page is published.
- **Incoming** webhooks: your space gets its own address that other systems can call. For example, your online shop calls it when an order comes in, and a [workflow](./workflows.md) reacts to that.

Click **Webhooks** in the sidebar. The page has a tab for each direction: **Incoming** and **Outgoing**.

Owners and admins can create and change webhooks. Editors can see them and their logs. Authors and viewers do not see the page. (For custom roles, these are the permissions **See webhooks** and **Create and edit webhooks**.)

Webhooks come from the webhooks plugin, the package `@manablox/plugin-webhooks`. A project made with `manablox create` has it when **Webhooks** was picked (or `--webhooks` given). Without it there is no **Webhooks** entry in the sidebar; see [Add webhooks to a project](#add-webhooks-to-a-project).

## Outgoing: tell another system that content changed

You usually get the address from whoever runs the other system (your developer, your hosting service, a tool like Zapier). Then:

1. Click **Webhooks** in the sidebar and open the **Outgoing** tab.
2. Click **New outgoing webhook**.
3. In **Name**, describe it, for example `Rebuild the site`.
4. Optionally fill in **What it is for**, a sentence for whoever finds it later.
5. In **URL**, paste the address you were given. It starts with `https://`.
6. Under **Send on**, pick the events it should hear about: **Created**, **Updated**, **Saved**, **Deleted**, **Published**, **Unpublished**. Nothing picked means every event.
7. Under **Authenticate with**, choose how the call proves it comes from you (see below). If you are not sure, ask the other side; **Signature** is the most common.
8. Click **Save**.

The new webhook is in the list and switched on. Now click **Send test** on its row. Manablox sends a made-up call right away. Click **Log** to see whether it arrived: a green tick and "HTTP 200" (or another number in the 200s) means the other side accepted it.

What the other system receives is a small piece of data saying which event happened, to which document, and when. Your developer knows what to do with it.

Calls go out in the background, so saving a page never waits for them. A slow or broken address holds nothing up; the failure just shows up in the log.

## Incoming: give another system an address to call

1. Open the **Incoming** tab.
2. Click **New incoming webhook**.
3. In **Name**, describe who calls it, for example `From the shop`.
4. Under **Accepted methods**, leave **POST** unless the other side says otherwise. (A method is the kind of call; POST is by far the most common. Nothing picked means POST alone.)
5. Under **A caller proves itself with**, choose how the caller shows it is really them (see below).
6. Click **Save**.

The row now shows the address, with a copy button next to it. It looks like `https://your-cms.example.com/plugins/webhooks/in/...`. Give this address to the other system. It is an address of your CMS (the admin's server), not of the public API your website reads from.

A webhook of a [staging environment](./environments.md) has its own address, with the environment's technical name in it (`.../plugins/webhooks/in/<space>/staging/<name>`), and starts only the workflows of that environment.


The name can be changed later without changing the address, so an address you handed out keeps working.

An incoming webhook does nothing on its own. It is a door; a workflow decides what happens when someone comes through it. The row shows a yellow "no workflow" badge until one is connected. Click **Connect to workflow** on the row to create a workflow that starts on this webhook. Several workflows may use the same webhook.

Starting workflows needs the workflows plugin as well (see [Workflows](./workflows.md)). Without it, calls to an incoming webhook still arrive and show up in its log, but nothing runs them: the page says so, and **Connect to workflow** is missing.

:::caution
The address must be reachable from the internet for an outside service to call it. While you try Manablox on your own computer at `http://localhost:3000`, nobody outside can reach it. Incoming webhooks become useful once your CMS runs on a server; see [Put it on a server](../going-live/index.md).
:::

## Proving who is calling

Anybody who knows a web address can call it. So both sides agree on a secret that proves a call is genuine. Manablox offers these ways:

| Choice | How it works |
| --- | --- |
| **Nothing** | No proof at all. Anyone who knows the address can call it. Only sensible when the address is not reachable from outside. |
| **Signature** | Both sides know a shared secret. The sender uses it to compute a "signature" of the message and sends it along; the receiver computes it again and compares. If someone changed the message or does not know the secret, the signatures do not match. This is how GitHub, Stripe and many others sign their calls. |
| **Token in a header** | A fixed key is sent along with every call, like a password. |
| **Username and password** | A username and password are sent along. |
| **Bearer token** | A token is sent the way many APIs expect it. |
| **OAuth 2** | For outgoing calls to services that use OAuth. Not available for incoming webhooks. |

Whatever you choose, the secret itself is stored as a **credential**: pick one under **Credential**, or click **Add** to create it on the spot. A credential is stored encrypted and never shown again in the browser. You can also manage them under **Settings > Credentials**.

For **Signature**, three more settings appear: the **Signature header** (where the signature travels in the call), the **Digest** and how it is **Written as**. Leave the defaults unless the other side tells you what they use. For an incoming webhook, copy these settings from the documentation of the service that calls you.

:::tip
Make a signing secret long and random, for example by letting a password manager generate 40 characters. Both sides must have exactly the same string.
:::

## The log

Every call is recorded, in both directions, even calls that were turned away. Click **Log** on a webhook's row to see them, newest first:

- A green tick or a red cross, and the time.
- The answer as a number: 200 to 299 means success, 401 means the caller could not prove who it is, 500 and up means the other side had a problem.
- For incoming calls: how many workflows it started, or that no workflow is waiting on this webhook.
- The reason, in red, when something failed.

Click an entry to see exactly what was sent or received. The parts that carry the secret are never stored.

For an outgoing call that failed, **Send again** repeats it, for example after the other side fixed their problem. If a call was repeated, the entry shows "attempt 2" and so on.

The newest 200 calls of each webhook are kept.

:::tip
When an integration "does nothing", look at the log first. A call turned away because of a wrong signature shows up here with the reason, which usually tells you exactly what is wrong.
:::

## Switch off, edit, delete

- The switch on each row turns a webhook off without deleting it. A switched-off incoming webhook refuses calls, so its workflows never start.
- **Edit** opens the same form again.
- The trash button deletes the webhook. Its log goes with it.

Deleting a credential does not delete the webhooks using it. Their next call fails and the log says why, instead of quietly going out without proof or letting strangers in.

A webhook marked **code** was set up by a developer in the project's files and cannot be edited here, only switched on and off. See [Workflows and webhooks in code](../your-project/resources-in-code.md).

## Moving a space

When you move a space to another installation (see [Moving a space](./transfer.md)), webhooks travel along, all of them together, but their secrets do not. A webhook that uses a proof method therefore arrives switched off. Enter the secret in its credential on the new installation and switch it back on.

## Add webhooks to a project

A developer adds the plugin to a project that does not have it yet with `pnpm exec manablox plugin install webhooks` in the project folder, then restarts the CMS. Where the command cannot change the files itself (see [manablox plugin](../help/cli.md#manablox-plugin)), do it by hand:

1. Add the package with the same version as the other `@manablox` packages: `pnpm add @manablox/plugin-webhooks`.
2. In `manablox.plugins.ts`, add `import { webhooksPlugin } from '@manablox/plugin-webhooks';` at the top and `webhooksPlugin()` to the `plugins` list. The `publicPlugins` list, the public API's, does not need it.
3. Run `pnpm migrate` and restart the CMS.
