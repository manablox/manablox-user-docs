---
title: "Tags"
description: "Label your documents and images with tags, then use those labels to find things again and to build tag pages on your website."
---

A **tag** is a label you stick on a document or an image: `travel`, `recipe`, `team
photo`. Tags belong to the space, not to one content type, so the same tag can sit on an
article, on a landing page and on a photo.

You do not set them up in advance. Type a tag that does not exist yet and it is created
for you.

## Tag a document

1. Open the document.
2. Find the **Tags** box in the column on the right.
3. Start typing. Tags the space already has are offered below the box; click one, or press `Enter` to take the first suggestion.
4. A name nobody has used yet is offered with a **new** label. Picking it creates the tag.
5. `Enter` or a comma finishes a tag. Backspace on an empty box removes the last one, and every tag has a small x.
6. Click **Save**, as with any other change.

Tags sit on the document itself, not on one translation. Tag the English article and the
German one carries the same tags; that is what lets a filter cover the whole space
whatever language you work in.

## Tag an image or a file

1. Open **Assets** in the sidebar.
2. Click the file.
3. The panel on the right has a **Tags** box under the name and the alt text.
4. Type the tags and click **Save changes**.

A file shared with another space keeps its own tags in each space.

## Find things by tag

Both **Content** and **Assets** have a **Tags** button beside the search box. Tick one or
more tags and the list narrows to whatever carries any of them. Untick them, or use
**Clear**, to see everything again.

The search box finds tags too. Searching `travel` in **Content** also turns up an article
that never says "travel" but is tagged with it, and in **Assets** it finds `DSC_0431.jpg`
if someone tagged it. That is often the quickest way back to a photo whose file name says
nothing.

## Tidy the list up

Over time two spellings of the same thing appear. Go to `Settings > Tags`. Every tag is listed with how many documents and files carry it.

- **Rename** changes the label everywhere at once. Nothing loses the tag.
- **Merge** picks another tag and moves everything onto it, then removes the first one. This is the fix for "Foto" and "Photo" living side by side.
- **Delete** takes the tag off everything. The documents and files themselves are untouched.

Renaming, merging and deleting need a role that may edit content; editors, admins and
owners can. Everyone in the space sees the tags and the suggestions.

Each of these is recorded in [Activity](./activity.md), so you can see who tidied what.

## Tags on your website

Your website gets the tags of every published document and image, and can ask for a list
of everything carrying a tag. That is how a "Travel" page listing every travel article is
built. The tag's **slug** (the
lower-case, dashed form of its name) is what the website asks for: `tags=travel` on a REST list, `tags: "travel"` in GraphQL or `tags: ['travel']` in the SDK. See [REST](../website/rest.md#lists), [GraphQL](../website/graphql.md#the-questions-you-can-ask) and [The SDK](../website/sdk.md#list-documents).
