---
title: "API keys"
description: "What an API key is, when a program needs one, how to issue a key limited to certain spaces and permissions, and how to revoke it."
---

People sign in to the admin with an email and a password. Programs cannot do that, so they use an **API key** instead: a long secret text that a program sends along to prove it may read or change content. This page explains when you need one and how to issue it safely.

## When you need a key

Most websites do **not** need a key. A website normally reads published content from the public API, which is open to anyone and never shows drafts (see [How a website gets content](../website/index.md)).

A key is needed when a program uses the **management API**, the same connection the admin uses. Typical cases your developer may ask you for a key for:

| Use | What the key needs |
| --- | --- |
| Setting up the starter website with components for your content types | Reading the space's content types |
| Showing unpublished drafts on a preview server | Reading content and assets in one space |
| Another system that creates or changes content, for example an import from a shop | Writing content in one space |

A key acts **in your name**. It can never do more than you can do yourself, and whatever it does shows up in the activity log as done by you.

## Issuing a key

API keys are under **Settings > API keys**. The list there shows only your own keys.

1. Go to **Settings** and click **API keys** in the side panel, under **Instance**.
2. Click **Issue key**.
3. Give the key a **Name** that says where it will be used, for example `preview server` or `shop import`.
4. Under **Restrict to spaces**, tick the spaces the key may work in. Leave every box unticked for a key that reaches all of your spaces.
5. Under **Permissions**, choose **Everything I may do**, or **Only these** and tick exactly what the program needs (see below).
6. Click **Issue key**.

You should see the message `Key "preview server" issued - copy it now`, and a box saying **Copy this key now - it is never shown again.** with the key inside it.

7. Select the key in the box, copy it, and hand it to your developer in a safe way (not by plain email or chat if you can avoid it).
8. Click **Dismiss** to close the box.

:::danger
The key is shown only once. Manablox does not store it in a readable form, so nobody can show it to you again. If it gets lost, revoke it and issue a new one.
:::

## Choosing what a key may do

A key can be narrowed in two ways, and both only ever take things away:

- **Restrict to spaces** limits the key to the spaces you tick. It still cannot reach a space you are not a member of yourself.
- **Only these** limits the key to the permissions you tick. They are the same permissions a role has, including the content table with **Read**, **Write**, **Delete** and **Publish** for all content types or type by type; see [Users and roles](./users-and-roles.md#permissions). The table lists the document types of the spaces the key reaches; tick spaces first to shorten it.

Whatever you tick, the key never gets more than your own role allows. If your role is later reduced, the key loses those rights too.

Example: a key for a preview server needs one space, and under **Only these** tick just **See the space**, **See content types**, content **Read** for all content types, and **See assets**. Nothing else.

In the list, each key shows its name, its spaces ("All spaces" or their names), what it may do ("everything you may do" or the number of permissions), and the first letters of the key, so you can tell keys apart.

## Revoking a key

When a program no longer needs its key, or a key may have fallen into the wrong hands:

1. In **Settings > API keys**, click **Revoke** on the key's row.
2. Confirm with **Revoke key**.

Every program using that key stops working immediately. A revoked key is deleted and cannot be switched on again; issue a new one if needed.

:::tip
Issue one key per program. Then you can revoke one without breaking the others, and the name tells you which program it belongs to.
:::

## Good to know

- Deleting a person's account also deletes all their keys, so programs using them stop working. Before someone leaves the team, issue new keys under another account for the programs that still need them.
- The **Settings** entry in the sidebar appears for owners and admins of the current space.
