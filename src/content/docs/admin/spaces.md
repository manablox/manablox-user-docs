---
title: "Spaces and members"
description: "Create a space, change its name, website address and languages, decide who works in it with which role, and delete it when it is no longer needed."
---

A **space** is one website or channel, with its own content, languages, images, menus and people. Spaces are listed and created under **Settings > Spaces**, and the space you are working in is set up in the other sections of **Settings**. This page shows how to create a space, change its settings and add the people who work in it.

## Who can do what

| Task | Who may do it |
| --- | --- |
| Create or import a space | Administrators of the installation |
| Change a space's settings | The space's owners and admins |
| Add, remove and change members | The space's owners and admins |
| Delete a space | The space's owners |

The **Settings** entry in the sidebar only appears for people who may change the current space's settings.

## Finding your spaces

In the sidebar, click **Settings**. The side panel lists the sections of the settings in two groups:

- **This space** (with the name of the space you are working in under the heading): General, Members, Roles, Tags, AI (with the AI plugin), Credentials, API hosts, Environments, Export and transfer, Backups and Usage, as far as your role and plan allow. These always act on the space you are working in, the one picked in the space switcher at the top of the sidebar.
- **Instance** ("Shared by every space"): Spaces, Users, Security, API keys, Usage and Licenses (with a premium plugin). Users, Security, Usage and Licenses are for administrators only.

[A tour](./index.md#settings) says what each section is for.

On a small screen, the **Settings** button in the top bar opens this list.

Click **Spaces** to see every space you are a member of (an administrator sees all spaces). Each row shows your role there, and the space you are working in is marked **Current**. Click a row to switch the whole admin to that space; its **General** settings open. You can also switch spaces at any time with the space switcher.

To change another space's settings, switch to it first. Each section has its own address, `/settings?tab=` followed by its name, for example `general`, `members`, `roles`, `tags`, `credentials`, `transfer`, `spaces`, `users` or `keys`, so you can bookmark it. A section a plugin adds is named after the plugin and the section, for example `ai.ai` or `license.licenses`. Opening `/settings` alone shows **General**, or **Spaces** when you have no space yet.

## Creating a space

1. Go to **Settings > Spaces** and click **New space** at the top right. You can also press `n`. When there are no spaces yet, click **New space** in the middle of the page, or **Start with the basic setup** to have **Preconfigured** and **Basic setup** chosen for you.
2. In the **New space** dialog, type a **Name**, for example `Company website`. The **Technical name** fills itself in as `company-website`.
3. Under **Website**, choose **Designed site** to design the website in the admin, or **Own frontend** when a developer builds it (see below), and fill in the address it asks for. The **Website** choice comes from the website plugin, a premium plugin (see [Premium plugins and licenses](../your-project/premium-plugins.md)); an installation without it only asks for the **Frontend URL**.
4. Pick the **Locales** (languages) and the **Default locale**. See [Languages and translations](../content-model/localisation.md).
5. Under **Start with**, choose **Empty space** or **Preconfigured** (see below).
6. For a preconfigured space, click **Next: website type** and pick the **Type of website**. For **Pick your blocks**, tick the **Sections** your pages are built from.
7. For a designed site, click **Next: site design**, pick a **Theme** (colors and fonts) and a **Site design** (see below).
8. Click **Create space**. **Back** returns to the page before with everything you entered.

You should see the message `Space "Company website" created`, and the new space appears in the list. You become its owner.

:::caution
The technical name cannot be changed after the space is created. Websites and programs use it to find the space, so pick something short and lasting. It may only contain lower-case letters, digits, hyphens and underscores, and must start with a letter; the admin corrects what you type.
:::

### Start with

| Choice | What you get |
| --- | --- |
| Empty space | No content types, documents or menus. You build everything yourself |
| Preconfigured | A type of website with its content types, example pages and a main menu, ready to fill. You pick the type on the next page |

### Type of website

| Type | What you get |
| --- | --- |
| Company website | Services, a team, customer quotes, questions and a contact form, on pages built from sections (see below) |
| Product or landing page | One strong home page with features, numbers, a quote and a call to action, and a Pricing page with plans and questions |
| Portfolio | Projects with pictures, shown in a project grid, with a gallery and a contact form (see below) |
| Personal blog | Posts, a few plain pages and a blogroll (see below) |
| Basic setup | A small working website to look at and learn from (see below) |
| Pick your blocks | The sections you tick (see below). The home page shows one of each with example content |
| Describe it | You describe the site in a few sentences, and AI designs the document and block types for it. The types you keep are created together with the space, so a site design you pick covers them too. Only offered when a space you can use has AI set up; see [AI](./ai.md) |

Every type shows the sections it brings. A section is a block type editors add to pages, and each one gets its own design in the site design you pick, so the design always fits the sections of your website:

| Section | What it shows |
| --- | --- |
| Hero | The big opener: headline, subline, picture and a button |
| Text | A headline and formatted text |
| Image and text | Text with a picture beside it and a button |
| Image | One large picture with a caption |
| Gallery | Several pictures in a grid |
| Quote | One highlighted statement and who said it |
| Features | Short points, each with a title and a sentence |
| Numbers | A few key figures with labels |
| FAQ | Questions and their answers |
| Pricing | Plans with a price, what they include and a button |
| Testimonials | Customer quotes, kept as reusable entries |
| Team | People with photo and role, kept as reusable entries |
| Contact form | A form for visitors; what they send is stored as a Message entry |
| Call to action | A short pitch with one button |

With **Pick your blocks**, the space gets the ticked sections, a page type built from them, a home page with one of each and, when the contact form is among them, a Contact page. Testimonials and Team bring their entry types and two example entries each.

The **Basic setup** creates:

| What | Details |
| --- | --- |
| Teaser block | Headline, Body (rich text) and Image |
| Page type | Summary and Components (a Blocks field with teasers), both translated |
| Article type | Date and Image in the sidebar, Summary and Body translated |
| Documents | Home, About and Blog pages, and a "Hello world" article under Blog, all published in the default language |
| Home page | Home, with two teasers side by side on a grid |
| Menu | "Main navigation" with links to the three pages |

The **Personal blog** creates:

| What | Details |
| --- | --- |
| Post type | Date, Cover image and Featured in the sidebar, Summary and Body translated |
| Page type | Summary and Body, for plain pages like About |
| Blogroll entry | A databag type with an Address and a Note, for blogs you recommend |
| Documents | Home, Posts and About pages, two posts under Posts and one blogroll entry |
| Menu | "Main navigation" with Home, Posts and About |

The **Portfolio** creates:

| What | Details |
| --- | --- |
| Project type | Client, Year, Role and Cover image in the sidebar, Summary, Gallery and Body |
| Message type | What visitors send through the contact form |
| Blocks | Hero, Text, Image and text, Gallery, Quote, Contact form, Call to action and Project grid (picked projects) |
| Page type | Summary and Components with these blocks |
| Documents | Home with a hero, a grid of all projects, a gallery and a call to action, Work with three sample projects under it, About with a quote, and Contact with the form |
| Menu | "Main navigation" with Home, Work, About and Contact |

The **Company website** creates:

| What | Details |
| --- | --- |
| Service type | Image, Summary and Body; every service has its own page |
| Databag types | Team member (role, photo, bio), Testimonial (quote, role) and Message (from the contact form) |
| Blocks | Hero, Text, Features, Numbers, Testimonials, Team, FAQ, Contact form, Call to action and Service list |
| Page type | Summary and Components with these blocks |
| Documents | Home (hero, features, services, testimonials and a button to Contact), Services with questions and three services under it, About with numbers and the team, Contact with the form, two team members and two testimonials |
| Menu | "Main navigation" with Home, Services, About and Contact |

Every type is built as if someone had created it by hand, so you can open, change or delete every part of it. All documents are published in the default language. A type is refused when your project already defines one of its type names in code; pick another one or an empty space then.

### Site design

A designed site starts with a complete design on top of its theme: header, footer, menus, how every section looks and how each kind of page is laid out. The theme decides colors and fonts; the design decides the structure, so every design works with every theme, in light and dark mode. The **Site design** page shows the themes in their groups and every design, each with a small preview in the chosen theme's colors. The designs made for the theme's group come first and one of them is picked for you, but you can combine any theme with any design:

| Group | Designs |
| --- | --- |
| Professional | **Atlas**: split hero, raised service cards, a dark footer and a bold call to action. **Harbor**: a colored hero band, centered headings, bordered cards and round team portraits. **Ledger**: a large statement headline, services as rows, one quote at a time and square corners. **Summit**: a floating header, a colored hero panel, cards with a color bar and quotes beside a line |
| Creative | **Spotlight**: a huge headline on a gradient, big project cards and a large footer. **Gallery**: a centered header, a picture across the full width, tall plain cards and thin lines. **Poster**: huge uppercase headlines, a boxed menu and hard outlined cards. **Stage**: a dark header and hero, centered headlines and colorful highlights |
| Personal | **Journal**: a centered masthead, a narrow text column, posts as rows and one quote at a time. **Sunny**: a round portrait beside a big hello, a pill menu and soft cards. **Readme**: a short intro, a plain text list of work and small square marks. **Postcard**: a floating header, a colorful hero panel with the photo first and italic headings |

Choose **Theme only** to start with the theme alone, where every page uses a plain generated design.

The design fits the template you picked under **Start with**: every section of the template and every kind of page gets its own design. Picture spots show a color gradient until you choose an image, so the site looks finished from the start. The design is published right away; open the site's address to see it. Everything can be changed later under **Design**, see [Designing your website](../design/index.md).

### Importing a space

A space exported from another Manablox installation can be brought in with the **Import** button next to **New space** in **Settings > Spaces**. See [Moving a space](./transfer.md).

## Changing a space's settings

Make sure you are working in the space (check the space switcher), then open **Settings > General**. The page shows a few cards stacked on top of each other. Click a card's row to open or close it. While a card is closed, its row shows a one-line summary of the current values, so you can check them without opening anything.

Each card has its own save button and saves only its own fields. Changes you made in another card are not saved with it.

### Name and website

This card is open when the page loads. It holds:

| Field | What it is |
| --- | --- |
| Name | The space's name everywhere in the admin. Can be changed at any time |
| Website address | The address of the website that shows this space. In the **New space** dialog it is called **Frontend URL** |
| Technical name | Shown for reference only. It cannot be changed |

Change what you need and click **Save changes**. You should see the message "Name and address saved".

Under the fields, the card also tells you whether the space has a home page. The home page is chosen with the star in the content tree; see [Editing content](./editing-content.md#the-home-page).

### Languages

| Field | What it is |
| --- | --- |
| Languages | The languages the space is written in. In the **New space** dialog they are called **Locales** |
| Main language | The language a website gets when it does not ask for one. In the **New space** dialog it is called **Default locale** |

Click **Save changes** in this card. You should see the message "Languages saved". See [Languages and translations](../content-model/localisation.md).

### Uploads

**Allowed file types** and **Largest file (MB)** decide what the space's asset library accepts. Click **Save limits** to keep them. See [Images and files](./assets.md).

### Website

With the website plugin, **Settings > General** also holds the website settings of the space, below the uploads: **Website** (designed site or own frontend), **404 page and languages** and **Site password** (the last two only for a designed site). They apply at once and need a role that may change the space's settings. See [Site settings](../design/site-settings.md#website-settings-of-the-space). The domains of a designed site are under **Settings > API hosts**; see [Domains](../design/domains.md).

### Designed site or own frontend

With **Designed site** you design the website in the admin; see [Designing your website](../design/index.md). The **Site URL** starts as `http://localhost:3200`, where the site process runs on a developer's computer, and you pick a **Theme**; the list shows a small preview of each theme's colors and heading font. The new space is switched to a designed site, the theme arrives as a draft, and the host of the Site URL (`localhost`) becomes the site's domain. If another space already uses that host, you see a notice; add a domain later under **Settings > API hosts**.

With **Own frontend** you enter the **Frontend URL**: the address of the website that shows this space, for example `https://www.example.com`. It starts as `http://localhost:3005`, where the starter website runs on a developer's computer. Ask whoever builds the website if you do not know it yet; you can change it later as **Website address** in the **Name and website** card of **Settings > General**.

### What the frontend URL is for

- **Visit site** in the top bar opens this address in a new tab.
- The **Visual** editor shows the website inside the admin while you edit, by loading this address followed by `/preview`. It only works if the website was built with such a preview page; see [Preview and the visual editor](../website/preview.md).

A new space is suggested the address `http://localhost:3005`, where the starter website runs on a developer's computer. For any other website, replace it with the website's real address, or the Visual editor will show an empty frame.

## Members

**Settings > Members** lists everyone who works in the space you are working in, each with a role.

### Adding members

1. Click **Add members** in **Settings > Members**.
2. Search by name or email, and tick everyone you want to add.
3. Choose their **Role**. Everyone you picked gets this role; you can change it per person afterwards.
4. Click **Add** (the button shows how many people you picked).

You should see the message "Member added" (or how many were added). The people you added get a notification about it.

The list only shows people who already have an account. To bring in someone new, click **Invite** next to **Add members** and send them an invitation by email; see [Invitations](./invitations.md). Open invitations are listed under **Invitations**, below the members.

### Changing a role or removing someone

- To change a member's role, pick another one in the dropdown on their row. You should see "Role changed to" followed by the role.
- To remove a member, click the trash button on their row and confirm with **Remove member**. They lose access to this space; their account and their other spaces are untouched.

A space always keeps at least one owner. Removing or demoting the last owner is refused with "A space needs at least one owner - promote someone else first."

### The built-in roles

Every space has these five roles:

| Role | What it may do |
| --- | --- |
| Owner | Everything, including deleting the space |
| Admin | Everything except deleting the space |
| Editor | Read, write, delete and publish content; upload and delete assets; edit menus; see workflows, webhooks, members and roles; use AI |
| Author | Write and delete content, but never publish; upload assets; use AI |
| Viewer | Read only |

A space can also have roles of its own, with exactly the permissions your team needs. They are defined under **Settings > Roles**; see [Users and roles](./users-and-roles.md#roles).

## Uploads and transfer

Two more places belong to each space:

- The **Uploads** card in **Settings > General** (click its row to open it) decides which file types and sizes the space's asset library accepts. See [Images and files](./assets.md).
- **Settings > Export and transfer** downloads the space as a file, for a backup or to move it to another installation. It only appears for people who may export the space. See [Moving a space](./transfer.md).

While a space's import is not finished yet, **General** is the only section under **This space**. It shows the progress of the import instead of the usual cards.

## Deleting a space

Below the cards of **Settings > General**, the red-bordered box **Delete this space** has a **Delete space** button. Only owners see it. It deletes the space you are working in, so check the space switcher first.

1. Click **Delete space**.
2. Type the space's technical name into the box to confirm.
3. Click **Delete space** in the dialog.

The space is removed with its content, its content types and the assets no other space uses. This cannot be undone. Export the space first if you might need it again; see [Moving a space](./transfer.md).
