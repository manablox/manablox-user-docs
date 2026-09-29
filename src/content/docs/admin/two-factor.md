---
title: "Two-factor authentication"
description: "Protect your account with a code from an app on your phone, keep backup codes for a lost phone, and require two-factor authentication for administrators or for everyone."
---

With two-factor authentication, signing in needs two things: your password, and a 6-digit code from an authenticator app on your phone. Someone who learns your password still cannot get in.

You need an authenticator app, for example 1Password, Google Authenticator or Microsoft Authenticator.

## Setting it up

1. Click your name at the bottom of the sidebar and open the **Security** tab.
2. On the **Two-factor authentication** card, click **Set up**.
3. Type your **Password** and click **Continue**.
4. Scan the QR code with your authenticator app. If you cannot scan it, type the key shown next to it into the app.
5. Type the 6-digit code the app shows into **Code from your app** and click **Turn on**.
6. Your **backup codes** appear. Click **Copy** or **Download** and keep them somewhere safe, then click **I saved my codes**.

The card now says **On**.

:::caution
The backup codes are shown only once. Each one signs you in once if you lose your phone. Without the phone and without a backup code, only an administrator can help you, by resetting your account.
:::

## Signing in

After your email and password, the sign-in page asks for **Code from your app**. Open the app, type the current code for Manablox, and click **Continue**.

Tick **Trust this device for 30 days** on a computer only you use, and it will not ask for a code there for 30 days.

Lost your phone? Click **Lost your device? Use a backup code** and type one of your backup codes. Each code works once.

After several wrong codes, the sign-in is cancelled and you start again with your password. After many wrong codes in a row, the second step is locked for 15 minutes.

## New backup codes

When you used up most of your backup codes, or think someone saw them:

1. Open **Security** on your profile and click **New backup codes**.
2. Type your **Password** and click **Create codes**.
3. Save the new codes and click **I saved my codes**.

The old codes stop working. You also get a mail "New two-factor backup codes for your Manablox account". If you did not create new codes yourself, change your password at once.

## Turning it off

Click **Turn off** on the **Security** tab and confirm with your password. From then on, signing in needs only your password.

If your installation requires two-factor authentication for your account, there is no **Turn off** button.

## Requiring it (administrators)

An administrator decides who must use two-factor authentication:

1. Go to **Settings > Security**.
2. Choose who must use it, see the table below.
3. Click **Save**.

| Choice | Who must use it |
| --- | --- |
| **Optional** | Nobody; everyone decides for their own account |
| **Required for administrators** | Administrators of the installation, and owners and admins of any space |
| **Required for everyone** | Every account |

Someone who must use it and has not set it up yet signs in as usual and then sees only the page **Set up two-factor authentication**. They can do nothing else until it is on, or sign out.

:::note
On some installations two-factor authentication is not available. Then **Set up** shows a lock, and **Settings > Security** only offers **Optional**. Accounts that already use it keep asking for the code.
:::
