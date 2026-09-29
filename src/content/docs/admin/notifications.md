---
title: "Notifications and approvals"
description: "The bell, the inbox, email and browser notifications, and how a document can go through review before it is published."
---

Manablox tells you about the things that need you: a document waiting for your approval, the answer to a request you made, a new role you were given. You decide where each kind reaches you: in the admin, by email, or as a notification from your web browser.

This page also explains **approvals**: a way to make sure that some documents are checked by a second person before they go live.

## The bell

The bell at the top right of the admin shows a number when you have unread notifications.

1. Click the bell. A small list opens with your latest notifications.
2. Click a notification to open what it is about, for example the document waiting for you. It is marked as read.

**Mark all read** clears the number at once. **See every notification** at the bottom opens the full inbox.

New notifications arrive while you work: a short message pops up at the bottom right of the screen and the number on the bell goes up. You do not need to reload the page. Nothing gets lost while the admin is closed; the inbox keeps everything until you read or remove it.

## The inbox

The inbox lists all your notifications, grouped by day. At the top:

- **All** and **Unread** switch between everything and only what you have not read yet.
- **Mark all read** marks everything as read.
- **Remove read** deletes everything you have already read, to tidy up.
- **Preferences** takes you to the settings described below.

Each notification has small buttons on its right: the tick marks it as read (on a read one, the bell marks it as unread again), and in the inbox the trash button deletes it after asking. With a mouse they appear when you hover over the notification; on a touch screen or a narrow window they are always shown. **Remove read** also asks before it deletes.

The inbox is yours alone and the same in every space. Opening a notification about another space switches the admin to that space first.

## What you are told about

| Notification | Who gets it | Normally sent |
| --- | --- | --- |
| A document awaits your approval | Everyone who may publish that kind of document, except the person asking | In the admin, by email, push |
| Your document was approved | The person who asked | In the admin, by email, push |
| Your document was sent back | The person who asked | In the admin, by email, push |
| A request for approval was withdrawn | Everyone who could have approved it | In the admin |
| You were added to a space, or your role changed | The member | In the admin, by email |

## Choose where notifications reach you

1. Click your name at the bottom of the sidebar. Your profile opens.
2. Open the **Notifications** tab.
3. In the table "What to be told about", each row is a kind of notification and each column a channel: **In the admin**, **By email** and **Push**. Switch on what you want and off what you do not.
4. Click **Save**.

Switching a row off everywhere means you are not told about it at all.

A column marked "not set up here" cannot be used yet, because the installation is missing something (see below). Your choices are kept anyway and start working once it is set up.

### Email

Emails go to the address on your profile (the **Account** tab). They need the installation to be able to send mail. In a project made with `manablox create` on your own computer, mails are caught by a test inbox at `http://localhost:8025` instead of being sent. For real mail, a developer sets it up; see [Sending email](../your-project/mail.md).

### Push notifications

Push notifications pop up on your computer or phone from the web browser, even when the admin is not open. They need two things.

First, the installation needs a pair of push keys. This is a one-time job for the developer: in the project folder they run `pnpm push-keys` and copy the two printed values into `PUSH_VAPID_PUBLIC_KEY` and `PUSH_VAPID_PRIVATE_KEY` in the `.env` file, then restart the CMS. See [The .env file](../your-project/environment.md).

:::caution
The keys must not change once people use push. New keys make every browser that was switched on stop receiving notifications, and everyone has to switch them on again.
:::

Second, each person switches push on in each browser where they want it:

1. Open your profile and the **Notifications** tab.
2. In the card **This browser**, click the switch **Turn notifications on here**.
3. Your browser asks whether this site may show notifications. Click **Allow**.

The switch now says "Notifications are on here", and the browser appears in the list **Browsers that get notified**. Repeat this on your other devices. To stop notifications on a device, click the trash button next to it in the list.

If the switch is greyed out, the card says why:

- "Push is not configured on this instance": the push keys are missing (see above). The card also names the command that makes them, `pnpm push-keys` in a created project.
- "This browser cannot receive push notifications here": the admin must be opened over `https://` (or on `localhost` on your own computer), in a browser that supports push.
- "Notifications are blocked for this site": you once clicked "Block". Allow notifications for the site in your browser's settings, then come back.

Workflows can send push notifications too, with the **Send a push notification** node. They reach the same browsers. See [Workflows](./workflows.md).

## Approvals: a second pair of eyes

Some content should be checked before it goes public, for example press releases or legal pages. For those, an admin can switch on approval for the content type. Then authors write, and someone who may publish checks and publishes.

### Switch it on (admins)

1. Click **Content types** in the sidebar and open the type, for example "Press release".
2. In the **Behaviour** card, tick **Needs approval before publishing**. It is only available when **Publishable** is ticked.
3. Click **Save**.

This does not change who may publish. That is still decided by the roles (see [Users and roles](./users-and-roles.md)): editors, admins and owners may publish; authors may not. What the switch adds is the request, the waiting list and the notifications.

### As an author: ask for approval

1. Create a document of that type and save it. Because you cannot publish it yourself, Manablox opens a request for approval right away, and everyone who can publish it is notified.
2. In the editor's sidebar, the **Approval** card now says "awaiting approval".

You can also ask by hand: click **Ask for approval** in the **Approval** card, add a note for the reviewer if you like (for example "Please check the prices"), and confirm. While the request is open, **Withdraw the request** takes it back.

### As a reviewer: approve or send back

You find open requests in three places: in the bell, on the **Dashboard** under **Waiting for your approval**, and in the **Approval** card of the document itself.

1. Open the document and read it.
2. In the **Approval** card, click **Approve and publish** to publish it right away. You can add a word for the author.
3. Or click **Send back**, and write what should change. The note is required.

The author is notified either way. A document that was sent back stays a draft and shows your note in its **Approval** card. After fixing it, the author clicks **Ask again**.

If a reviewer simply clicks **Publish** on a document with an open request, the request counts as approved. A document has at most one open request at a time, and earlier requests are listed under **Earlier requests** in the card.

Every step (asked, approved, sent back, withdrawn) is also recorded in the [activity log](./activity.md), with the note.

For more about drafts and publishing, see [Drafts, publishing and versions](../content-model/publishing.md).
