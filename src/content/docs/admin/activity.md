---
title: "Activity"
description: "The activity log shows everything that happened in a space: who did it, when, and exactly what changed."
---

Manablox writes down everything that is done in it: a page saved or published, a picture deleted, a menu reordered, a member added, a workflow switched on. Each entry says **who** did it, **when**, **what** it was about and, field by field, **what changed**. This record is called the **activity log** (sometimes also "audit log").

It answers questions like "who changed the opening hours on the contact page?" or "when was this article unpublished, and by whom?".

Entries are written once and can never be changed or deleted from the admin, not even by an administrator.

## Who can see it

Click **Activity** in the sidebar. The page shows the log of the space you are working in.

Owners and admins can see it. Editors, authors and viewers cannot, unless an admin gives their role the permission "See the activity log" (see [Users and roles](./users-and-roles.md)). Without it, the sidebar entry is hidden.

## Reading the list

Entries are listed newest first, grouped by day. Each row shows:

- **When**: the time, and how long ago that was.
- **Who**: the name or email of whoever did it, and what kind of actor that was (see below).
- **What happened**: a coloured badge with the action (for example "published" or "deleted"), the kind of thing (Document, Menu, Asset, ...) and its name. If the thing still exists, the name is a link to it. Below it, small grey chips name the fields that changed.

Names are recorded as they were at the time. If a page was renamed later, or a person's account was deleted, the entry still shows the old name.

### Kinds of actor

| Who | Means |
| --- | --- |
| User | A person signed in to the admin. |
| API key | A program using an [API key](./api-keys.md). The entry shows the key's owner. |
| Workflow | A [workflow](./workflows.md) did it. The entry shows the workflow's name. |
| System | Manablox itself, for example a scheduled publish. |

## Opening an entry

Click a row to open it. You see:

- A table with every changed **Field**, its value **Before** (in red) and **After** (in green). "nothing" means the field was empty or did not exist, for example when something was just created.
- Extra details, such as the web browser and address the change came from.
- The entry's number and a long code (its fingerprint) at the bottom.

Some entries have no field changes, because the action itself is what matters. They say "Nothing on the record changed; the action itself is the entry."

## Finding something

The filter bar above the list narrows it down:

| Filter | Use it to |
| --- | --- |
| **Search** | Find entries by who did it or by the name of the thing, for example "contact" or "anna@". |
| **Who** | Show only users, only API keys, only workflows or only the system. |
| **Action** | Show only one kind of action, for example only publishing. |
| **Kind** | Show only one kind of thing, for example only documents or only menus. |
| **Between** | Show only a time window, with a start and an end. |

The cross at the end of the filter bar clears every filter.

Click the column titles **When**, **Who** or **What happened** to sort by them; click again to reverse the order. Long lists are split into pages, with arrows at the top right.

### Example: who changed the contact page?

1. Click **Activity** in the sidebar.
2. In **Search**, type `contact`.
3. Set **Kind** to **Document**.
4. Look through the rows; click one to see what changed.

## For superadmins

A superadmin (the first account of an installation is one) sees two more controls at the top of the page:

- A switch between **This space**, **Everything** (all spaces and the installation itself, with an extra **Space** column) and **Instance only** (accounts, API keys, spaces).
- **Verify chain**: every entry is linked to the one before it by its fingerprint. This button recalculates all of them. If someone changed or removed entries directly in the database, behind Manablox's back, the check tells you where the chain breaks. When all is well, it says every entry hashes to what it claims.

## Live updates in the admin

The same log keeps the admin up to date while several people work at once. When a colleague saves a page, uploads a picture or changes a menu, your open admin shows it within moments, without reloading the page.

If you are editing a document that someone else saves or deletes at the same moment, a note appears above the form with their name. If they saved it, your version can no longer be saved over theirs; click **Discard my changes and reload** to continue from their version.

## How long entries are kept

The log is never trimmed by Manablox; it grows as the space is used. Deciding to delete old entries is a job for whoever runs the server. It has to be done directly in the database, and **Verify chain** will show that break from then on.
