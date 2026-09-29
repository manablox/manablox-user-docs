---
title: "Images and files"
description: "Upload pictures and files to the asset library, give them alt text, crop them, set a focal point, and use them in your documents."
---

Every space has one library for its pictures, PDFs, videos and other files. In Manablox these are called **assets**. You upload a file once, and any number of documents can use it. When a website shows an image, Manablox hands it out in ready-made sizes, so a small thumbnail never has to download a huge photo.

Open **Assets** in the sidebar to get there. Everyone in a space can look at the library. Uploading needs a role that may upload files (authors, editors, admins and owners can), and deleting needs a role that may delete them (editors, admins and owners). See [Users and roles](./users-and-roles.md) if a button you expect is missing.

## The library at a glance

The page shows your files as tiles. Above them is a toolbar:

| Control | What it does |
| --- | --- |
| **All**, **Images**, **Other files** | Shows everything, only pictures, or only the rest (PDFs, videos, fonts, ...). |
| **Search by name or tag...** | Finds assets by their name, their file name or a tag they carry. |
| **Tags** | Narrows the library to the tags you tick. See [Tags](./tags.md). |
| Tiles and table buttons (on the right) | Switch between the tile grid and a table with one row per file. |

Click a tile to select it. The **details panel** opens on the right with a preview, the file type, its size and, for a picture, its size in pixels.

You can also select several files at once:

- Hold Ctrl (Cmd on a Mac) and click to add or remove one file.
- Hold Shift and click to select a whole run of files.
- Drag a box over empty space in the grid to select everything it touches.

With more than one file selected, the panel shows how many you picked, a **Select all** button and a button to delete them together.

## Uploading files

1. Click **Upload files** at the top right (or press `U`).
2. Pick one or more files in the window that opens.

You can also drag files from your computer straight onto the grid. The grid lights up and says "Drop to upload".

While it works, the button counts along, for example "Uploading 2 of 5...". When it is done, the new file is selected and its details panel is open. The name of the asset is the file name without its ending: `team-photo.jpg` becomes "team-photo".

Uploading the very same file a second time does not create a copy. Manablox notices it already has these exact bytes in this space and gives you the existing asset.

### When an upload is refused

A red line under the toolbar starts with "Not uploaded" and says why. The two usual reasons are:

- The file is too large for this space.
- The space does not accept this kind of file.

Manablox looks at what a file really contains, not only at its name, so renaming `virus.exe` to `photo.jpg` does not get it in.

An admin decides what a space accepts under **Settings > General**: click the **Uploads** card to open it, set the **Allowed file types** and the **Largest file (MB)**, and click **Save limits**. Leaving them empty follows the limits of the whole installation. A space can only be stricter than the installation, never looser. The installation-wide limits are set by a developer; see [Uploads and images](../your-project/storage-and-media.md).

## Name and alt text

With an asset selected, the details panel has two fields you should fill in:

- **Name**: how the asset is called in the library and in the search.
- **Alt text**: a short description of what the picture shows, for example "Two bakers laughing in front of the oven".
- **Tags**: labels you can find the file by later. Type one and pick it from the list, or create it by typing a new name. See [Tags](./tags.md).

Click **Save changes** afterwards.

Alt text matters. Screen readers read it out to people who cannot see the picture, search engines use it, and a browser shows it when the image fails to load. Describe what is in the picture, not the file ("image123") and not the obvious ("a photo of").

:::tip
Write the alt text once, right after uploading. Every document that uses the picture then gets it for free.
:::

## Editing an image

Select a picture and click **Edit image** in the details panel. A large editor opens with three modes at the top: **Crop**, **Focal point** and **Colour**.

Nothing you do here changes the file you uploaded. Manablox keeps the original and remembers your edits, so you can always go back.

### Turning and mirroring

On the right, under **Orientation**, four buttons turn the picture a quarter left or right and mirror it left to right or top to bottom. They work in every mode. The crop and the focal point turn and mirror with the picture.

### Crop

Use crop to cut away what should never be shown, for example a messy edge or a stranger at the side.

1. Choose **Crop** at the top.
2. Drag the frame to move it, or drag its small square handles to resize it.
3. To keep a fixed shape, pick one of the ratio buttons: **Free**, **Original**, **1:1**, **4:3**, **3:2** or **16:9**.

**Whole image** removes the crop again.

### Focal point

The focal point is the most important spot of the picture, for example a face. When a website needs the picture in a different shape (a square thumbnail from a wide photo, say), it cuts around this point instead of simply keeping the middle.

1. Choose **Focal point** at the top.
2. Click on the subject of the picture. A small circle marks the spot.

**Centre** removes the focal point, so the middle is used again.

### Colour

Choose **Colour** to change **Brightness**, **Contrast**, **Saturation** and **Hue** with sliders, and to pick an **Effect**: **None**, **Grey**, **Sepia** or **Invert**. **Leave the colour alone** resets everything in this mode.

### Check and save

Under **What variants keep** you see small previews of the picture as a square, as a wide 16:9 and as a tall 3:4 image. They show roughly what a website gets when it asks for those shapes.

Click **Save edits**. The details panel now lists the crop, the focal point and any turning or effect. Websites get the edited version from then on.

## Ready-made sizes

A website rarely shows the original photo. It asks Manablox for a named size, called a **preset**, and gets a smaller, web friendly copy (a "variant"). A new project comes with three presets:

| Preset | Size |
| --- | --- |
| `thumb` | Fits in 320 x 320 pixels, for small previews and lists |
| `card` | 640 pixels wide, for cards and teasers |
| `hero` | 1920 pixels wide, for large banner images |

You do not create these copies yourself. `thumb` is made right after the upload (the library shows it on the tiles); the others are made the first time a website asks for them, and then kept. Your crop and colour edits are part of every variant. Which presets exist is set by a developer; see [Uploads and images](../your-project/storage-and-media.md).

## Availability

Normally a file is visible on the website as soon as a published document uses it. A file that no published document uses, for example one only a draft points at, stays hidden from the website: it is left out of documents and lists, and its address on the public API answers "not found". The **Availability** section in the details panel lets you limit that to a time window, for example for a price list that is only valid this month.

1. Click **Availability** to open it. It says "always" when no window is set.
2. Fill in **Publish at**, **Unpublish at**, or both.
3. Click **Save schedule**.

Outside the window, the public website does not serve the file, even if a published document still points at it. Inside the admin you always see it.

## Sharing an asset with another space

If you are a member of several spaces, the details panel has a **Spaces** section with one chip per space. Tick another space and click **Save spaces**: the same file now appears in that library too. It is one asset, so its name, alt text and edits are the same everywhere.

The panel shows a "shared" badge for an asset that is in more than one space. You cannot untick the last space; an asset always belongs somewhere.

## Using images and files in content

Pictures and files get into a document through an **asset field** of its content type (see [Building content types](./content-types.md)).

1. Open the document and find the asset field.
2. Click **Choose asset**. The "Choose an asset" window shows your library, limited to the kinds of file the field accepts.
3. Click the file you want. It appears in the field.
4. Save the document.

In the same window you can search, click **Upload new** or drop a file on the window. A file uploaded there is picked for the field as soon as it lands.

To use a different picture, click **Replace** in the field and choose another asset. The cross on a picked asset removes it from the field (the file stays in the library).

:::note
There is no button to swap the file behind an existing asset. To use a new version of a picture, upload it as a new asset and choose it in your documents with **Replace**.
:::

If your space has an AI provider set up, **Generate an image** and **Generate a video** buttons appear next to **Upload files** and in asset fields. See [AI](./ai.md).

## Copying a link

**Copy URL** in the details panel copies the address of the original file, and **Open** shows it in a new browser tab. This is handy to send a file to a colleague. For a website, let the developer use the ready-made sizes instead.

## Deleting

1. Select the asset.
2. Click **Delete asset** at the bottom of the details panel.
3. Confirm with **Delete asset**.

This removes the file and all its sizes for good. Documents that used it keep an empty reference, so check them afterwards: a web page may now show a gap where the picture was.

For an asset that is shared with other spaces, the button says **Remove from this space** instead. It only takes the asset out of this library; the other spaces keep it.

To delete several files at once, select them and click the delete button in the panel on the right.
