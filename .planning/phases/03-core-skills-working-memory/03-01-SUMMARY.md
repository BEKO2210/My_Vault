---
phase: 03-core-skills-working-memory
plan: 01
subsystem: note-creation
tags: [nodejs, templates, date-arithmetic, wiki-links, rollover, cjs, zero-dependency, skill-definition]

# Dependency graph
requires:
  - phase: 02-scanning-engine-cache-infrastructure
    provides: "scanner.cjs scan(), utils.cjs loadJson, vault-index.json, tag-index.json"
provides:
  - "create-utils.cjs: getTemplateInfo, buildFileName, getDateVars, substituteVariables, suggestWikiLinks, mocUsesDataview, ensureFreshIndexes"
  - "daily-utils.cjs: extractOpenItems, formatRolloverSection, dailyNoteExists, mergeRolloverItems (+ re-exported getDateVars, substituteVariables)"
  - "/create SKILL.md: 12-type template-based note creation with hybrid invocation and wiki-link suggestions"
  - "/daily SKILL.md: daily note creation with 7-day rollover, provenance links, and idempotent merge"
affects: [03-02-PLAN, 03-03-PLAN, 03-04-PLAN, phase-4-semantic]

# Tech tracking
tech-stack:
  added: [iso-week-number-algorithm, templater-format-substitution]
  patterns: [skill-utils-pair, re-export-from-sibling-skill, hybrid-invocation, show-and-proceed]

key-files:
  created:
    - .agents/skills/create/create-utils.cjs
    - .agents/skills/create/SKILL.md
    - .agents/skills/daily/daily-utils.cjs
    - .agents/skills/daily/SKILL.md
  modified: []

key-decisions:
  - "Template-to-folder mapping encodes all 12 CLAUDE.md types as a single TEMPLATE_MAP object"
  - "Date arithmetic uses noon anchor (T12:00:00) to avoid timezone-induced date shifts"
  - "Templater-style {{date:FORMAT}} variants handled alongside standard {{date}} substitution"
  - "ISO 8601 week number computed inline (10 lines) rather than adding a library"
  - "daily-utils.cjs re-exports getDateVars and substituteVariables from create-utils.cjs to avoid duplication"
  - "Rollover deduplication compares task text after stripping (from [[...]]) suffix"
  - "MOC auto-add checks for Dataview blocks to avoid duplicate listings"

patterns-established:
  - "Skill Utils Pair: each skill directory has SKILL.md (interface) + utils.cjs (deterministic operations)"
  - "Re-export Pattern: sibling skills import and re-export shared functions to present a single module interface"
  - "Hybrid Invocation: natural language when intent is clear, guided prompts when ambiguous"
  - "Show-and-Proceed: Claude announces choices (template, folder) then executes without waiting for confirmation"
  - "Provenance Links: rolled-over items include (from [[source-date]]) for traceability"

requirements-completed: [NOTE-01, NOTE-02, NOTE-03, NOTE-04]

# Metrics
duration: 5min
completed: 2026-03-07
---

# Phase 3 Plan 1: /create and /daily Skills Summary

**Template-based note creation for all 12 types with variable substitution (including Templater {{date:FORMAT}}), tag-based wiki-link suggestions, and daily note rollover extracting unchecked items from 7-day window with provenance links and idempotent merge**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-07T15:16:38Z
- **Completed:** 2026-03-07T15:21:43Z
- **Tasks:** 3
- **Files created:** 4

## Accomplishments
- Built create-utils.cjs with 12-type template mapping, date arithmetic with year/month boundary handling, and substitution for 8 variable patterns (5 standard + 3 Templater-style)
- Built daily-utils.cjs with regex-based open item extraction from past 7 daily notes, deduplication-aware merge, and provenance-linked rollover formatting
- Created /create SKILL.md documenting full execution flow for hybrid invocation with wiki-link suggestions
- Created /daily SKILL.md documenting daily note lifecycle with rollover behavior, edge cases, and idempotent merge

## Task Commits

Each task was committed atomically:

1. **Task 1: Create create-utils.cjs utility module** - `a7cc1b3` (feat)
2. **Task 2: Create daily-utils.cjs utility module** - `94c36a1` (feat)
3. **Task 3: Create /create and /daily SKILL.md definitions** - `fa5fedd` (feat)

## Files Created/Modified
- `.agents/skills/create/create-utils.cjs` - Template mapping (12 types), filename building, date variables, variable substitution (standard + Templater), wiki-link suggestion scoring, MOC Dataview detection, index freshness check
- `.agents/skills/create/SKILL.md` - /create skill interface: hybrid invocation, 12-type template table, 13-step execution flow, code example, edge cases
- `.agents/skills/daily/daily-utils.cjs` - Open item extraction (7-day window), rollover formatting with provenance links, daily note existence check, non-destructive merge with deduplication, re-exported getDateVars and substituteVariables
- `.agents/skills/daily/SKILL.md` - /daily skill interface: daily note creation/update flow, rollover algorithm, code example, edge cases

## Decisions Made
- **TEMPLATE_MAP as single object:** All 12 template-to-folder mappings encoded in one constant matching the CLAUDE.md table exactly. Single source of truth for getTemplateInfo, buildFileName, and downstream consumers.
- **Noon anchor for dates:** `new Date(dateStr + 'T12:00:00')` avoids timezone shifts that could produce wrong yesterday/tomorrow values near midnight. Consistent with Phase 2 research recommendation.
- **Templater format handling:** Monthly Review uses `{{date:MMMM YYYY}}` and Weekly Review uses `{{date:ww}}` and `{{date:YYYY}}`. These are handled with specific regex replacements before the generic `{{date}}` replacement, avoiding collision.
- **ISO week number inline:** Standard algorithm (nearest Thursday method) implemented in ~10 lines rather than pulling in a date library. Only used for Weekly Review template.
- **Re-export pattern:** daily-utils.cjs imports and re-exports `getDateVars` and `substituteVariables` from create-utils.cjs so the /daily SKILL.md can reference a single module for all operations.
- **Dedup by task text:** mergeRolloverItems strips `(from [[...]])` suffixes before comparing, ensuring the same task is not rolled over twice even if /daily is invoked multiple times.
- **MOC Dataview check:** mocUsesDataview reads the MOC file and checks for `` ```dataview `` blocks. If present, the note appears automatically via Dataview queries and no manual link is needed.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all three tasks executed cleanly with all verification assertions passing.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- /create and /daily skills are complete and ready for use
- create-utils.cjs provides shared infrastructure (getDateVars, substituteVariables, ensureFreshIndexes) that Plan 03-02 (/connect, /health) can import
- The tag-based wiki-link suggestion scoring in suggestWikiLinks establishes the pattern that /connect will extend with link-graph adjacency scoring
- Plan 03-04 verification checkpoint will test both skills end-to-end in Obsidian

## Self-Check: PASSED

All files exist: create-utils.cjs, create/SKILL.md, daily-utils.cjs, daily/SKILL.md
All commits verified: a7cc1b3, 94c36a1, fa5fedd

---
*Phase: 03-core-skills-working-memory*
*Completed: 2026-03-07*
