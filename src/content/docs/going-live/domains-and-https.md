---
title: "Domains and HTTPS"
description: "How the web server in front of your CMS gets its certificates: Caddy, nginx with your own certificate, or a web server you already run."
---

HTTPS encrypts the connection between a browser and your server, and browsers warn about any site without it. Some admin features, like push notifications and the visual editor, only work over HTTPS. So every real Manablox installation needs a certificate for its domains.

In a docker project the certificate lives in the web server in front of the CMS, called a reverse proxy: it accepts every request from the internet, handles HTTPS, and passes the request on to the `api` or `public` service. You chose which proxy you want when you created the project, with the question "How will this instance run?" or the `--proxy` option.

| Choice | `--proxy` | Certificates |
| --- | --- | --- |
| Docker behind Caddy | `caddy` (default) | Obtained and renewed automatically |
| Docker behind nginx | `nginx` | You provide them |
| Docker, ports published | `none` | Your own web server handles them |

The proxy decides by the domain name where a request goes: the admin domain goes to `api`, the public domain goes to `public`.

## Caddy: automatic certificates

With Caddy you do nothing except point your domains at the server (see [Put it on a server](./index.md#point-your-domains-at-the-server)). When the stack starts, Caddy asks Let's Encrypt, a free certificate authority, for a certificate for each domain and renews it before it expires.

For that to work:

- Both domains must point at your server in DNS.
- Ports 80 and 443 must be reachable from the internet. Let's Encrypt connects to port 80 to check that you own the domain.
- `ACME_EMAIL` in `.env` should be an address you read.

The settings are in `.env`:

```sh
ADMIN_DOMAIN=cms.example.com
PUBLIC_DOMAIN=content.example.com
ACME_EMAIL=you@example.com
PUBLIC_URL=https://cms.example.com
PUBLIC_API_URL=https://content.example.com
```

`PUBLIC_URL` and `PUBLIC_API_URL` are the addresses the CMS uses in links it builds, for example in emails and image URLs. They must match the domains, including `https://`.

Caddy keeps its certificates in the `caddy-data` volume. Do not delete it: Let's Encrypt limits how often it issues certificates for the same name.

To change a domain later, change both the domain and the matching URL in `.env`, point the new name at the server, and apply it:

```sh
docker compose up -d
```

If a certificate does not arrive, the reason is almost always in the Caddy log:

```sh
docker compose logs caddy
```

The Caddyfile in `caddy/Caddyfile` also adds a few security headers, for example one that tells browsers to always use HTTPS for your domain from now on.

## nginx: your own certificates

With `--proxy nginx`, nginx sits in front and reads the certificate from two files:

| File | Content |
| --- | --- |
| `nginx/certs/fullchain.pem` | The certificate, with the chain your certificate authority gave you |
| `nginx/certs/privkey.pem` | The private key |

One certificate must cover every domain that uses HTTPS, so ask for a certificate that includes both names. The `.gitignore` in `nginx/certs/` keeps these files out of Git.

For a first test you can make a self-signed certificate. Browsers show a warning for it, because nobody vouches for it, but you can click through and try everything:

```sh
./scripts/selfsigned-certs.sh
```

It writes both files into `nginx/certs/`. It runs `openssl` in a temporary container, so you do not need to install anything.

For the real site, get a certificate from your certificate authority or with a tool like certbot, copy the two files into `nginx/certs/` under the names above, and restart nginx so it reads them:

```sh
docker compose restart nginx
```

Certificates expire, often after 90 days. With nginx, renewing is your job: every time you get a new certificate, copy it in and restart nginx again.

In `.env`, `ADMIN_DOMAIN` and `PUBLIC_DOMAIN` hold only the host names, without `https://`. Whether a domain uses HTTPS was decided when the project was created and is written into `nginx/templates/default.conf.template`.

## No proxy: behind your own web server

With `--proxy none` the project has no web server of its own. Compose publishes the admin on port 3000 and the public API on port 3100 of the server (set by `ADMIN_PORT` and `PUBLIC_PORT` in `.env`). Use this when the server already runs a web server for other sites, or your hosting platform provides one.

Your web server then has to:

1. Handle HTTPS for your domains.
2. Send the admin domain to `http://127.0.0.1:3000` and the public domain to `http://127.0.0.1:3100`.
3. Pass on the original host name and the headers `X-Forwarded-Proto`, `X-Forwarded-Host` and `X-Forwarded-For`. The CMS reads them to build correct links and to know the visitor's address for its sign-in protection.
4. Allow uploads at least as large as `FILE_MAX_SIZE_MB` (see below).
5. Not buffer or cut off long-running responses. The admin keeps a connection open for live updates.

In `.env`, set the addresses browsers see:

```sh
PUBLIC_URL=https://cms.example.com
PUBLIC_API_URL=https://content.example.com
```

If your own web server is nginx, the part for the admin can look like this (the certificate lines depend on your setup):

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_buffering off;
    proxy_read_timeout 1h;
    client_max_body_size 32m;
}
```

:::caution
Docker publishes ports on every network interface of the server, and firewall tools like `ufw` do not block ports that Docker publishes. If your web server runs on the same machine, change the two `ports` lines in `compose.yml` to start with `127.0.0.1:`, for example `'127.0.0.1:${ADMIN_PORT:-3000}:3000'`. Then only the web server on the machine itself can reach the CMS.
:::

## A trial without HTTPS

Want to try the docker project on your own computer before you rent a server? Give a domain an `http://` prefix and it is served without a certificate. Names that end in `.localhost` point at your own computer in current versions of Chrome, Firefox and Edge, so they need no DNS.

With Caddy, change these lines in `.env`:

```sh
ADMIN_DOMAIN=http://cms.localhost
PUBLIC_DOMAIN=http://content.localhost
PUBLIC_URL=http://cms.localhost
PUBLIC_API_URL=http://content.localhost
```

Then build and start as usual and open `http://cms.localhost`.

With nginx the choice is made when the project is created, so pass the prefix to the create command, for example `--admin-domain http://cms.localhost --public-domain http://content.localhost`.

The `http://` prefix is also how you run Caddy behind another proxy that already handles HTTPS. Never run a real site on plain `http://` on the open internet: passwords would travel unencrypted.

## Upload size limit

Two settings decide how large an upload can be:

| Variable | Default | Meaning |
| --- | --- | --- |
| `FILE_MAX_SIZE_MB` | `25` | The largest file the CMS accepts, in megabytes |
| `UPLOAD_BODY_LIMIT` | `32MB` (Caddy), `32m` (nginx) | The largest request the proxy lets through to the admin |

An upload travels inside a request with some extra data around it, so keep `UPLOAD_BODY_LIMIT` a bit larger than `FILE_MAX_SIZE_MB`. Note the different spelling: Caddy writes `MB`, nginx writes `m`. The public API accepts no uploads, so its limit is fixed and small.

To allow files up to 100 MB with Caddy, set in `.env`:

```sh
FILE_MAX_SIZE_MB=100
UPLOAD_BODY_LIMIT=110MB
```

Then apply it:

```sh
docker compose up -d
```

Each space can set a lower limit of its own in the admin. See [Uploads and images](../your-project/storage-and-media.md).
