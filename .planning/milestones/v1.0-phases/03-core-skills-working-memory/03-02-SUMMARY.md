---
phase: 03-core-skills-working-memory
plan: 02
subsystem: vault-analysis
tags: [connection-discovery, health-check, tag-overlap, link-adjacency, levenshtein, orphan-detection]

# Dependency graph
requires:
  - phase: 02-scanning-engine-cache-infrastructure
    provides: "vault-index.json, link-map.json, tag-index.json, scan() function, loadJson utility"
provides:
  - "/connect skill: tag overlap + link adjacency scoring with ranked suggestions and evidence"
  - "/health skill: orphan detection, broken link analysis, fix classification per governance zones"
  - "findConnections function for reuse by other skills (e.g., /health orphan suggestions)"
  - "levenshtein distance function for fuzzy matching"
  - "classifyFix function implementing AUTO/PROPOSE/manual governance classification"
affects: [03-core-skills-working-memory, 05-proactive-intelligence]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Connection scoring via tag overlap (+1) and link adjacency (+0.5) with confidence tiers"
    - "Governance-aware fix classification: auto (single match, distance <=1), propose (ambiguous), manual (no match)"
    - "Cross-skill utility reuse: /health uses findConnections from /connect for orphan suggestions"

key-files:
  created:
    - ".agents/skills/connect/connect-utils.cjs"
    - ".agents/skills/connect/SKILL.md"
    - ".agents/skills/health/health-utils.cjs"
    - ".agents/skills/health/SKILL.md"
  modified: []

key-decisions:
  - "MOC/system file exclusion uses path prefix (06 - Atlas/) plus named file checks for Home, START HERE, Workflow Guide, Tag Conventions"
  - "Link adjacency deduplicates evidence per shared target to avoid inflated scores"
  - "suggestFixes returns objects with both name and distance fields for downstream classifyFix consumption"
  - "classifyFix treats single suggestion with distance > 1 as propose (not auto) to avoid false corrections"

patterns-established:
  - "Connection scoring pattern: tag overlap + link adjacency with configurable weights"
  - "Fix classification pattern: auto/propose/manual aligned with governance.md zones"
  - "Health analysis pattern: connection counting from link-map for orphan detection"

requirements-completed: [CONN-01, CONN-02, CONN-03, CONN-04]

# Metrics
duration: 4min
completed: 2026-03-07
---

# Phase 3 Plan 2: /connect and /health Skills Summary

**Tag overlap + link adjacency connection discovery and governance-aware vault health diagnostics with orphan detection and broken link fix classification**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-07T15:16:51Z
- **Completed:** 2026-03-07T15:20:53Z
- **Tasks:** 3
- **Files created:** 4

## Accomplishments
- Connection scoring algorithm combining tag overlap (+1) and link adjacency (+0.5) with high/medium/low confidence tiers
- Vault health analysis detecting orphan notes (0-1 connections) and broken wiki-links from index data
- Levenshtein distance implementation for typo detection in broken link fix suggestions
- Fix classification implementing governance zones: auto-fix obvious typos, propose ambiguous matches, flag no-match for manual review
- Both SKILL.md files document complete execution flows with code examples for Claude to follow

## Task Commits

Each task was committed atomically:

1. **Task 1: Create connect-utils.cjs utility module** - `a7cc1b3` (feat)
2. **Task 2: Create health-utils.cjs utility module** - `2f356da` (feat)
3. **Task 3: Create /connect and /health SKILL.md definitions** - `d5810db` (feat)

## Files Created/Modified
- `.agents/skills/connect/connect-utils.cjs` - findConnections, formatConnectionSuggestions, ensureFreshIndexes
- `.agents/skills/connect/SKILL.md` - /connect skill interface (115 lines): scoring, execution flow, output format
- `.agents/skills/health/health-utils.cjs` - analyzeHealth, suggestFixes, levenshtein, classifyFix, ensureFreshIndexes
- `.agents/skills/health/SKILL.md` - /health skill interface (151 lines): orphans, broken links, governance compliance

## Decisions Made
- MOC/system file exclusion uses path prefix (`06 - Atlas/`) plus named file checks rather than type-based filtering, since MOCs and system files don't have distinct `type` values in vault-index
- Link adjacency scoring deduplicates evidence entries per shared target to prevent a single note from accumulating inflated scores through multiple links to the same target
- suggestFixes returns structured objects (`{name, distance}`) rather than plain strings so classifyFix can make distance-based decisions
- classifyFix requires both single suggestion AND distance <= 1 for auto-fix; a single suggestion at distance 2 triggers propose (conservative to avoid incorrect auto-corrections)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- /connect and /health skills are complete and ready for use
- findConnections is reusable by /health for orphan link suggestions (cross-skill dependency)
- Both skills depend on Phase 2 scan infrastructure (indexes must exist)
- Plan 03-03 (working memory) and 03-04 (verification) can proceed independently

---
*Phase: 03-core-skills-working-memory*
*Completed: 2026-03-07*

## Self-Check: PASSED

All 4 created files verified on disk. All 3 task commits verified in git history.
