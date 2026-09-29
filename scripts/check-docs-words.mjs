#!/usr/bin/env node
// Keeps upgrade history out of the guide: nothing is released yet, so the pages describe what
// is, not what changed, and none names something Manablox no longer has.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { lineOf, report } from './lib/scan.mjs';

/** Wording that describes a change rather than the current state, in docs and READMEs. */
const PHRASES = [
  /\bformerly\b/gi,
  /\bused to be\b/gi,
  /\bolder (projects?|instances?|releases?)\b/gi,
  /\bwhere they are missing\b/gi,
  /\btook over from\b/gi,
  /\bbecame a plugin\b/gi,
  /\bbefore (Manablox )?0\.\d+/gi,
  /\b(made|created) (before|with) (Manablox )?0\.\d+/gi,
  /\brenamed (from|to)\b/gi,
  /\bstill (accepted|read) as\b/gi,
  /\bas before\b/gi,
  /\bearlier versions? (of Manablox|had)\b/gi,
  /\bbefore you upgrade\b/gi,
  /\bupgrade guide\b/gi,
  /\bafter an upgrade\b/gi,
];

/** Names Manablox removed; none may come back. */
const NAMES = [
  'formerKinds',
  'renameFormerKinds',
  'moveLegacyBlockDesigns',
  'adoptLegacySettings',
  'legacy-block-ext',
  'legacy-steps',
  'MigrationBackfill',
  'ensureTotals',
  'WORKFLOWS_ALLOW_PRIVATE_NETWORK',
  'workflow_credentials',
  'workflowCredential',
  'siteRedirect',
  'RENAMED_KINDS',
  'LEGACY_MESSAGES',
  'CONTENT_PROTOCOL_VERSION',
  'config.mode.renamed',
  'sdkLevel: 2',
  '/api/hooks',
  'backfill:asset-usages',
  'needsRewrite',
  'smtpUrl',
  'upgrading.md',
  'RENAMES.md',
];

const SELF = 'scripts/check-docs-words.mjs';
const PROSE = (path) => path.endsWith('.md') || path.endsWith('.mdx');
const TEXT = /\.(md|mdx|ts|mts|mjs|js|json|ya?ml|sh|astro|css|html|txt|conf|example)$/;

// Tracked and not yet added files alike, so the check also holds before the first commit.
const files = execFileSync(
  'git',
  ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter((path) => path && path !== SELF && TEXT.test(path) && existsSync(path));

const findings = [];
for (const path of files) {
  const text = readFileSync(path, 'utf8');
  for (const name of NAMES) {
    for (let index = text.indexOf(name); index !== -1; index = text.indexOf(name, index + 1)) {
      findings.push({
        where: `${path}:${lineOf(text, index)}`,
        found: name,
        message: 'a removed name',
      });
    }
  }
  if (!PROSE(path)) continue;
  for (const phrase of PHRASES) {
    for (const match of text.matchAll(phrase)) {
      findings.push({
        where: `${path}:${lineOf(text, match.index)}`,
        found: match[0],
        message: 'describe what is, not what changed',
      });
    }
  }
}

report('docs:words', findings, `${files.length} files`);
