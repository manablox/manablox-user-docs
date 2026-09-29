import { fileURLToPath } from 'node:url';
import { docsConfig } from '@manablox/docs-theme';
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';

/** The user guide: how to use Manablox, starting from the `manablox` CLI. */
export default defineConfig(
  docsConfig({
    title: 'Manablox Guide',
    description: 'Learn to use Manablox: create a CMS, edit content and build a website for it.',
    siteUrl: 'https://docs.manablox.io',
    contentRoot: fileURLToPath(new URL('./src/content/docs', import.meta.url)),
    integrations: [mermaid({ theme: 'neutral', autoTheme: true })],
    // Explicit reading order; each group mirrors a folder under `src/content/docs/`.
    sidebar: [
      { label: 'Key ideas', slug: 'concepts' },
      {
        label: 'Getting started',
        items: [
          { label: 'Overview', slug: 'getting-started' },
          { label: 'What you need', slug: 'getting-started/before-you-begin' },
          { label: 'Create your CMS', slug: 'getting-started/create-your-cms' },
          { label: 'Sign in and create a space', slug: 'getting-started/first-sign-in' },
          { label: 'Your first page', slug: 'getting-started/first-page' },
          { label: 'Show it on a website', slug: 'getting-started/first-website' },
        ],
      },
      {
        label: 'Your project',
        items: [
          { label: 'A tour of your project', slug: 'your-project' },
          { label: 'Everyday commands', slug: 'your-project/everyday-commands' },
          { label: 'The .env file', slug: 'your-project/environment' },
          { label: 'The database', slug: 'your-project/database' },
          { label: 'Uploads and images', slug: 'your-project/storage-and-media' },
          { label: 'Sending email', slug: 'your-project/mail' },
          { label: 'Logs', slug: 'your-project/logging' },
          { label: 'Content types in code', slug: 'your-project/content-types-in-code' },
          { label: 'Workflows and webhooks in code', slug: 'your-project/resources-in-code' },
          { label: 'Premium plugins and licenses', slug: 'your-project/premium-plugins' },
        ],
      },
      {
        label: 'The content model',
        items: [
          { label: 'How content is organised', slug: 'content-model' },
          { label: 'Field types', slug: 'content-model/field-types' },
          { label: 'Languages and translations', slug: 'content-model/localisation' },
          { label: 'Drafts, publishing and versions', slug: 'content-model/publishing' },
        ],
      },
      {
        label: 'Using the admin',
        items: [
          { label: 'A tour', slug: 'admin' },
          { label: 'Your account', slug: 'admin/your-account' },
          { label: 'Keyboard shortcuts', slug: 'admin/keyboard' },
          { label: 'Spaces and members', slug: 'admin/spaces' },
          { label: 'Users and roles', slug: 'admin/users-and-roles' },
          { label: 'Invitations', slug: 'admin/invitations' },
          { label: 'Two-factor authentication', slug: 'admin/two-factor' },
          { label: 'Single sign-on', slug: 'admin/single-sign-on' },
          { label: 'API keys', slug: 'admin/api-keys' },
          { label: 'Usage', slug: 'admin/usage' },
          { label: 'Messages, read-only and suspended', slug: 'admin/messages' },
          { label: 'Building content types', slug: 'admin/content-types' },
          { label: 'Editing content', slug: 'admin/editing-content' },
          { label: 'Images and files', slug: 'admin/assets' },
          { label: 'Menus', slug: 'admin/menus' },
          { label: 'Redirects', slug: 'admin/redirects' },
          { label: 'Tags', slug: 'admin/tags' },
          { label: 'Workflows', slug: 'admin/workflows' },
          { label: 'Webhooks', slug: 'admin/webhooks' },
          { label: 'Activity', slug: 'admin/activity' },
          { label: 'AI', slug: 'admin/ai' },
          { label: 'Notifications and approvals', slug: 'admin/notifications' },
          { label: 'Moving a space', slug: 'admin/transfer' },
          { label: 'Backups', slug: 'admin/backups' },
          { label: 'Environments', slug: 'admin/environments' },
        ],
      },
      {
        label: 'Designing your website',
        items: [
          { label: 'A website without code', slug: 'design' },
          { label: 'Colors, fonts and spacing', slug: 'design/theme' },
          { label: 'Designing blocks', slug: 'design/blocks' },
          { label: 'Pages, layouts and menus', slug: 'design/pages-layouts-menus' },
          { label: 'Styling one block', slug: 'design/style-a-block' },
          { label: 'Forms', slug: 'design/forms' },
          { label: 'Site settings', slug: 'design/site-settings' },
          { label: 'Password-protected sites', slug: 'design/site-password' },
          { label: 'Domains', slug: 'design/domains' },
          { label: 'Publishing and preview links', slug: 'design/publishing' },
          { label: 'Sharing themes', slug: 'design/sharing-themes' },
        ],
      },
      {
        label: 'Building your website',
        items: [
          { label: 'How a website gets content', slug: 'website' },
          { label: 'The starter website', slug: 'website/starter-website' },
          { label: 'The SDK', slug: 'website/sdk' },
          { label: 'GraphQL', slug: 'website/graphql' },
          { label: 'REST', slug: 'website/rest' },
          { label: 'Preview and the visual editor', slug: 'website/preview' },
          { label: 'The public API', slug: 'website/public-api' },
          { label: 'Caching', slug: 'website/caching' },
          { label: 'A Nuxt website', slug: 'website/nuxt' },
        ],
      },
      {
        label: 'Extending',
        items: [
          { label: 'Plugins', slug: 'extending/plugins' },
          { label: 'Custom field types', slug: 'extending/custom-field-types' },
          { label: 'Workflow actions', slug: 'extending/workflow-actions' },
          { label: 'Hooks', slug: 'extending/hooks' },
        ],
      },
      {
        label: 'Going live',
        items: [
          { label: 'Put it on a server', slug: 'going-live' },
          { label: 'Domains and HTTPS', slug: 'going-live/domains-and-https' },
          { label: 'Updating Manablox', slug: 'going-live/updating' },
          { label: 'Backups', slug: 'going-live/backups' },
          { label: 'Keeping it running', slug: 'going-live/operations' },
          { label: 'Security checklist', slug: 'going-live/security' },
        ],
      },
      {
        label: 'Help',
        items: [
          { label: 'The manablox command', slug: 'help/cli' },
          { label: 'Common problems', slug: 'help/troubleshooting' },
          { label: 'Questions and answers', slug: 'help/faq' },
        ],
      },
    ],
  }),
);
