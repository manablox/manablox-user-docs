---
title: "AI"
description: "Connect an AI provider to a space, then let it write text, fill whole documents, draw pictures and design content types, templates and workflows for you."
---

Manablox can work with AI models to help you write and build. Once a space has an AI provider connected:

- A **magic wand** appears next to text fields. It writes or rewrites the text for that field.
- Picture and video fields get a wand that **generates an image or a video**.
- The document editor gets a **Generate** button that writes the whole document at once, including its blocks.
- Content types, templates, workflows and even new spaces can be **designed from a description** in plain words.

Nothing of this is switched on by default. A space without a provider shows no wands at all.

AI comes from the AI plugin, the package `@manablox/plugin-ai`. A project made with `manablox create` has it when **AI assistance** was picked (or `--ai` given). Without the plugin there is no **AI** section in the settings and none of the buttons on this page. To add it to a project later, a developer runs `pnpm exec manablox plugin install ai` in the project folder and restarts the CMS.

The AI plugin is a premium plugin. On your own computer it runs without a license key; in production it needs one, and a free 14-day trial gets you started. Without a license that covers it on a production installation, the wands, **Generate** and the **Describe** buttons show a lock and AI steps in workflows stop; your providers, keys and history stay. See [Premium plugins and licenses](../your-project/premium-plugins.md).

You always stay in control: AI answers appear in a window first, you can change them, and nothing is saved until you save the document yourself.

## Who can do what

| Role | AI |
| --- | --- |
| Owner, admin | Connect providers, choose models, write the house style; and use everything below |
| Editor, author | Use the wands and **Generate**, and the **Describe** buttons on pages their role can open |
| Viewer | Nothing |

## Connect a provider (admins)

An AI provider is the company (or your own server) that runs the model. Every generation is billed by that provider to the key you enter, so you need an account with them. Keys are set per space, so two spaces can use two different accounts.

| Provider | Does | Where you get a key |
| --- | --- | --- |
| **Claude** | Text | An Anthropic API key, from console.anthropic.com. Starts with `sk-ant-`. |
| **ChatGPT** | Text | An OpenAI API key, from platform.openai.com. Starts with `sk-`. |
| **Google** | Images and video | A Gemini API key, from aistudio.google.com. One key covers every Google model. |
| **Self-hosted** | Whatever you set it up for | Only if your server asks for one. See [Self-hosted models](#self-hosted-models). |

For writing you need Claude, ChatGPT or a self-hosted text model. For pictures and video you need Google (or a self-hosted image model).

The AI section has three parts: **Providers** (Claude, ChatGPT and Google, one row each), **Self-hosted models**, and **More options** at the bottom. A badge at the top right says how many providers are switched on, for example "0 switched on". While none is, a tip at the top repeats the short version of the steps below.

To connect one:

1. Click **Settings** in the sidebar, then **AI** in the side panel.
2. Under **Providers**, click the provider's row, for example **Claude**. It opens.
3. Paste your key into the key field, for example **Anthropic API key**.
4. Leave the suggested model, or pick another under **Model for text** (or **Model for image** and **Model for video** for Google).
5. Make sure **Offer this provider in the editor** is ticked.
6. Click **Save**.

The row now shows "On", and the badge at the top of the page counts it, for example "1 switched on". Click **Test the key**: "Answered" means the key works. "No answer" shows the reason; usually the key is wrong or the account has no credit.

The key is stored encrypted. It is never shown again: the field stays empty on your next visit and only mentions the last four characters of the stored key. Leave it empty when you save other changes and the stored key is kept. **Remove** deletes the stored key; anything already generated stays where it is.

:::caution
If your developer ever changes the installation's secret (`AUTH_SECRET` in [the .env file](../your-project/environment.md)), stored AI keys can no longer be read. You then enter them again.
:::

### The house style

Each provider has a **System prompt**: a few sentences sent along with every request in this space. Use it to describe your house style, for example "We are a family bakery in Vienna. Write warmly, in short sentences, and never use exclamation marks." Leave it empty to use the default shown in the box.

Under **What the dialog opens on** you can preselect a writing style, tone and length (or, for Google, an image style, mood and so on), so editors start with the right settings.

### Lengths

Under **More options** at the bottom of the AI section, click **Lengths** to open that card. It defines what "Short", "Medium", "Long" and "Extensive" mean in this space:

| Length | Words in a field | Words in a document | Blocks |
| --- | --- | --- | --- |
| Short | 30 | 250 | 3 |
| Medium | 90 | 700 | 5 |
| Long | 250 | 1500 | 8 |
| Extensive | 500 | 3000 | 12 |

You can rename them, change the numbers, or add your own. **Back to the defaults** restores the table above.

### Self-hosted models

If you run a model yourself (with Ollama, LM Studio, vLLM, LocalAI or a similar tool), click **Add a model** under **Self-hosted models** in the AI section. You fill in a **Name**, a **Slug**, what the server **Speaks** (OpenAI-compatible or Ollama), its **Base URL**, and **What it can do** (**Write text**, **Draw pictures**, with the model name for each). **Test the connection** checks that the server answers and has the models you named.

This usually needs a developer. A model running on the same computer or in your own network is blocked until it is in the instance's allowed AI hosts. The developer adds its address to `AI_ALLOWED_HOSTS` in the project's `.env`, which `manablox.plugins.ts` hands to the AI plugin (for example `localhost:11434` for Ollama), and restarts the CMS; see [The .env file](../your-project/environment.md#ai-and-workflows). The test tells you which address to add.

## Writing a field with the wand

1. Open a document in **Content**.
2. Next to the label of a text or rich text field, click the small wand. Its tooltip says, for example, "Write Summary with AI", and a window with the same title opens.
3. Choose a **Writing style** (for example Marketing or Technical), a **Tone** (for example Friendly) and a **Length**, if you like.
4. In **Prompt**, say what the text should be about. Name the point to make, not the exact words: "Invite people to our summer bread course on 12 July, beginners welcome".
5. Click **Generate** (or press Cmd+Enter / Ctrl+Enter).
6. The text appears under **Result**. Edit it right there if it is nearly right, or click **Again** for a new try.
7. Click **Use it**. The text goes into the field.
8. Save the document as usual.

The model is told where the text is going: the content type, the field's name, the language you are editing, the document's title and what the other text fields already say. A teaser written this way fits the body that is already there.

At the top of the window you can pick another **Provider** or **Model** for this one generation, for example a cheaper model for a first draft. The space settings stay as they are.

## Generating pictures and videos

Asset fields that take pictures get a **Generate an image** wand; fields that take videos get **Generate a video**. The **Assets** page has the same two buttons next to **Upload files**.

For an image you can choose a style, a **Mood**, an **Aspect ratio** and a **Resolution** (1K, 2K, 4K). For a video you choose a style, a **Camera** movement, an **Aspect ratio** and a **Duration** (4, 6 or 8 seconds). Then describe what should be in the picture or shot and click **Generate**.

A finished picture is saved to the asset library first, then put in the field. It is a normal asset: you can crop it, give it alt text and reuse it (see [Images and files](./assets.md)). It stays in the library even if you do not use it.

Videos can take a few minutes. You can close the window meanwhile; the video still lands in the library.

## Generating a whole document

Click **Generate** at the top of the document editor. The "Generate the whole document" window asks for a prompt and a length, and then writes the title and every text field of the document together, so the teaser and the body talk about the same thing.

If the content type has a block field, AI also picks which blocks the page needs, fills them in and arranges them on the grid. You see the result as a real preview of the block field: you can drag blocks around and change texts before anything reaches your document.

**More controls** lets you steer further:

- **Blocks it may use**: untick blocks the model should leave out.
- **Describe pictures for the image fields**: untick to get text only.
- **Audience**: who you write for, in your own words.
- **Keywords**: words the text should use, the most important first.

### The pictures

When the document has image fields, the first answer contains a short description of each picture instead of the picture itself. If the space also has an image provider, a **Draw N pictures** button appears. The pictures are drawn one after another and appear in the preview as they arrive. You can also skip this and fill the image fields later with their own wands.

Click **Use it** to put everything into the document. It replaces what those fields held. Nothing is saved until you save, so you can still undo or discard.

:::tip
A long document can take a minute or two to write. If it keeps failing after about a minute on a server, ask your developer to check the time limit of the web server in front of Manablox.
:::

## Design with AI

The same providers can build structure for you. Each design is shown in full first; nothing is created until you confirm.

| Where | You describe | You get |
| --- | --- | --- |
| **Content types** > **Describe a content model** | What the website holds | Several content types and the block types they need |
| **Content types** > **Describe it** on a card | One document type or one block type | That type (plus blocks it needs) |
| **Templates** > **Describe a template** | What a template is for | A template with sample text |
| **Workflows** > **New workflow** > **Describe it** | When it starts and what should happen | A complete workflow, switched off |
| **Settings** > **Spaces** > **New space** > **Describe it** | What the new space will hold | A new space with its content types |
| **Design** > **Theme** > **Design with AI** | The mood of the site, and optionally a brand color | Colors, fonts, text sizes, corners and shadows for the theme draft. See [Colors, fonts and spacing](../design/theme.md#let-ai-suggest-a-theme) |
| **Design** > a block designer > **Design with AI** | How the block should look | A design for that block, as a new variant or in place of the current one. See [Designing blocks](../design/blocks.md#let-ai-propose-a-design) |

In the preview you can untick parts you do not want before you click create. A workflow design leaves values only you know (an email address, a web address) as placeholders and says so in its notes. When a design has problems AI could not fix, the preview lists them.

For a new space, you pick which existing space's AI to use. Tick **Give the new space the same AI providers** to copy those providers, keys included, into the new space.

Designs work best with the strongest model you have.

## Work with an AI agent

The **Work with an AI agent** card, under **More options** in the AI section, is for the opposite direction: an AI assistant (such as Claude or ChatGPT in their own apps, or a coding assistant) that builds things in your CMS through its API. The card lists three addresses that describe your installation to such an agent, and a first message to paste into it. Give the agent an [API key](./api-keys.md) with only the permissions the job needs.

## What happened, and what it costs

**Recent generations**, the last card under **More options** in the AI section, lists the latest requests in this space: the prompt, the provider and model, and the reason when one failed. Every generation is also in the [activity log](./activity.md), with who asked for it. Keys never appear in either.

Every click on **Generate** is one paid request to the provider. Nothing is generated in the background or cached. A self-hosted model costs whatever running it costs you.

When you move a space to another installation, the AI providers travel without their keys and arrive switched off. See [Moving a space](./transfer.md).
