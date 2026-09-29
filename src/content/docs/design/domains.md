---
title: "Domains"
description: "Connect your own web addresses to a designed site and choose the main one. Plus how to run the site process on your server."
---

A designed site appears on the domains you add to its space. Until the first domain exists, the site is not public.

Adding and removing domains needs the permission **Manage domains**, which owners and admins have.

## Add a domain

1. Click **Settings** in the sidebar, then **API hosts**. The site's domains are listed below the API hosts, under **Site domains**.
2. Click **Add domain**.
3. In **Host name**, type the domain without `https://`, for example `www.example.com`.
4. Leave **Language** on **Every language**, or pick one language if this domain should show only that language (see below).
5. Click **Save**.

For a try-out on your own computer, add `localhost` and open <http://localhost:3200>.

Your domain must also point at your server, which is set up where you bought it (its DNS settings). See [Put the designed site online](#put-the-designed-site-online) below.

Some installations ask for proof that a domain is yours. Then a new domain carries the badge **not verified** and shows a DNS record to add where you bought the domain, usually a `TXT` record. Add it and click **Verify now**, or wait: Manablox checks again on its own for a week. The site answers on the domain once the record is found. DNS changes can take from minutes to a day to reach everyone.

A developer can do the same from the project folder with `pnpm exec manablox website domains add`, `list`, `verify` and `remove`; see [The manablox command](../help/cli.md#manablox-website).

## The primary domain

The first domain you add becomes the **primary** domain. Links, the sitemap and the address search engines remember use it. When a site has several domains, for example `example.com` and `www.example.com`:

- Tick **Primary domain** on the one you want people to see.
- On the others, tick **Redirect to the primary domain**. Visitors who type them are forwarded to the primary one, and search engines learn which address is the real one.

A domain that is neither primary nor redirecting shows the site too, but tells search engines the primary domain is the original.

## One domain per language

In a multilingual space you can give each language its own domain, like `example.com` for English and `example.de` for German:

1. Under **Settings > General**, section **404 page and languages**, set **Languages in addresses** to **Domain per language**.
2. Add a domain for each language and pick that language under **Language**.

A domain with a language shows only that language, without a language prefix in its addresses.

To forward old addresses of the site to new pages, see [Redirects](../admin/redirects.md).

## Put the designed site online

In a `docker` project made with `manablox create`, the site process is the `site` service. With Caddy (the default), every domain that is not your admin or public API domain goes to it, and Caddy fetches an HTTPS certificate the moment someone first visits a new domain. It asks the site process first, so it only ever gets certificates for domains you added in the admin.

To go live with a designed site:

1. Add the domain in the admin (see [Add a domain](#add-a-domain)).
2. Point the domain at your server in its DNS settings, where you bought it: an `A` record to the server's IP address, or a `CNAME` to its host name.
3. In `.env`, set `SITE_URL` to one of the site's addresses, for example `SITE_URL=https://www.example.com`. The admin uses it to show the design canvas.
4. Run `docker compose up -d` so the change is picked up.

The first visit to a new domain can take a few seconds while the certificate is issued. See [Domains and HTTPS](../going-live/domains-and-https.md) for how certificates work.

With nginx, the site domains are served over plain HTTP until you add a server block with their certificates. Without a proxy (`--proxy none`), the site process is published on `SITE_PORT` (3200) for your own web server to forward the domains to.
