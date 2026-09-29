---
title: "Show it on a website"
description: "Let manablox frontend write a starter website that reads from your public API, run it, and see your published page in the browser."
---

Your About page is published, and the public API hands it out. Now you need a website that shows it to visitors. Because Manablox is headless, the website is a separate project. You do not have to write it from scratch: the `manablox frontend` command writes a small, working starter website that already knows how to find a page by its address, show its fields and draw the main menu.

Before you start, two terminals from the previous steps should still be running in your `my-cms` folder:

| Terminal | Command | Address |
| --- | --- | --- |
| 1 | `pnpm dev` | The admin at `http://localhost:3000` |
| 2 | `pnpm dev:public` | The public API at `http://localhost:3100` |

If one of them is not running, open a terminal in `my-cms` and start it again.

## Run the command

Open a **third terminal**. Go to the folder that contains `my-cms` (not into `my-cms` itself), so the website gets its own folder next to the CMS. If you created `my-cms` in your home folder, that is simply `cd ~`. Then run:

```sh
pnpm dlx @manablox/cli frontend my-site
```

What this does: `frontend my-site` creates a website project in a new folder `my-site`. The command then asks a few questions; the suggested answers already fit the CMS you just created.

## The questions, in order

| Question | What it means | Answer for this guide |
| --- | --- | --- |
| What should the frontend be built with? | The tool the website is built with, see below | Astro |
| Project name | The name inside the website's `package.json` | Press Enter (`my-site`) |
| URL of the delivery API | The public API the website reads from | Press Enter (`http://localhost:3100`) |
| The admin's origin, for the visual editor's preview channel | Where your admin runs. The admin's visual editor later talks to the website, and the website only accepts messages from this address | Press Enter (`http://localhost:3000`) |
| Write components for a space's content and block types? | Whether to write code for your own content types | Yes, from the delivery API above |
| Which types should get a component? | All types or a selection | All 1 types |
| Space id | Only needed when reading from the management API | Press Enter (leave it empty) |
| Port of the dev server | The port the website runs on | Press Enter (`3005`) |
| Install dependencies now with pnpm? | Download the website's packages | Yes |
| Initialise a git repository? | Start a Git history | Yes (or No without Git) |

### Which framework?

A framework is a toolkit for building websites. The command offers four:

| Answer | What it is | Port |
| --- | --- | --- |
| Vite + TypeScript | No framework; the page is built in the visitor's browser. The result is a set of static files any web host can serve | 3003 |
| Astro | Pages are built on the server and sent as plain HTML, with no JavaScript unless needed | 3005 |
| Vite + React, server-rendered | React, built on the server and then made interactive in the browser | 3007 |
| Vite + Vue, server-rendered | Vue, built the same way | 3006 |

Pick **Astro** if you have no preference: it is the default, and the frontend URL you gave the space (`http://localhost:3005`) matches its port. If you pick another one, change the space's **Website address** to that port later under `Settings > General`, in the **Name and website** card. All four work the same way; [The starter website](../website/starter-website.md) compares them.

### Components for your content types

A component is a small piece of website code that shows one kind of content. When you answer **Yes, from the delivery API above**, the command asks your public API which content types the space has, and writes one component for each, with one element per field. You should see "Found 1 content type and 0 block types", then the question which types to use.

That is why `pnpm dev:public` must be running now. If the command says the content model could not be read, check terminal 2, then choose "Try again". Choosing "Go on without it" also works, with less: the website then shows every page through one general layout with the title and the summary, but not your body text, and it comes with an example "teaser" block component.

## What the command wrote

The command lists the files it wrote, installs the packages and prints the next steps. The `my-site` folder is an ordinary Astro project:

| File or folder | What it is |
| --- | --- |
| `src/pages/[...slug].astro` | The one route that handles every address: it asks the public API for the page with that permalink |
| `src/pages/preview.astro` | The page the admin's visual editor shows |
| `src/components/content/` | One component per content type; you get `PageContent.astro` for your Page type |
| `src/components/blocks/` | One component per block type |
| `src/lib/manablox.ts` | The connection to the public API |
| `.env` | The addresses you gave, such as `MANABLOX_URL` and `MANABLOX_ADMIN_ORIGIN` |
| `README.md` | Explains every file and setting |

No API key or password is stored anywhere: the public API only serves published content, so the website needs no secret.

## Start the website

```sh
cd my-site
pnpm dev
```

This starts Astro's development server. It keeps running and reloads the page whenever you change a file. You should see a message with the address `http://localhost:3005`.

Open `http://localhost:3005` in your browser. You should see your About page: the title as a heading, then your summary and your body text. Because you made About the home page, it appears at the main address. It is also at `http://localhost:3005/about`.

Congratulations: content you wrote in the admin now shows on a website.

## Try the round trip

1. In the admin, open the About page, change the summary and click **Publish**.
2. Reload `http://localhost:3005`. The new summary appears. The website remembers answers for up to 30 seconds, so if you still see the old text, wait a moment and reload again.
3. Now change the summary and click only **Save**. Reload the website: nothing changes, because drafts are never shown to visitors.

## If something goes wrong

| You see | Try this |
| --- | --- |
| "Something went wrong" and a message about reaching the API | `pnpm dev:public` is not running. Start it in `my-cms` and reload |
| An empty page at `/` (the browser's developer tools show status 404) | No home page is set. Set the star on About in the content tree, or open `/about` |
| An empty page at `/about` (status 404) | The page is not published, or its slug is different. Check it in the admin |
| `... is not empty; pass --force` when creating | A `my-site` folder already exists. Choose another name |

## About the visual editor

The visual editor shows your website next to the editing form in the admin and updates it on every keystroke, before you save. It opens with the **Visual** button in the document editor, which appears for content types that have a **Blocks** field. Your simple Page type has none, so you do not see the button yet.

Everything for it is already prepared: the website has a `/preview` page, it knows the admin's address from your answer to the admin's origin question, and the space's frontend URL points at the website. When you add a Blocks field to a type, the Visual button appears. See [Preview and the visual editor](../website/preview.md).

## Where to go from here

You now have the whole chain running: the admin, the CMS, the public API and a website. Good next steps:

- [A tour of your project](../your-project/index.md) explains the files of your CMS project.
- [Building content types](../admin/content-types.md) shows how to build richer types, including blocks editors can stack.
- [The starter website](../website/starter-website.md) explains the website project in detail, and [The SDK](../website/sdk.md) the library it uses to talk to the public API.
- [Put it on a server](../going-live/index.md) shows how to take everything online.
