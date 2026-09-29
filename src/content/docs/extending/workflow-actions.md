---
title: "Workflow actions"
description: "Add your own step to the workflow editor, for example one that posts a message to Slack, with a plugin. Its settings form is drawn from its description, so no admin build is needed."
---

A [workflow](../admin/workflows.md) is a chain of steps that runs by itself, for example "when an article is published, send an email to the team". Each step that does something is an **action**. Manablox brings actions for email, HTTP requests and content, and the AI plugin adds one for AI. With a [plugin](./plugins.md) you can add your own, and it shows up in the workflow editor like a built-in one.

An action has two halves:

- A **description**: its name, icon, and the settings form editors fill in. The admin draws the form from this description, so your action works with the admin that comes with your project.
- A **handler**: the code that runs on the server when a workflow reaches the step.

## Example: post a message to Slack

This action sends a message to a Slack channel through Slack's `chat.postMessage` API. It needs a Slack bot token (created in your Slack workspace's app settings, it starts with `xoxb-`), which editors store once as a credential in the admin.

1. Create a file called `slack-action.ts` next to `content-model.ts`:

```ts
import { definePlugin } from '@manablox/core';
import { defineWorkflowAction } from '@manablox/plugin-workflows/define';

interface SlackConfig extends Record<string, unknown> {
  channel: string;
  text: string;
}

export const slackMessage = defineWorkflowAction<SlackConfig>({
  type: 'slack.message',
  label: 'Post to Slack',
  description: 'Posts a message to a Slack channel.',
  icon: 'message-square',
  tone: 'violet',
  group: 'notify',

  inputs: [{ name: 'in', label: 'Anything', type: 'any' }],
  ports: [],
  output: { name: 'ok', label: 'The message', type: 'json' },
  outputPaths: [{ path: 'ts', type: 'text', hint: 'The id Slack gave the message' }],

  // The node asks for a credential of this kind.
  credential: { kinds: ['bearer'], required: true },

  // The settings form in the workflow editor.
  fields: [
    { name: 'channel', label: 'Channel', kind: 'text', required: true, placeholder: '#news' },
    { name: 'text', label: 'Message', kind: 'templateArea', rows: 4, required: true },
  ],

  defaults: () => ({ channel: '', text: 'Just published: {{ content.title }}' }),

  // Tidies the settings when the workflow is saved.
  validate: (config) => ({ ...config, channel: config.channel.trim() }),

  async execute(ctx) {
    const response = await ctx.fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: `Bearer ${ctx.credential?.data.token ?? ''}`,
      },
      body: JSON.stringify({ channel: ctx.config.channel, text: ctx.render(ctx.config.text) }),
      signal: ctx.signal,
    });
    const answer = (await response.json()) as { ok: boolean; error?: string; ts?: string };
    if (!answer.ok) throw new Error(`Slack said no: ${answer.error ?? response.status}`);

    return { kind: 'ok', message: `Posted to ${ctx.config.channel}`, output: { ts: answer.ts } };
  },
});

export const slackPlugin = definePlugin({
  name: 'slack',
  // Adds to the workflows plugin when it is there.
  enhances: ['workflows'],
  contributions: { workflows: { actions: [slackMessage] } },
});
```

Workflows are themselves a plugin, `@manablox/plugin-workflows`, and your plugin adds its
action to it under `contributions`. `defineWorkflowAction` is imported from
`@manablox/plugin-workflows/define`, which a project has once workflows are picked in
`manablox create` or added with `manablox plugin install workflows`. On a CMS process without the workflows
plugin, such as the public API, the contribution is simply skipped.

2. Add `slackPlugin` to the `plugins` list in `content-model.ts`:

```ts
import type { ManabloxConfig } from '@manablox/core';
import { manabloxFields } from '@manablox/fields';
import { slackPlugin } from './slack-action.ts';

export const plugins: NonNullable<ManabloxConfig['plugins']> = [manabloxFields(), slackPlugin];

export const contentTypes: NonNullable<ManabloxConfig['contentTypes']> = [];
```

3. Save. `pnpm dev` restarts by itself.
4. In the admin, go to `Settings > Credentials` and add a credential of the kind "Bearer token". Paste the Slack bot token as the token.
5. Open a workflow (or create one), and in the list of steps look under **Tell someone**: **Post to Slack** is there. You can also type "slack" into **Search actions**.
6. Add it, pick your credential under **Credential**, enter a channel and adjust the message. Save the workflow.

When the workflow runs, the message appears in the channel, and the run log shows "Posted to #news". If Slack refuses, the step fails with "Slack said no:" and Slack's reason, for example `not_in_channel` when the bot has not been invited to the channel.

## The description

| Key | What it is |
| --- | --- |
| `type` | The action's unique technical name, stored in every workflow that uses it. Keep it stable. Use your own prefix, like `slack.message` |
| `label`, `description` | What the list of steps shows |
| `icon` | An icon name the admin knows, for example `message-square`, `blocks`, `bell` |
| `tone` | The colour of its tile: `cyan`, `violet`, `pink`, `amber` or `plain` |
| `group` | Where it is listed: `notify` (Tell someone), `data` (Fetch and shape data), `content` (Content) or `integration` (Integrations). A name of your own starts a new group, with `groupLabel` as its heading |
| `inputs` | What the step expects to receive. Only a hint for the editor |
| `ports` | Extra exits besides "Succeeded" and "Failed", which every action has. Usually `[]` |
| `output`, `outputPaths` | What the step hands to later steps, and which parts of it the editor offers in its data picker |
| `credential` | The credential kinds the step accepts and whether one is required, or `null` for none |
| `fields` | The settings form, below |
| `defaults()` | The settings a new step starts with |
| `validate(config)` | Optional. Cleans up the settings when the workflow is saved and returns them |
| `isAvailable(manablox)` | Optional. Returns `{ ok: false, reason }` when this CMS cannot run the action. The step is then still listed, marked with the reason |
| `execute(ctx)` | The handler, below |

The credential kinds are `apiKey`, `bearer`, `basic`, `oauth2`, `smtp`, `signing` and `custom`. Editors create credentials under `Settings > Credentials`; the node only offers credentials of the kinds you list.

## The settings form

Each entry in `fields` becomes one input in the step's settings. `name` is the key in `ctx.config`, `label` what the editor sees, and `kind` the type of input:

| `kind` | Input |
| --- | --- |
| `text`, `password`, `number`, `textarea` | Plain inputs |
| `template`, `templateArea` | A line or a box where editors can use placeholders like `{{ content.title }}` |
| `switch` | A yes or no switch |
| `select`, `multiselect` | A choice from `options`, each `{ value, label }` |
| `stringList` | A list of short texts |
| `keyValue` | Name and value pairs, for example headers |
| `json` | A JSON document |
| `rules` | A set of rules like a condition step has: a value, a comparison and what to compare it with, matching all or any of them |
| `contentType`, `locale`, `role`, `user` | A picker filled from the space |

More options per field: `hint`, `placeholder`, `required`, `rows` (for boxes), `min`, `max` and `step` (for numbers), `width: 'half'` to put two fields on one row, and `showWhen: { field, equals }` to show a field only while another field has one of the given values.

## What the handler gets

`execute` receives `ctx` with everything the step needs:

| Part of `ctx` | What it is |
| --- | --- |
| `ctx.config` | The step's settings, after `validate` |
| `ctx.render(text)` | Fills in placeholders like `{{ content.title }}`. Run everything an editor typed through it |
| `ctx.run` | What the run knows: `content` (the document), `previous`, `space`, `actor`, `event`, and `nodes` with the output of every earlier step |
| `ctx.fetch` | Like `fetch`, but refuses private network addresses and limits redirects and response size. Use it instead of the global `fetch` |
| `ctx.signal` | Pass it to every request, so the workflow's time limit can stop your step |
| `ctx.credential` | The credential the editor picked, decrypted, or `null`. Its values are in `ctx.credential.data` (a bearer token in `data.token`) and are hidden in the run log automatically |
| `ctx.secret(value)` | Hides another value from the run log, for example a token you received |
| `ctx.logger` | Writes to the CMS log |
| `ctx.workflow` | The workflow's `id`, `name` and `spaceId` |

## What the handler returns

| Return | Meaning |
| --- | --- |
| `{ kind: 'ok', message, output }` | Done. `message` is one line for the run log, `output` is what later steps read as `{{ nodes.<key>.<path> }}` |
| `{ kind: 'stop', message }` | End this branch of the workflow quietly |
| `{ kind: 'wait', minutes }` | Pause the run and continue it later |

Throwing an error fails the step. The workflow then takes the step's "Failed" exit, or stops, depending on how it is drawn.

## Good to know

- An action runs on the server in the admin's process, where workflows run.
- If you give your action the same `type` as a built-in action, yours replaces the built-in one.
- If you remove the plugin, workflows that use the action can no longer be saved and report "No action of that kind is installed here." Put the plugin back or remove the step.
- A step can be given a custom settings component through the plugin's admin bundle, which the admin loads when it starts (the workflows plugin's `workflows:nodeForm` slot). The generated form covers what the built-in actions need.
- Besides actions, a plugin can add new ways to start a workflow (trigger kinds), new kinds of fields for the settings form, and hints for designing workflows with AI. The webhooks plugin adds the webhook trigger this way. The developer documentation describes it under [Workflow actions](https://dev.manablox.io/extending/workflow-actions/).
- On a server, rebuild after changes, as described in [Plugins](./plugins.md#plugins-on-the-server).
