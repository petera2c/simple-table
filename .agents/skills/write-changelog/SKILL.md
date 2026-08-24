---
name: write-changelog
description: Write Simple Table changelog entries and bump package versions. Use when adding a changelog version, writing release notes, upgrading package versions, or when the user mentions changelog, CHANGELOG, or a new release.
---

# Write Simple Table changelogs

Changelogs should be plain english, no jargon, concise and should assume little knowledge from the reader.

## Where it lives

- Entries: `apps/marketing/src/constants/changelog.ts`
- Versions (keep all six in lockstep): `packages/core`, `packages/react`, `packages/vue`, `packages/solid`, `packages/svelte`, `packages/angular` — `package.json` `"version"` only
- Examples use `workspace:*`; do not bump them

The changelog page shows **version, date, and the `changes` bullets**. Still fill in `title` and `description`; they are part of the entry.

## Workflow

1. Read the latest entry and `CHANGELOG_ENTRIES` at the bottom of `changelog.ts`.
2. Choose the next version. Default to the next **patch** (for example 4.1.6 → 4.1.7) unless the user names a version.
3. Add `export const vX_Y_Z` immediately after the `ChangelogEntry` type (newest entries stay at the top of the file).
4. Put `vX_Y_Z` first in `CHANGELOG_ENTRIES`.
5. Set `date` to today (`YYYY-MM-DD`).
6. Bump the six package versions to match.
7. Do not invent changes. Only describe what this release actually ships.

## Voice

Write for someone who uses the table, not someone who maintains it.

- Short sentences. Everyday words.
- Say what the user can do, or what stopped going wrong.
- One idea per bullet.
- Prop names are fine when the user sets them (`columnReordering`, `enablePivotPanel`).
- Link a docs page when the change has one.

Do not mention internals: FLIP, WAAPI, compositor, rAF, invert, hold, retarget, virtualization windows, cache hashes, Storybook, or file names.

## Shape

```ts
export const v4_1_7: ChangelogEntry = {
  version: "4.1.7",
  date: "2026-08-16",
  title: "Short name for the release",
  description: "One sentence: what changed for the person using the table.",
  changes: [
    {
      type: "improvement", // "feature" | "improvement" | "bugfix" | "breaking"
      description: "What the user sees or can do now.",
      link: "/docs/column-reordering", // optional
    },
  ],
};
```

Pick `type` from the user's point of view: new thing they can turn on (`feature`), existing thing that works better (`improvement`), something that was wrong (`bugfix`), something they must change in their app (`breaking`).

## Good

From 4.1.6:

> You can now build a pivot from the column editor side panel, and multiple row fields show as normal rows instead of nested expand groups.

> If you put more than one field in Rows (for example Quarter and Product), the table shows a full row for each pair, not a collapsed group you have to expand.

## Bad

From 4.1.2 (too much internals):

> `@simple-table/angular` now builds with ng-packagr (Angular Package Format / partial Ivy). Standalone apps can import SimpleTableComponent without TS-992012.

Rewrite that as: Angular apps can import the table without a compiler error about standalone components.
