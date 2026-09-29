---
title: "Sending email"
description: "How your CMS sends email: choosing a mail driver, the settings each one needs, catching test mail with Mailpit, and checking that mail arrives."
---

Your CMS sends email for two things: the "Send an email" step in a [workflow](../admin/workflows.md), and [notifications](../admin/notifications.md) that people chose to get by email (for example "A document awaits your approval"). Signing in and signing up do not depend on email, so the CMS works fine without it.

How mail leaves the CMS is set in `.env`. You picked a driver when you created the project (the `--mail` option): Mailpit for a `local` project, none for a `docker` project, unless you chose otherwise.

## What happens without mail

With `MAIL_DRIVER=none` nothing breaks. A workflow's email step fails with the message `mail.notConfigured`, which you see in the workflow's run log, and notifications reach people in the admin and by browser push only. In your profile, on the Notifications tab, the By email column then says "not set up here".

## The drivers

A driver is the way the CMS hands a mail over for delivery. Pick one with `MAIL_DRIVER`:

| Driver | What it is | Good for |
| --- | --- | --- |
| `mailpit` | Mailpit, a test inbox that catches every mail and delivers none | Your own computer, while building |
| `smtp` | Any mail server that speaks SMTP, the standard mail protocol | Your own mail server, or the SMTP relay of your mail provider |
| `gmail` | A Google mailbox, through the Gmail API | Google Workspace or a Gmail account |
| `microsoft` | A Microsoft 365 mailbox, through Microsoft Graph | Microsoft 365, where SMTP sign-in is often switched off |
| `resend` | The Resend email service | Automated mail from your own domain |
| `sendgrid` | The SendGrid email service | Automated mail from your own domain |
| `postmark` | The Postmark email service | Automated mail from your own domain |
| `mailgun` | The Mailgun email service | Automated mail from your own domain |
| `none` | No mail | When you do not need it |

Each driver reads its own variables, listed below. A variable without a default is required: if it is empty, the CMS refuses to start and prints `Missing required environment variable:` with the name of the first one missing. That way a half-finished setup shows up at once, not when the first important mail should go out.

## The sender: MAIL_FROM

`MAIL_FROM` is the sender shown on every mail, written like `Website Team <cms@example.com>` or just `cms@example.com`.

- For `gmail` and `microsoft` you can leave it empty: the mail is then sent as the mailbox itself.
- For every other driver set an address your provider lets you send from, usually one on a domain you verified there. The default, `Manablox <no-reply@localhost>`, is fine for Mailpit, but a real provider will refuse it.

## Mailpit for testing

Mailpit is a mail catcher. The CMS sends to it like to a real mail server, but instead of delivering anything, Mailpit shows every mail in a web inbox. That makes it perfect for trying out workflows: nobody gets a test mail by accident.

In a `local` project created with Mailpit, `pnpm services:up` starts it together with the other services, and `.env` has:

```sh
MAIL_DRIVER=mailpit
MAIL_FROM=Manablox <no-reply@localhost>
MAILPIT_HOST=localhost
MAILPIT_PORT=1025
MAILPIT_UI_PORT=8025
```

| Variable | Default | What it means |
| --- | --- | --- |
| `MAILPIT_HOST` | `localhost` | Where Mailpit runs |
| `MAILPIT_PORT` | `1025` | The port the CMS sends mail to |
| `MAILPIT_UI_PORT` | `8025` | The port of the web inbox. Used by `compose.yml` |

Open `http://localhost:8025` to see the inbox.

If you created the project with another mail choice and want Mailpit later, add this service to `compose.yml`, below the `valkey` service and above the `volumes:` line, keeping the indentation:

```yaml
  mailpit:
    image: axllent/mailpit:latest
    restart: unless-stopped
    ports:
      - '${MAILPIT_PORT:-1025}:1025'
      - '${MAILPIT_UI_PORT:-8025}:8025'
```

Then set the Mailpit lines above in `.env`, run `pnpm services:up` and restart `pnpm dev`.

:::caution
Mailpit never delivers mail. Before real people should receive mail, switch to a real driver.
:::

## The variables of each driver

### smtp

| Variable | Default | What it means |
| --- | --- | --- |
| `SMTP_HOST` | none, required | The address of the mail server, for example `smtp.example.com` |
| `SMTP_PORT` | `465` with `SMTP_SECURE=true`, else `587` | The port of the mail server |
| `SMTP_SECURE` | `false` | `true` for an encrypted connection from the start (usually port 465). `false` starts plain and switches to encryption (STARTTLS, usually port 587) |
| `SMTP_USER` | empty | The user name, if the server wants a login |
| `SMTP_PASSWORD` | empty | The password |
| `SMTP_URL` | empty | Everything in one line instead, for example `smtps://user:pass@smtp.example.com:465`. Replaces the five above |

With `SMTP_URL` set and `MAIL_DRIVER` left out, the CMS uses `smtp` on its own. The separate variables are easier when the password contains characters like `@` or `/`, which would have to be escaped in a URL.

### gmail

| Variable | Default | What it means |
| --- | --- | --- |
| `GMAIL_CLIENT_ID` | none, required | The client id of an OAuth client in a Google Cloud project with the Gmail API switched on |
| `GMAIL_CLIENT_SECRET` | none, required | That client's secret |
| `GMAIL_REFRESH_TOKEN` | none, required | A refresh token for the scope `https://www.googleapis.com/auth/gmail.send` |
| `GMAIL_USER` | `me` | The mailbox to send as. `me` is the account the token belongs to |

You get the refresh token once, for example with Google's OAuth 2.0 Playground set to use your own client. A `MAIL_FROM` other than the mailbox must be one of its "Send mail as" addresses in Gmail.

### microsoft

| Variable | Default | What it means |
| --- | --- | --- |
| `MICROSOFT_TENANT_ID` | none, required | The id of your Microsoft Entra directory (tenant) |
| `MICROSOFT_CLIENT_ID` | none, required | The id of an app registration |
| `MICROSOFT_CLIENT_SECRET` | none, required | A client secret of that app registration |
| `MICROSOFT_SENDER` | none, required | The mailbox that sends, for example `cms@contoso.com` |
| `MICROSOFT_SAVE_TO_SENT_ITEMS` | `false` | `true` keeps a copy in the mailbox's Sent Items |

In the Microsoft Entra admin center, register an app, give it the Microsoft Graph application permission `Mail.Send` with admin consent, and create a client secret. No person has to stay signed in. A `MAIL_FROM` other than the sender needs Send As rights on that address.

### resend, sendgrid, postmark, mailgun

| Variable | Default | What it means |
| --- | --- | --- |
| `RESEND_API_KEY` | none, required | A Resend API key with sending access |
| `SENDGRID_API_KEY` | none, required | A SendGrid API key with Mail Send access |
| `SENDGRID_REGION` | `global` | `eu` for an account with EU data residency |
| `POSTMARK_SERVER_TOKEN` | none, required | The server API token |
| `POSTMARK_MESSAGE_STREAM` | `outbound` | The message stream to send through |
| `MAILGUN_API_KEY` | none, required | A sending API key |
| `MAILGUN_DOMAIN` | none, required | The sending domain |
| `MAILGUN_REGION` | `us` | `eu` for a domain in Mailgun's EU region |

These services only send from addresses or domains you verified with them, so set `MAIL_FROM` to one of those.

## Switching to another driver

1. In `.env`, set `MAIL_DRIVER` to the new driver.
2. Add that driver's variables from the tables above and fill them in. You can delete the lines of the old driver.
3. Set `MAIL_FROM` to an address the new driver may send from.
4. Restart the CMS: Ctrl+C, then `pnpm dev`. In a `docker` project, run `docker compose up -d` instead; Compose hands every variable in `.env` to the CMS container.

If the CMS stops right away with `Missing required environment variable:`, fill in the variable it names. An unknown driver name also stops it, with a message listing the valid ones.

## Checking that mail works

The quickest check is a tiny workflow that mails you:

1. In the admin, open Workflows and create a new workflow.
2. Set the trigger to On an event and tick Published under Events.
3. Add a "Send an email" step, with your own address under To.
4. Save the workflow and switch it on.
5. Publish any page.
6. With Mailpit, open `http://localhost:8025`: the mail should be there within a few seconds. With a real driver, check your inbox (and the spam folder).

If nothing arrives, open the workflow's Runs tab in the admin: a failed email step shows the error message from the mail service. The CMS log in the `pnpm dev` terminal shows a warning `workflow node failed` with the same error; see [Logs](./logging.md). [Workflows](../admin/workflows.md) explains the workflow editor in detail.

:::note
The workflow steps "Send from a mail account" and "Send with Gmail" do not use the settings on this page. They send through a mail account an editor stores in the admin under Settings > Credentials, which is useful when a workflow should send from a specific person's or team's mailbox.
:::
