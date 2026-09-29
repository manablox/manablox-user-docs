---
title: "Users and roles"
description: "Create or invite accounts for your team, reset passwords, ban or delete accounts, and define roles that allow exactly what each group of people needs to do in a space."
---

Everyone who works in the admin needs an account, and in every space they work in they have a role that decides what they may do there. This page shows how an administrator manages accounts, and how owners and admins define roles.

## Two layers of access

Access in Manablox has two layers:

| Layer | Where it is set | Choices |
| --- | --- | --- |
| Account type | On the account, under **Settings > Users** | **Administrator** or **Member** |
| Role in a space | On each membership, under **Settings > Members** | Owner, Admin, Editor, Author, Viewer, or a role of the space's own |

An **Administrator** manages the whole installation: every space, every account and every setting, whatever their roles say. A **Member** only reaches the spaces they were added to, with what their role there allows. A member who belongs to no space sees nothing but a note to ask an administrator.

Adding people to spaces and the five built-in roles are explained in [Spaces and members](./spaces.md).

## Users

**Settings > Users** lists every account of the installation. Only administrators see this section.

Search the list by name or email in the box above it. An administrator is marked with a shield; a banned account is crossed out and marked with a ban sign. Click an account to see its details on the right.

:::note
Only the very first account is created by the person installing Manablox, on the setup page a new installation shows instead of the sign-in page. That account becomes an administrator. After that, nobody can sign up on their own: every further account is created here.
:::

### Creating an account

1. Go to **Settings > Users** and click **New user** under the list.
2. Fill in **Name** and **Email**.
3. Type a **Password** of at least 12 characters, or click **Generate** for a random one.
4. Choose the **Instance role**: **Member** for most people, **Administrator** only for people who should manage the whole installation.
5. Click **Create user**.

You should see the message "Created" followed by the name, and the new account opens on the right.

Creating an account this way sends no mail. Give the person the address of the admin, their email and their password yourself, in a safe way. They can change the password under [Your account](./your-account.md). To let people choose their own password instead, send them an [invitation](./invitations.md).

A new member cannot do anything yet. Add them to a space, either from the space ([Spaces and members](./spaces.md)) or right here, see below.

### An account's details

When you select an account, you see:

- **Profile**: the **Name**, the **Email** and the **Instance role**. Change name or email and click **Save**. Picking another instance role takes effect straight away.
- **Spaces**: the spaces the person belongs to, each with a role dropdown and a trash button. To add them to another space, pick it under **Add to space**, choose a **Role** and click **Add**.
- **Access**: when the account was created, and the buttons described below.
- **Danger zone**: deleting the account.

Changes on the **Spaces** card follow the same rules as the space's own Members card. In particular, a space always keeps at least one owner.

### Resetting a password

1. Select the account and click **Reset password** on the **Access** card.
2. Type a new password of at least 12 characters, or click **Generate**.
3. Click **Reset password**.

The person is signed out on every device and signs in again with the new password. Tell them the new password yourself.

If the installation can send mail, people can also reset their own password with **Forgot password?** on the sign-in page; see [Your account](./your-account.md#forgot-your-password).

### Signing someone out everywhere

**Sign out everywhere** on the **Access** card ends every session of that account, for example after a laptop was lost. Confirm with **Sign out everywhere**. The password stays the same, and the person can sign in again at once.

### Banning an account

**Ban** signs the person out everywhere and stops them from signing in until you lift the ban. Nothing they made is touched. Confirm with **Ban account**. A banned account shows a **banned** badge, and the button changes to **Lift ban**, which lets them in again.

### Deleting an account

At the bottom of the account, under **Danger zone**, click **Delete account**. Type the account's email to confirm and click **Delete account** again. The account, its sessions, its API keys and its memberships are removed. The content the person wrote stays.

:::caution
Two rules keep the installation reachable: you cannot ban or delete your own account, and the installation always keeps at least one administrator. To remove the last administrator, make someone else an administrator first.
:::

### Security

**Settings > Security** decides who must use two-factor authentication: nobody, administrators, or everyone. See [Two-factor authentication](./two-factor.md#requiring-it-administrators).

## Roles

A **role** is a named set of permissions in one space. Every space has the five built-in roles (Owner, Admin, Editor, Author and Viewer), and you can add roles of your own when those do not fit. For example, a "Blogger" role that may write and publish blog posts, but only read pages.

Roles are managed under **Settings > Roles**. The section shows the roles of the space you are working in; switch the space with the space switcher in the sidebar to see another space's roles. Owners and admins may create and change roles.

The list on the left has two parts. Each role shows its description under its name.

- **Built-in roles**: the five built-in roles. Click one to see exactly what it allows. They are the same in every space and cannot be changed.
- **Custom roles**: the roles created for this space.

Click a role to open it on the right. The editor has two parts:

- **About this role**: the **Name**, the **Technical name** and the **Description**.
- **What this role may do**: the permissions, grouped into cards (see below).

### Creating a role

1. Go to **Settings > Roles** and click **New role** at the top right. You can also press `n`.
2. Type a **Name**, for example `Blogger`. The **Technical name** fills itself in as `blogger`; it is fixed once the role exists.
3. Optionally, write a **Description**, for example "Writes the blog".
4. Click **Create role**. You should see the message `Created "Blogger"`, and the role appears under **Custom roles** and opens on the right.
5. Under **What this role may do**, allow what the role should have (see below).
6. Click **Save**. You should see the message `Saved "Blogger"`.

From now on you can give the role to members of the space like any built-in role.

To change a role later, select it, change its permissions and click **Save**. To delete it, click **Delete role** next to **Save**. A role that someone still holds cannot be deleted: give those members another role first.

### Permissions

Permissions are grouped by what they are about. Each group is a card you open by clicking its row; **Content** is open when a role opens. A badge on each row shows how much of the group is allowed: **None**, a count such as **2 of 4**, or **All**. Inside an open card, each permission is a box you tick or untick, and the **Allow all** and **Allow none** buttons tick or untick the whole group at once.

| Group | Permissions (separated by semicolons) |
| --- | --- |
| Space | See the space; Change settings; Delete the space; Export the space |
| Content types | See content types; Create and edit content types; Delete content types |
| Content | Read; Write; Delete; Publish (see below) |
| Assets | See assets; Upload and edit assets; Delete assets |
| Menus | See menus; Create and edit menus |
| Redirects | See redirects; Add, edit and remove redirects. See [Redirects](./redirects.md) |
| Workflows | See workflows and their runs; Create, edit and switch workflows on or off. Only with the workflows plugin. See [Workflows](./workflows.md#who-can-do-what) |
| Members | See members; Add, remove and change members |
| Roles | See roles; Create and edit roles |
| Activity | See the activity log |
| Webhooks | See webhooks; Create and edit webhooks. Only with the webhooks plugin. See [Webhooks](./webhooks.md) |
| AI | See the AI settings; Generate content; Configure providers. Only with the AI plugin. See [AI](./ai.md#who-can-do-what) |
| Website | See designs; Edit designs; Publish designs; Edit custom CSS and head code; Manage domains. Only with the website plugin. See [A website without code](../design/index.md#who-may-do-what) |

**See the space** and **See content types** are always ticked and cannot be switched off, because the admin cannot open a space without them.

:::caution
**Export the space** lets someone download every field of every document. Give it only to people you would trust with the whole space.
:::

### Content permissions, type by type

The **Content** card holds a table instead of a list. The columns are the actions **Read**, **Write**, **Delete** and **Publish**. The rows are:

- **All content types**: every document type there is now, and any type created later.
- One row per document type of the space.

Tick an action in the **All content types** row to allow it everywhere; the boxes below are then ticked and locked. Or leave it unticked and tick the action only for certain types. The badge of the **Content** card then says **Some**.

Example: the "Blogger" role gets **Read** for all content types, and **Write**, **Delete** and **Publish** only for the Blog post type. A blogger then sees all pages, but can only create, change and publish blog posts. The **New** menus only offer the types a role may write.

Block types are not listed: a block belongs to the document it sits in, so the document's permissions cover it.

Two things happen automatically:

- A role with **Create and edit content types** and content permissions for single types gets every content action on each type its members create, so they can fill the types they define.
- When a content type is deleted, it disappears from every role.

## Signing out

Signing yourself out is explained in [Your account](./your-account.md#signing-out). To end another person's sessions, use **Sign out everywhere** on their account, see above.
