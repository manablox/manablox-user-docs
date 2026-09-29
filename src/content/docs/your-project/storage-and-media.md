---
title: "Uploads and images"
description: "Where uploaded files are saved (a local folder or an S3-compatible bucket), how large they may be, and how the CMS makes resized images through presets."
---

Every image, PDF or video an editor uploads in the admin has to be saved somewhere. This page explains the two places your CMS can keep them, the limits on what may be uploaded, and how the CMS turns one uploaded photo into the right sizes for your website.

## Two places for files

Where files go is decided by one line in `.env`, `STORAGE_DRIVER`. You picked it when you created the project (the `--storage` option); the default is `local`.

| Driver | Where files go | Good for |
| --- | --- | --- |
| `local` | A folder on the disk of the machine that runs the CMS | Your own computer, and a single server |
| `s3` | A bucket at a storage service that speaks the S3 protocol: Amazon S3, or a compatible service from another provider, or MinIO on your own server | Several servers sharing the same files, or when you want the files outside the server |

A bucket is simply a named storage area at such a service, a bit like a folder in the cloud.

### The local folder

With `STORAGE_DRIVER=local` the CMS writes files into the folder named by `STORAGE_LOCAL_PATH`:

```sh
STORAGE_DRIVER=local
STORAGE_LOCAL_PATH=./data/uploads
```

The path is relative to your project folder, so in a `local` project the files end up in `my-cms/data/uploads`. In a `docker` project they go into a Docker volume called `uploads` instead, which `compose.yml` sets up for you; there you do not change this path.

The files are real content. Back them up together with the database, see [Backups](../going-live/backups.md).

### An S3-compatible bucket

To keep files in a bucket, create the bucket and an access key at your provider first (the CMS does not create buckets). Then fill in these lines in `.env`:

| Variable | Needed | What it means |
| --- | --- | --- |
| `STORAGE_DRIVER` | yes | `s3` |
| `S3_BUCKET` | yes | The name of the bucket |
| `S3_ACCESS_KEY_ID` | yes | The id of the access key |
| `S3_SECRET_ACCESS_KEY` | yes | The secret of the access key. Keep it out of Git like every other secret |
| `S3_ENDPOINT` | for anything that is not Amazon | The address of the provider's S3 API, as the provider documents it. Leave empty for Amazon S3 |
| `S3_REGION` | if the provider wants one | The region of the bucket, for example `eu-central-1`. Empty means `us-east-1` |
| `S3_PUBLIC_URL` | no | A public address the bucket (or a CDN in front of it) serves files from. When set, links to original files point there instead of going through the CMS |

A filled-in example:

```sh
STORAGE_DRIVER=s3
S3_BUCKET=my-cms-uploads
S3_ACCESS_KEY_ID=AKIAEXAMPLE
S3_SECRET_ACCESS_KEY=replace-with-your-secret
S3_ENDPOINT=
S3_REGION=eu-central-1
S3_PUBLIC_URL=
```

Restart the CMS after the change. If one of the three required values is missing, the CMS stops at start with `Missing required environment variable:` and the name of the variable. Upload a test image in the admin to check that everything works; it should appear in the bucket at your provider.

:::caution
Switching the driver does not move files that were already uploaded. The CMS looks for every file in the new place, so older uploads show as broken until you copy them over with the same folder structure (the contents of `data/uploads` go to the top of the bucket). Decide early, ideally before editors start uploading.
:::

In a `docker` project, every `S3_*` variable in `.env` reaches the CMS and the public API container, so filling in `.env` and running `docker compose up -d` is enough.

## What may be uploaded

Two limits apply to every upload in every space:

| Variable | Default | What it means |
| --- | --- | --- |
| `FILE_MAX_SIZE_MB` | `25` | The largest file, in megabytes |
| `ALLOWED_MIME_TYPES` | every image, video, audio and text type, PDF, RTF, and Word, Excel, PowerPoint and OpenDocument files, and web fonts (WOFF, WOFF2) | Which kinds of files are accepted, as a comma-separated list |

`FILE_MAX_SIZE_MB` is in `.env` already. `ALLOWED_MIME_TYPES` is not; add the line if you want to change it. A MIME type is the standard name for a kind of file, like `image/png` or `application/pdf`. An entry that ends in `/` means the whole family, so this allows only images and PDFs:

```sh
ALLOWED_MIME_TYPES=image/,application/pdf
```

The CMS checks the actual content of each file, not just its name, so renaming `virus.exe` to `photo.jpg` does not get it past this list.

These are the limits of the whole installation. Each space can make them stricter (never looser) in the admin, under Settings > Spaces, in the space's Uploads section. See [Images and files](../admin/assets.md).

:::note
In a `docker` project with Caddy or nginx in front, the web server has its own size limit, `UPLOAD_BODY_LIMIT` in `.env` (32 MB by default). Keep it a bit above `FILE_MAX_SIZE_MB`, or large uploads fail before they reach the CMS.
:::

## Image presets

Websites rarely want the original photo straight from a camera. They want a small version for a list, a wide one for a page header, maybe a square one for a profile. The CMS makes these versions for you, and a preset is the recipe for one of them: a name plus a size, a way to fit the image into that size, a file format and a quality.

Your CMS comes with three presets:

| Preset | What it makes |
| --- | --- |
| `thumb` | At most 320 x 320 pixels, WebP, quality 80. Made right after upload; the admin shows it in the asset grid |
| `card` | 640 pixels wide, WebP, quality 82 |
| `hero` | 1920 pixels wide, WebP, quality 84 |

Your website asks for an image by preset name and gets back the finished file. The addresses of these files are signed with a secret (`MEDIA_SIGNING_SECRET`, or `AUTH_SECRET` when that is empty), so nobody can make your server produce arbitrary sizes. That is also why a website never builds image addresses itself: the API hands them out ready to use. See [The SDK](../website/sdk.md) and [Images and files](../admin/assets.md).

### Adding or changing presets

Presets are part of your product, so they live in `manablox.config.ts`, in the `media` section. The file already has one:

```ts
media: {
  eager: ['thumb'],
  signingSecret: envOptional('MEDIA_SIGNING_SECRET') ?? requireEnv('AUTH_SECRET'),
  cachePath: envString('MEDIA_CACHE_PATH', './data/media-cache'),
},
```

To add presets and keep the three built-in ones, import `DEFAULT_MEDIA_PRESETS` and add a `presets` list:

1. At the top of `manablox.config.ts`, add `DEFAULT_MEDIA_PRESETS,` to the list of names imported from `@manablox/core`.
2. Change the `media` section like this:
```ts
media: {
  presets: {
    ...DEFAULT_MEDIA_PRESETS,
    square: { width: 800, height: 800, fit: 'cover', format: 'webp', quality: 80 },
    banner: { width: 2400, height: 800, fit: 'cover', format: 'avif', quality: 60 },
  },
  eager: ['thumb'],
  signingSecret: envOptional('MEDIA_SIGNING_SECRET') ?? requireEnv('AUTH_SECRET'),
  cachePath: envString('MEDIA_CACHE_PATH', './data/media-cache'),
},
```
3. Save. `pnpm dev` restarts by itself; with `pnpm start`, restart it. Run `pnpm typecheck` if you want to be sure the file is correct.

`...DEFAULT_MEDIA_PRESETS` copies `thumb`, `card` and `hero` into the list. Keep it, or at least keep a `thumb` preset: when `presets` is given, it replaces the built-in list completely, and the admin needs `thumb` for its previews.

Each preset takes these settings, all optional:

| Setting | What it means |
| --- | --- |
| `width`, `height` | The size in pixels. Give one to scale to that width or height, or both for a fixed box |
| `fit` | How the image fits into a box with both sides given: `cover` fills the box and cuts off what sticks out, `contain` shows the whole image inside the box, `inside` scales down until it fits, `outside` scales until it covers, `fill` stretches it |
| `format` | `webp`, `avif`, `jpeg` or `png` |
| `quality` | 1 to 100. Lower means smaller files |

With `fit: 'cover'` the CMS keeps the focal point an editor set on the image inside the box, and it always applies the editor's crop and rotation first.

`eager` lists the presets made right after an upload. With `REDIS_URL` set, they are made in the background, so the upload finishes without waiting for them; without it, the upload makes them before it finishes. All other presets are made the first time someone asks for them, then saved and reused. An image that is still waiting for its preset is made on the spot when someone asks for it.

:::caution
Changing the size of an existing preset does not remake images that were already made with it; they keep the old size. To change a size, add a preset with a new name, switch your website to it, and remove the old one later.
:::

A single image field can also ask for sizes of its own, without a preset in the config, and can limit which presets it offers. That is set on the field; see [Field types](../content-model/field-types.md).

## Where resized images are kept

The CMS process saves each resized image next to its original, in the uploads folder or the bucket, so it is made only once. Many requests for the same new size at the same moment also make it only once; across several CMS processes, that needs the shared Valkey (`REDIS_URL`).

The public API is not allowed to write there. It keeps the images it makes in its own folder instead, set by `PUBLIC_MEDIA_CACHE_PATH` (`./data/media-cache-public` by default). `MEDIA_CACHE_PATH` names the same kind of folder for the CMS process, which normally stays empty because the CMS saves into storage.

Both cache folders are safe to delete, for example to free disk space. Missing images are made again on the next request.
