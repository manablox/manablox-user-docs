---
title: "Backups"
description: "Take a snapshot of a space, see the snapshots taken for you, download one, and bring a space back to an earlier moment."
---

A snapshot is a copy of one space at one moment: its content, content types, menus, workflows, settings and site design. Your images and files are not copied into it, but they are kept safe for as long as a snapshot may need them, so a restored space shows them again.

Open **Settings > Backups** to see the snapshots of the space you are working in.

## Who sees it

| What | Who |
| --- | --- |
| The Backups page and **Create snapshot now** | Space owners and admins, and anyone whose role may export the space |
| **Download** | Administrators only |
| Restoring | Space owners and administrators |

If your hosting plan does not include backups, the page shows a lock instead.

## Snapshots taken for you

The line above the list tells you whether snapshots are taken automatically (every hour or every day) and how many days they are kept. Your hosting plan decides both. Older snapshots are removed on their own.

Each row shows when the snapshot was taken, whether it was taken by hand or on schedule, its size, and how many documents, files and content types it holds.

## Taking a snapshot now

Click **Create snapshot now** before a big change, such as a new content model or a large import. The new snapshot appears at the top of the list.

## Downloading a snapshot

Administrators can click **Download** to save a snapshot as a file. That file can be imported under **Settings > Spaces > Import**, here or on another installation. It holds no images or files.

## Bringing a space back

Each row has two buttons:

| Button | What happens |
| --- | --- |
| **As new space** | The snapshot becomes a separate space next to this one, named after it with "restored" and the date. This space stays as it is. Use it to look something up or copy it back by hand |
| **Replace this space** | This space goes back to the moment of the snapshot. Everything changed since is lost. The website address, domains and members stay |

Both ask you to type the space's technical name first, so a restore never happens by accident. After a replace, the admin opens the restored space for you.

Files deleted after the snapshot come back with it, as long as the snapshot still exists.
