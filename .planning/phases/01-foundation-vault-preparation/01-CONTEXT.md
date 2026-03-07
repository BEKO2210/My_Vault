# Phase 1: Foundation & Vault Preparation - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite the entire vault to English, establish a governance system controlling how Claude evolves the vault, set up action classification (AUTO/PROPOSE/NEVER), create changelog infrastructure, rewrite CLAUDE.md with AI-native instructions, set up path-specific rules, and verify Obsidian compatibility. No new AI features are built — this phase makes the vault ready for them.

</domain>

<decisions>
## Implementation Decisions

### English tone & style
- Tone: Professional but warm — clear, polished, not stiff
- Voice: Mixed — direct "you" in guides and workflows, impersonal in templates and system docs
- Naming conventions: Full English — all existing German titles rewritten (e.g., "Gesundheit.md" → "Health.md", "Entscheidung — Thema.md" → "Decision — Topic.md")
- Scope: Everything — system docs AND user-created notes are rewritten to English

### Autonomy boundaries
- AUTO level: Moderate — AUTO includes filing notes to correct folders, fixing broken links, updating MOCs. PROPOSE for structural changes
- NEVER zone (hard boundaries):
  - Never delete any file
  - Never merge notes
  - Never change note body content without explicit request
  - Never rename files without explicit approval
- Changelog: Log significant actions only (structural changes, new files, moved files, MOC updates). Skip trivial metadata fills
- Proposal format: Claude's discretion — inline for single actions, batched when there are many

### Governance zones
- Content zone (notes, daily entries, personal knowledge): Light assist — Claude can auto-fix broken links and fill missing frontmatter, but never edit body text
- Structure zone (folders, MOCs, navigation, templates): AUTO for safe additions (adding note to existing MOC), PROPOSE for risky changes (new folders, restructuring)
- System zone (.claude/, CLAUDE.md, rules, config): Self-maintaining — Claude can AUTO-update its memory files and changelog. Config and rules changes are PROPOSE
- Enforcement: Documentation + light guardrails — rules in docs, plus a simple validation check Claude runs before making changes

### AI instructions depth
- CLAUDE.md structure: Layered — concise core rules (~150 lines) in CLAUDE.md, detailed per-concern docs in .claude/rules/
- Personality: Proactive partner — suggests connections, flags opportunities, shares insights. Engaged but not chatty
- Memory architecture: Explicitly document the 4-layer memory model (session, working, long-term, project) in CLAUDE.md from Phase 1
- Rules organization: Per concern (naming.md, linking.md, frontmatter.md) — each covers all folders for that topic, not one file per vault folder

### Claude's Discretion
- Exact changelog entry format
- How to structure the validation check for governance enforcement
- Order and grouping of CLAUDE.md sections
- Specific wording of rule files

</decisions>

<specifics>
## Specific Ideas

- User wants Claude as a "proactive partner" — not just executing but actively suggesting connections and improvements
- The 4-layer memory model should be documented upfront even though implementation comes in Phase 3/4 — sets the architectural vision early
- Governance should feel like guardrails, not bureaucracy — light validation checks, not heavy enforcement
- The NEVER zone is strict: no deletions, no merges, no content edits, no renames without approval

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-vault-preparation*
*Context gathered: 2026-03-07*
