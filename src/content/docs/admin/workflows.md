---
title: "Workflows"
description: "Let the CMS do routine jobs on its own: send an email when a page is published, call another system, run something every morning. Built by joining boxes on a canvas."
---

A **workflow** is a small job the CMS does by itself. Some examples:

- When a page is published, email the team.
- Every Monday at 8:00, send the editors a list of drafts that are still waiting.
- When the online shop calls us, create a document from what it sent.

You build a workflow in the admin by drawing it: a starting point at the top (the **trigger**), then boxes (the **nodes**) that do one thing each, joined by lines that say what comes next. Every time a workflow runs, Manablox keeps a record of what each node did, so you can check it later.

Workflows come from the workflows plugin, the package `@manablox/plugin-workflows`, and starting a workflow from a webhook from the [webhooks plugin](./webhooks.md), `@manablox/plugin-webhooks`. A project made with `manablox create` has them when **Workflows** and **Webhooks** were picked (or `--workflows` and `--webhooks` given). Without them there is no **Workflows** entry in the sidebar. To add them to a project later, a developer runs `pnpm exec manablox plugin install workflows webhooks` in the project folder and restarts the CMS.

## Who can do what

| Role | Workflows |
| --- | --- |
| Owner, admin | See, create, change, run, switch on and off, delete |
| Editor | See workflows and their runs |
| Author, viewer | Nothing; the sidebar entry is hidden |

Building workflows is not an editor's job by default, because a workflow can send mail, call other systems and spend money on AI in the name of the whole space. An admin can give it to other roles in [Users and roles](./users-and-roles.md).

## The workflow list

Click **Workflows** in the sidebar. Each workflow has a row with its name, a short summary of when it starts, how many nodes it has, a copy button and an on/off switch.

A new workflow is always **switched off**. It is saved, but it does nothing until you switch it on. That way you can build and test in peace.

If the page shows a note that mail or push is not configured, the email or push nodes will fail when they run. Ask your developer to set up [sending email](../your-project/mail.md) or push notifications (see [Notifications and approvals](./notifications.md#push-notifications)).

## Triggers: when a workflow starts

The most common kinds of trigger:

| Trigger | Starts when | Good for |
| --- | --- | --- |
| **On an event** (shown as "When content changes" when you create one) | A document is created, updated, saved, deleted, published or unpublished | "Tell someone when X happens" |
| **On a schedule** | A time comes around: every few minutes, every hour, every day, on certain weekdays, once a month, or a custom rule | Reports, reminders, nightly clean-up |
| **On a webhook** | Another system calls a special web address of your space | Reacting to a shop, a form service, a payment provider |
| **When someone runs it** | You click **Run** | Jobs you want to start yourself, like "send this month's newsletter" |

### On an event

Pick one or more **Events**:

| Event | Means |
| --- | --- |
| Created | A new document is saved for the first time. |
| Updated | An existing document is saved again. |
| Saved | Created or updated, any save. |
| Deleted | A document is removed. |
| Published | A document goes live. |
| Unpublished | A document is taken offline. |

Then narrow it down if you like: **Only for these content types** (for example only "Blog post") and, in a space with several languages, **Only in these languages**. Nothing selected means all of them.

### On a schedule

Choose how often under **Repeat**: **Every few minutes**, **Every hour**, **Every day**, **On certain weekdays**, **Once a month** or **Custom (cron)**. Then set the time, and the **Timezone** it is meant in, for example `Europe/Vienna`.

Tick **Look at documents** to hand the workflow a set of documents each time it runs, for example "all drafts of type Article changed in the last week". You choose the **Status**, **Changed within**, the language and the content types. With **Run the steps once per document** ticked, the nodes run once for every matching document instead of once for the whole list.

:::note
A schedule only fires while the CMS is running. A time that passes while the server is off is skipped, not made up for later.
:::

### On a webhook

Pick an **Incoming webhook** (this trigger comes from the webhooks plugin). That is the web address other systems call; you create and manage those under [Webhooks](./webhooks.md). The trigger panel shows **The URL to hand out** with a **Copy** button. Tick **Only for some calls** to react to certain calls only, for example only when the shop says an order was paid.

### When someone runs it

The workflow never starts on its own. Once it is published and switched on, a **Run** button appears in its row of the workflow list and at the top of the editor. Click it, fill in the values it asks for, and click **Run now**. The run page opens so you can watch it.

Under **Values it takes** you decide what **Run** asks for. Give each value a name, for example `month`, and tick **Required** if it must be filled in. Nodes read a value as `{{ input.month }}`, and `{{ actor.name }}` is whoever clicked **Run**.

## Create a workflow

1. Click **New workflow** at the top right.
2. Give it a **Name** that says what it does, for example `Tell the team about new pages`.
3. Under **Starts**, pick **When content changes**, **On a schedule** or **When a webhook is called**. For a webhook, also pick the incoming webhook.
4. Click **Create workflow**.

The editor opens on the **Canvas** tab.

If the CMS includes the AI plugin and your space has an AI provider, the dialog also offers **Describe it**: you write in plain words what should happen, and AI proposes a complete workflow for you to check before it is created. See [AI](./ai.md#design-with-ai).

## The canvas

The editor has three parts:

- The **palette** lists what you can add. On a wide screen it sits left of the canvas; on a narrow one it is under it.
- The **canvas** in the middle shows the workflow. The box at the top, marked "Starts here", is the trigger.
- The **settings panel** on the right shows the settings of whatever you clicked.

Here is how you work with it:

- **Change when it starts**: click the trigger box at the top.
- **Add a node**: click the box it should follow, then click an entry in the palette. The new node is placed underneath and joined up. With nothing selected, it joins the end of the chain.
- **Join two nodes by hand**: drag from the dot at the bottom of one node to the top of another.
- **Change a node**: click it; its settings appear on the right.
- **Remove a node or a line**: click it and use the trash button in the settings panel, or press Delete.
- **Move things around**: drag a node. **Arrange** at the top left of the canvas lays everything out neatly: **Compact** packs the nodes close together, **Relaxed** gives every branch room of its own.

The lines move slowly in the direction the workflow runs, so you can always see which way it goes.

### What a node can do

The palette groups the built-in actions:

| Action | What it does |
| --- | --- |
| **Send an email** | Mails the addresses you write and every member with the roles you pick. |
| **Send a push notification** | Sends a browser notification to members who switched them on. |
| **Call an API** | Sends a request to another system. What it answers can be used by later nodes. |
| **Reshape data** | Builds a new piece of data out of what earlier nodes produced. |
| **Read a website** | Fetches a web page (and optionally the pages it links to) and hands over its text. |
| **Write or draw something** | Asks an AI model for text, a whole document or a picture. Only with the AI plugin, and needs an [AI](./ai.md) provider. |
| **Create a document**, **Update a document** | Writes a document from what the workflow has, for example an AI text. |
| **Send from a mail account**, **Send with Gmail** | Sends mail through a mail account you stored, instead of the CMS's own mail setup. |

And these steer the run, under "Decide, repeat and wait":

| Node | What it does |
| --- | --- |
| **Run a workflow** | Runs another workflow and carries on with what it hands back. |
| **Only continue if...** | Checks rules, for example "content.status is published", and sends the run one of two ways. |
| **Switch** | Compares one value, for example the category of a page, with a list of cases, and sends the run down the first case that matches. If none matches, it goes on by **Otherwise**. |
| **Loop** | Runs the nodes hanging off it again and again: once for every item of a list (**Each item**), a number of times (**Times**), or until some rules hold (**Until**). Then it carries on. |
| **Wait** | Pauses for a number of minutes before the next node. |
| **Stop the run** | Ends the whole run right there, either normally or as failed with a message you write. Nothing can come after it. |

Developers can add more actions with a plugin; they appear in the palette like the built-in ones. See [Workflow actions](../extending/workflow-actions.md).

### The dots on a node

Most nodes have two exits at the bottom:

- **Succeeded**: the normal way on.
- **Failed**: taken when the action goes wrong. Draw a line from here to handle the problem, for example to email yourself.

**Only continue if...** has **Rules hold** and **Rules do not hold**. **Switch** has one exit per case plus **Otherwise**. **Loop** has **For each item** (or **Each time**) and **After the last**. **Wait** has **After the wait**. **Stop the run** has none.

Every node also has these switches at the bottom of its settings:

- **Run this node**: turn a node off without deleting it.
- **Carry on if it fails**: without it, a failing node stops the whole run (unless a line leaves its Failed exit).
- **Wait for every incoming line**: for a node where two branches meet; it then waits for both.

### Using information from the document

Text in a node can contain **placeholders** in double curly braces. When the workflow runs, they are replaced with real values:

| Placeholder | Becomes |
| --- | --- |
| `{{ content.title }}` | The document's title |
| `{{ content.fields.summary }}` | A field of the document, by its technical name |
| `{{ content.permalink }}` | Its path on the website |
| `{{ url }}` | A link to the document in the admin |
| `{{ actor.name }}`, `{{ actor.email }}` | Who made the change |
| `{{ event }}` | What happened, for example `content.published` |
| `{{ space.name }}` | The name of the space |

You do not have to remember them. Start typing `{{` in a text field and a list of the placeholders this node can use appears; keep typing to narrow it down, then press Enter or click one to put it in. Next to text fields and rules there is also a small `{ }` button that lists them all; click one to copy it.

Each node also has a short name under **Called in templates**, for example `email` or `http`. Later nodes can use what this node produced as `{{ nodes.email.something }}`; the `{ }` list shows those too.

## Worked example: email the team when a page is published

This workflow sends one email each time a page goes live. It takes about five minutes.

1. Click **Workflows** in the sidebar, then **New workflow**.
2. Name it `Tell the team about new pages`, keep **When content changes**, and click **Create workflow**.
3. The canvas shows the trigger and one "Only continue if..." node under it. Click that node and click the trash button **Remove this node** in the settings panel. We do not need it here.
4. Click the trigger box at the top. In the settings panel, under **Events**, untick **Saved** and tick **Published**.
5. Under **Only for these content types**, click **Page** (or whichever type your pages use).
6. With the trigger still selected, click **Send an email** in the palette. A new node appears under the trigger, joined to it, with its settings open.
7. In **To**, type your team's address, for example `team@example.com`, and press Enter. Or, under **And every member with a role**, click **Editor** to mail every editor of the space.
8. Look at **Subject** and **Message**. They are filled in already: `{{ content.title }} was {{ event }}` and a short text with a link. Change them if you like, for example to `New page online: {{ content.title }}`.
9. Click **Save draft** at the top right.

The "unsaved" badge next to the title disappears. If something is missing, for example a recipient, saving is refused and a red message says what to fix.

### Test it

1. Click **Test run** at the top.
2. The window "Test it against which document?" opens. Pick a page.
3. You should see the message "Test run went through". The canvas colours each node by what happened.

**Test run** runs the saved draft, and really runs it, so the email really goes out. It works before the workflow is published and while it is switched off, which makes it the right way to test.

:::tip
In a project made with `manablox create` on your own computer, mails are caught by a test inbox instead of being sent. Open `http://localhost:8025` to read them. See [Sending email](../your-project/mail.md).
:::

### Publish it and switch it on

A trigger only ever runs a published version of the workflow, never the draft you are editing.

1. Click **Publish** at the top right. The window "Publish version 1" opens; add a note about what changed if you like, and click **Publish**.
2. Click an empty spot on the canvas, so no node is selected.
3. In the panel on the right, switch **Switched off** to **Switched on**.

From now on, every time someone publishes a page, the team gets an email. You can also use the switch on the row in the workflow list.

When you change the workflow later, **Save draft** keeps your changes without affecting what runs, and **Publish** makes them the next version. The **Versions** tab lists every published version, newest first, with its note; **Restore** copies an old version into the draft.

## Runs: what happened

Open the **Runs** tab in the editor. Each run has a row with the time, what started it, the document (if any), a **test** badge for test runs, and its status:

| Status | Means |
| --- | --- |
| Queued | Waiting to start, usually only for a moment. |
| Running | Working right now. |
| Waiting | Paused at a Wait node, or waiting for a workflow it called. |
| Succeeded | Went all the way through. |
| Failed | A node went wrong; the row shows why in red. |
| Stopped | Ended on purpose, for example at a rule that did not hold. |
| Aborted | Stopped by hand, or by one of the workflow's abort triggers; the row says by what. |

Above the list, **All runs**, **Live** and **Tests** switch between every run, only the real ones and only test runs, and the status menu next to it shows only runs with one status. Long lists are split into pages: **Older runs** and **Newer runs** at the bottom move between them.

A run that is queued, running or waiting has an **Abort** button, and **Abort active runs** above the list stops all of them at once. Both ask first. An aborted run stops where it is; what it already did, for example a sent email, is not undone.

Click a row to open the run. Its page shows who or what started it, when, how long it took and which version it ran, then the canvas with each node coloured by what happened and, next to it, every step: whether it worked, how long it took and what it reported. Click a step's name to find its node on the canvas. **What it started with** shows all the information the placeholders had to work with; if a placeholder came out empty, look there for the right name.

The newest 200 finished runs of each workflow are kept; older ones are removed every ten minutes. Runs that are still queued, running or waiting are never removed.

## Copy, change, delete

- **Duplicate** (in the editor, or the copy button in the list) makes a copy that is switched off, named with "(copy)".
- Change a workflow by opening it, editing, and clicking **Save draft**, then **Publish**. Runs that already happened are not changed, and runs under way finish on the version they started on.
- **Delete** at the top right deletes the workflow and its run history, after asking. Mails it already sent are not undone.

A workflow marked **code** was set up by a developer in the project's files. You can switch it on and off, but not edit it; **Clone** makes an editable copy. See [Workflows and webhooks in code](../your-project/resources-in-code.md).

## Credentials: passwords for other services

Nodes that talk to other services (**Call an API**, **Send from a mail account**, **Send with Gmail**) often need a key or a password. These are stored as **credentials**, under **Settings > Credentials**, or directly from the node with **Add one** next to its **Credential** field.

A credential is stored encrypted. Once saved, nobody can read it back in the admin, and it is never written into the run records. If you need to change it, type the new value over it.

## Safety

A workflow is built in the browser, not reviewed by a developer, so Manablox is careful with it. Nodes cannot reach addresses inside your own network (like `localhost` or a company server), and each run, each answer and each website crawl has a size and time limit. If a node really needs to reach an internal system, that is a decision for your developer, who can allow it with `NET_ALLOW_PRIVATE_NETWORK=true` in the project's `.env` (see [The .env file](../your-project/environment.md#ai-and-workflows)).
