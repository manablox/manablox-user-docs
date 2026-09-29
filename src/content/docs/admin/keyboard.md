---
title: "Keyboard shortcuts"
description: "Every key the admin answers to: saving and publishing, jumping between sections, adding blocks and fields, and the help dialog that shows the keys of the page you are on."
---

Most things in the admin can be done without the mouse. You do not have to learn this page by heart: press `?` anywhere and the admin shows exactly which keys work on the page you are looking at.

On a Mac, press `Cmd` where this page says `Ctrl`, and `Option` where it says `Alt`. The help dialog always shows the keys of your own keyboard.

## The help dialog

Press `?`, or click the keyboard button in the top bar (left of the bell). The dialog **Keyboard shortcuts** lists the keys in groups:

| Group | What is in it |
| --- | --- |
| This page | Keys the open page adds, for example "New document" |
| Editing | Save, undo and redo, when an editor is open |
| Blocks, Fields | Adding a block or a field, when the page has one |
| Go to | Jumping to another section |
| Everywhere | Keys that always work |

A row shown faded exists, but has nothing to act on right now: **Redo** when there is nothing to redo, for example. Press `Esc` or click outside the dialog to close it.

## When keys work

- **Keys held with `Ctrl` or `Alt` also work while you type** in a field. That is the point of them: you can save without leaving the text you are writing.
- **Single keys, such as `n` or `/`, wait until you leave the field.** While you type in a text box, `n` is just the letter n. Click outside the field or press `Tab` to leave it first.
- **An open dialog takes over the keyboard.** While a dialog is open, the page's own keys rest. `Esc` closes the dialog.

## Everywhere

| Key | What it does |
| --- | --- |
| `?` | Open the keyboard shortcuts |
| `[` | Show or hide the sidebar |
| `]` | Show or hide the side panel (the content tree, the templates, the types, the menus, the workflows or the sections of the settings) |
| `Esc` | Close the open sidebar or panel on a small screen |

## Going to a section

Press `g`, let go, then press a letter. If you wait too long between the two, `g` is forgotten and you start again.

| Keys | Goes to |
| --- | --- |
| `g` then `d` | Dashboard |
| `g` then `c` | Content |
| `g` then `t` | Templates |
| `g` then `b` | Databags |
| `g` then `m` | Menus |
| `g` then `w` | Workflows |
| `g` then `h` | Webhooks |
| `g` then `y` | Content types |
| `g` then `x` | Databag types |
| `g` then `r` | Redirects |
| `g` then `e` | Design |
| `g` then `a` | Assets |
| `g` then `l` | Activity |
| `g` then `s` | Settings |
| `g` then `n` | Notifications |
| `g` then `p` | Your profile |

A section your role does not show in the sidebar has no key either.

## In an editor

These keys work while you type.

| Key | What it does | Where |
| --- | --- | --- |
| `Ctrl+S` | Save | The document editor, the content type builder, the menu editor and the workflow editor |
| `Ctrl+Z` | Undo | The document editor |
| `Ctrl+Shift+Z` | Redo | The document editor |
| `Ctrl+Enter` | Publish | The document editor, when there is something to publish and you may publish |
| `Alt+N` | Add a block | A page with a Blocks field; see below |
| `Alt+N` | Add a field | The content type builder |

### Adding blocks and fields with the keyboard

`Alt+N` adds a block to the Blocks field you are working in: the one your cursor is in, or the first one on the page. If the field allows only one block type, the block is added straight away and its first field is ready for typing. Otherwise the list of block types opens.

In the content type builder, `Alt+N` opens the **Add field** list.

In these lists, and in the **Which block?** dialog of a block grid, each entry shows a number. Press `1` to `9` (or `0` for the tenth entry) to pick it.

In the visual editor, `Alt+N` adds a block after the one you selected, or at the end of the field you are looking at.

## On a page

| Key | What it does | Where |
| --- | --- | --- |
| `/` | Jump to the search box | Content (before a document is open), Assets, Activity |
| `n` | New document (opens the list of types) | Content (before a document is open) |
| `n` | New template | Templates |
| `n` | New menu | Menus |
| `n` | New workflow | Workflows |
| `n` | New incoming or outgoing webhook, depending on the tab | Webhooks |
| `n` | New document type | Content types (the start page) |
| `b` | New block type | Content types (the start page) |
| `n` | New space (administrators only) | `Settings > Spaces` |
| `u` | Upload files | Assets |
| `Ctrl+A` | Select every asset | Assets |
| `Esc` | Clear the selection | Assets |
| `Del` or `Backspace` | Delete the selected assets | Assets |
| `r` | Mark everything read | Notifications |

The "new" keys belong to the start page of each section, the page you see before you open a document, menu, workflow or type. Inside an editor, `n` does nothing, so you cannot start something new by accident.

## Smaller helpers

- In a dialog where you describe something for the AI to write, `Ctrl+Enter` starts it. See [AI](./ai.md).
- In a row of tabs, such as the ones under **Webhooks**, the left and right arrow keys move between tabs.
- In an open dropdown menu, the up and down arrow keys move between the entries.
- When the edge of a side panel has keyboard focus, the left and right arrow keys make the panel narrower or wider.
