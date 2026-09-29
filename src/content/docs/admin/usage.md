---
title: "Usage"
description: "Where to see how many requests, how much bandwidth, how many workflow runs, form submissions, mails, AI calls and uploads a space used this period, and what happens when a limit is used up."
---

Manablox counts what your spaces use each period (usually a calendar month): how often websites and programs ask for content, how many bytes go out, how many workflows run, and a few more things. If your hosting plan sets limits on these, the **Usage** pages show how close you are, and a banner warns you when a limit is used up.

## Who sees it

| Page | Where | Who sees it |
| --- | --- | --- |
| The space's usage | **Settings > Usage**, under **This space** | Administrators, and space owners and admins (anyone who may change the space's settings) |
| The whole installation | **Settings > Usage**, under **Instance** | Administrators only |

The instance page shows the installation as a whole first, then every space.

## What is counted

| Meter | What it counts |
| --- | --- |
| API requests | Every time a website or program reads content through the delivery API, or reads through the management API with an API key. Your own work in the admin does not count |
| Bandwidth | The size of everything sent out: content, images and files, and the pages of a designed site |
| Workflow runs | Workflows that started. Test runs from the editor do not count (with the workflows plugin) |
| Form submissions | Messages sent through the forms on your designed site |
| Mails | Mails sent by the installation: notifications and workflow mail steps |
| AI calls | Texts, images and designs the AI made (with the AI plugin) |
| Uploads | Files uploaded |

The numbers are updated about once a minute. The line at the top says which period you are looking at and when it starts again from zero.

## Reading a meter

Each meter shows what was used, and when a limit is set, the limit and a bar:

- **Within the limit**: nothing to do.
- **Close to the limit** (yellow): you have reached a warning mark, usually 80 percent.
- **Over the limit** (red): the limit may be passed, but your provider may charge for it or ask you to upgrade.
- **Used up** (red): the limit is reached and the things listed below stop until the period ends. The meter says what stops.

"Stops at the limit" means the limit is strict; "May pass the limit" means it only warns. A meter without a limit just shows the count.

A space can also be limited together with other spaces ("Shared with other spaces") or by a limit for the whole installation ("Whole instance"). Those meters show below the space's own ones when they apply.

## When a limit is used up

A red banner appears at the top of the admin, for example `Bandwidth used up in Website until 1 Oct 2026. The site, media and the delivery API are unavailable.` Click **See usage** to open the numbers, or **Upgrade** (when your provider has set a link) to raise the limit.

| Used up | What stops until the period ends |
| --- | --- |
| API requests | Websites and apps can no longer read content through the API |
| Bandwidth | The designed site shows "Temporarily unavailable", and images and the API stop answering |
| Workflow runs | Workflows do not start |
| Form submissions | Site forms say "This form is unavailable right now" |
| Mails | Notification mails are not sent (you still see them in the admin); workflow mail steps fail |
| AI calls | The AI buttons show an error |
| Uploads | New files cannot be uploaded |

Everything else keeps working: you can still edit and publish content. Nothing is deleted. When the period ends, or as soon as your provider raises the limit, everything works again by itself.
