---
title: "Single sign-on"
description: "Sign in with your organisation's account instead of a Manablox password, and, for administrators, connect an identity provider such as Microsoft Entra ID, Google Workspace or Okta."
---

With single sign-on you sign in to Manablox with the account you already use at work, for example your Microsoft, Google or Okta account. You do not need a separate Manablox password.

## Signing in with single sign-on

1. Open the sign-in page and type your **Email**.
2. If your organisation uses single sign-on, a button **Continue with** and the name of your organisation's sign-in appears. If your organisation requires it, the password field goes away.
3. Click **Continue with ...** (or **Sign in**). You go to your organisation's sign-in page.
4. Sign in there as usual. You come back to Manablox, signed in.

Some installations also show the buttons right away, below the sign-in form, so you can click one without typing your address.

The first time, Manablox may create your account for you and add you to the right spaces. If you had a Manablox account with the same address already, it is connected, and your password keeps working unless your organisation requires single sign-on.

:::note
Signing in with single sign-on does not ask for a Manablox two-factor code. Your organisation's sign-in takes care of that, for example with a phone app.
:::

## When it does not work

If something goes wrong, you come back to the Manablox sign-in page with a message:

| Message | What to do |
| --- | --- |
| Your organisation signs in with single sign-on | Use the **Continue with ...** button instead of your password. A **Forgot password?** link does not work for these addresses either |
| There is no account for your address yet | Ask an administrator to invite you |
| No new accounts can be added at the moment | The installation has as many accounts as it may have. Ask an administrator |
| Your identity provider signed you in with an address this provider is not set up for | You signed in at your organisation with another account. Sign out there and try again with your work address |
| Single sign-on is not available at the moment | Sign in with your password, or ask an administrator |
| Single sign-on did not complete | Start again from the Manablox sign-in page. If it keeps happening, ask an administrator |

## Connecting an identity provider (administrators)

1. Go to **Settings > Security** and find **Single sign-on**.
2. Click **Add provider** and choose **OpenID Connect** or **SAML 2.0**. Ask your IT team which one your identity provider uses; most offer both.
3. Type a **Name** (it appears on the button, for example "Acme") and a **Provider id** (short, lower-case, for example `acme`; it cannot be changed later).
4. Under **Email domains**, type your organisation's domain, for example `acme.com`, and press Enter. Add more if needed.
5. Copy the addresses under **Give these to the identity provider** and enter them in your identity provider's new application. Your IT team knows where.
6. With **OpenID Connect**, enter the **Issuer URL**, the **Client id** and the **Client secret** your identity provider shows, and click **Test connection** to check them.
7. With **SAML 2.0**, enter the **IdP sign-in URL**, the **IdP entity id** and the **IdP signing certificate** your identity provider shows, and click **Check certificate** to check it.
8. Choose the options below and click **Add provider**.

| Option | What it does |
| --- | --- |
| **Require single sign-on for these domains** | People with these addresses cannot sign in with a password or reset it. Everyone already signed in stays signed in |
| **List it as a button on the sign-in page** | The button shows even before an address is typed |
| **Create an account at the first sign-in** | People without an account get one when they first sign in. Pick the spaces and roles they join under **New accounts join** |

The client secret is stored encrypted. When you edit a provider, leave **Client secret** empty to keep the one that is stored.

### SAML options

A SAML provider gets its own key and certificate when you add it. The dialog shows the certificate under **SP certificate** with a copy button, and the **Metadata URL** contains it too, so most identity providers pick it up when you give them the metadata URL.

| Option | What it does |
| --- | --- |
| **Sign authentication requests** | Manablox signs its sign-in requests with its key. Turn it on when your identity provider asks for signed requests |
| **Require encrypted assertions** | Your identity provider encrypts what it sends about the person signing in, and Manablox refuses anything that is not encrypted. Give the identity provider the metadata URL again after turning it on |
| **Accept IdP-initiated sign-in** | People can also start from your identity provider's portal, for example by clicking a Manablox tile there, instead of the Manablox sign-in page |
| **Landing page** | Where people land after starting from the portal, for example `/` or `/spaces` |

**Regenerate SP keys** replaces the key and certificate, for example when the certificate is about to expire. The old key stops working at once, so give your identity provider the new certificate (or the metadata URL) right after. Until then, sign-ins through this provider fail.

Single logout is not supported: signing out of Manablox does not sign you out of your identity provider, and signing out there does not sign you out of Manablox.

To remove a provider, click the bin next to it. People who signed in with it stay signed in, but they cannot use it any more. Accounts it created have no password; they can set one with **Forgot password?**.

:::caution
Before you turn on **Require single sign-on**, sign in once with the provider yourself to check that it works. Otherwise people with these addresses may be locked out.
:::

:::note
On some installations single sign-on is not available. Then **Add provider** shows a lock, the providers are only listed, and nobody signs in through them. People can use their passwords again until it is available.
:::
