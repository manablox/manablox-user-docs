---
title: "Your account"
description: "Change your name, email and password, set up two-factor authentication, choose which notifications reach you and how, switch between light and dark, and sign out."
---

Your account is your own corner of the admin: your name, the email you sign in with, your password, and how you want to be told about things. Everybody can change these for themselves, whatever their role.

## Opening your profile

Click your name at the bottom of the sidebar. Your profile opens with your name as the heading, your email under it, and a badge that says **administrator** (if you manage the whole installation) or **member**.

The profile has three tabs: **Account**, **Security** and **Notifications**.

## Your name and email

The **Who you are** card on the **Account** tab holds:

| Field | What it is |
| --- | --- |
| Name | What other people see, for example in the activity log and in notifications |
| Email | The address you sign in with. Notifications by email go here too |

Change what you need and click **Save**. You should see the message "Profile saved". The **Save** button stays grey until you actually change something.

If the new email is already used by another account, the admin says so under the field and nothing is saved.

When your installation can send mail, a new email address needs confirming first. After **Save** you see a message that a link was sent to the new address, and you keep signing in with the old one. Open the mail "Confirm your email address" and click the link: the page says the address is confirmed, and from then on you sign in with the new one. The link works once and for a day. If it expired, change the address again to get a new one.

## Two-factor authentication

The **Security** tab turns on a second sign-in step with a code from an app on your phone. See [Two-factor authentication](./two-factor.md).

## Your password

The **Password** card on the same tab changes your password.

1. Type your **Current password**.
2. Type the new one into **New password**. It needs at least 12 characters.
3. Type it again into **New password, again**. If the two differ, you see "The two do not match."
4. Click **Change password**.

You should see the message "Password changed". Your other devices stay signed in.

## Forgot your password

If your installation can send mail, the sign-in page shows a **Forgot password?** link next to the **Password** field.

1. Click **Forgot password?**.
2. Type the email you sign in with and click **Send reset link**.
3. Open the mail "Reset your Manablox password" and click the link in it.
4. Type a new password of at least 12 characters twice and click **Set password**.

You should see "Your password is set". Every device you were signed in on is signed out; sign in again with the new password.

The link works once and expires after an hour. The page always says a link is on its way, even when no account uses that address, so nobody can find out who has an account. If no mail arrives, check your spam folder, and do not ask for more than a few links in a row: the installation sends only a few such mails per hour to one account (three by default).

:::tip
No **Forgot password?** link on the sign-in page? Then your installation has no mail server set up. Ask an administrator of your installation to set a new password for you; see [Users and roles](./users-and-roles.md#resetting-a-password).
:::

## Notifications

The **Notifications** tab decides what you are told about and where it reaches you.

### What to be told about

The table lists each kind of notification, grouped into **Content** and **Spaces**, with a switch per channel:

| Channel | Where it reaches you |
| --- | --- |
| In the admin | The bell in the top bar, and the Notifications page |
| By email | The email address on your profile |
| Push | Browsers where you switched notifications on (see below) |

The kinds of notification are:

| Notification | When it comes | On by default |
| --- | --- | --- |
| A document awaits your approval | Someone who may not publish a type you can publish submitted a document | In the admin, by email, push |
| Your document was approved | A reviewer approved and published a document you submitted | In the admin, by email, push |
| Your document was sent back | A reviewer returned a document you submitted, with a note | In the admin, by email, push |
| A request for approval was withdrawn | The author took back a document that was waiting for you | In the admin |
| You were added to a space, or your role changed | An administrator gave you a role in a space | In the admin, by email |

Switch off what you do not want, then click **Save**. You should see the message "Notification preferences saved". Switching a notification off everywhere means you are not told at all.

A channel marked **not set up here** is greyed out: the installation has no mail server, or no push keys, configured. Ask whoever runs your installation if you need it.

How approvals work is explained in [Notifications and approvals](./notifications.md).

### Push notifications in this browser

Push notifications appear on your computer or phone even when the admin is closed. They work per browser, so you switch them on in each browser you want them in.

1. On the **Notifications** tab, find the card **This browser**.
2. Click the switch **Turn notifications on here**.
3. When your browser asks whether the site may show notifications, allow it.

The switch now says **Notifications are on here**, and your browser appears in the list **Browsers that get notified**, marked **this one**. To stop a browser from being notified, click the trash button next to it in that list, or switch the switch off in that browser.

If the card says notifications are blocked, your browser was told not to allow them for this site. Allow them in the browser's site settings and come back. Push also needs the admin to run on a secure `https://` address, so it may not be available while you try Manablox on your own computer.

## Light and dark

The theme button at the bottom of the sidebar, next to your name, switches the look of the admin. Each click moves one step:

| Icon | Setting |
| --- | --- |
| Sun | Always light |
| Moon | Always dark |
| Screen | Follows your computer's setting (the default) |

Hover over the button to see the current setting. The choice is remembered in this browser only.

## Signing out

Click the **Sign out** button at the very bottom right of the sidebar, next to the theme button. The admin returns to the sign-in page. You stay signed in on your other devices.

If you think someone else is using your account, ask an administrator to sign you out everywhere and to set a new password; see [Users and roles](./users-and-roles.md).

## What only an administrator can change

You cannot change your own role or your memberships in spaces. An owner or admin of a space changes your role there ([Spaces and members](./spaces.md)); an administrator of the installation manages accounts ([Users and roles](./users-and-roles.md)).
