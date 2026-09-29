---
title: "Menus"
description: "Build the navigations of your website, such as the main menu and the footer links, from your documents and from plain links."
---

Most websites have a few navigations: the main menu at the top, some links in the footer, a small "legal" menu with the imprint and privacy policy. In Manablox you build each of them under **Menus**, and the website asks for them by name.

A menu is separate from the content tree. The tree says where a page lives; a menu says where it is linked from. The same page can be in the main menu and in the footer at the same time.

Seeing menus is open to everyone in a space. Creating and changing them needs a role that may edit menus; editors, admins and owners can.

## Create a menu

1. Click **Menus** in the sidebar.
2. Click **New menu** at the top right (or press `N`).
3. In **Name**, type a name for people, for example `Main navigation`.
4. The **Technical name** fills itself in. Change it to something short, for example `main`.
5. Click **Create menu**.

The menu editor opens, still empty.

The technical name is what the website asks for, so agree on it with whoever builds the site. Common names are `main`, `footer` and `legal`.

:::caution
Changing the technical name later breaks a website that already asks for the old name. Change the **Name** freely; leave the technical name alone once the site uses it.
:::

## Add entries

The **Entries** card in the middle holds the menu's links. There are two kinds.

### A document

1. Click **Add document**.
2. Find the page in the list (you can search) and click it.

The entry shows the document's title and its web address. Only documents whose content type has **Can appear in menus** switched on can be picked (see [Building content types](./content-types.md)).

A document entry follows the page in every language. When the website asks for the German menu, it gets the German page. A page without a German translation is simply left out of the German menu. The editor shows the language you currently work in, noted at the bottom of the card.

A page that is not published yet shows a small status badge in the menu editor. The website only ever gets published pages, so an unpublished page stays out of the menu until you publish it.

### A link

1. Click **Add link**. A new entry called "Untitled link" appears and opens.
2. In **Label**, type the text people should see, for example `Our shop`.
3. In **Address**, type where it goes: a full address like `https://shop.example.com`, or a path on your own site like `/contact`.
4. In **Opens in**, choose **The same tab**, or **A new tab** for a link that leaves your site.

A link set to open in a new tab shows a small "new tab" badge in the list.

### Change the text of an entry

Click an entry to open it. For a document entry, a **Label** you type there replaces the page's title in this menu only. That is useful when the page is called "About our bakery" but the menu should just say "About". Leave the label empty to use the title.

## Order and nest entries

Menus can have levels: a "Products" entry with "Bread" and "Cakes" underneath, for example.

With the mouse, drag an entry by the handle on its left:

- Drop it on the line between two entries to put it there.
- Drop it onto another entry to put it underneath that one.

Without a mouse, or on a touch screen, use the small buttons on each row: **Move up**, **Move down**, **Nest under the entry above** and **Move out one level**. The trash button removes the entry from the menu (the page itself stays).

A number badge on a row tells you how many entries sit underneath it.

## Save

Nothing is stored until you click **Save** at the top right. The badge next to the title says "unsaved" while you have changes. The whole menu is saved in one go.

The **Details** card on the right holds the name, the technical name and a **Description**, a note for your colleagues about where the menu is shown.

## Put a page in menus from the page itself

Open a page in **Content**. In the **Placement** card on the right, **In menus** lists every menu that links to it, each with a link to that menu.

Click **Add to a menu** (or **Change**, once it is in one) to open the picker. It lists every menu of the space with a tick box:

- Tick a menu to put the page in it, untick one to take it out.
- **Nested under** says which entry the page sits under, or **Top level**.
- **Position** says where it sits among the entries around it: **First**, or after the entry you pick.

Click **Save menus** and every menu is updated in one go. Moving the page keeps its entry, its label and everything nested under it. Taking a page out of a menu leaves the entries that were under it in the menu, one level up.

The picker needs the right to edit menus. Without it you only see the list of menus the page is in.

When you delete the last translation of a page, it disappears from every menu automatically.

## Delete a menu

Open the menu and click the trash button next to **Save**, then confirm. The pages in it are not touched, but a website that asks for this menu gets nothing any more.

## How the website gets a menu

The **Fetching it** card on the right shows how a developer asks for this menu, for example `GET /v1/menus/main`. The website gets the entries in your order, with their levels, in the language it asks for, and only published pages. For the developer side, see [The SDK](../website/sdk.md).
