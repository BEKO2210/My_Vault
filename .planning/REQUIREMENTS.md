# Requirements: Firstbrain -- AI-Native Second Brain

**Defined:** 2026-03-07
**Core Value:** Claude autonomously maintains, connects, and evolves the knowledge base so the user can focus on thinking and creating -- not filing and organizing.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FOUND-01**: All vault content (templates, MOCs, guides, system docs) rewritten in English
- [x] **FOUND-02**: CLAUDE.md rewritten with AI-native instructions covering autonomous behavior, memory, skills, and governance
- [x] **FOUND-03**: Path-specific rules in .claude/rules/ for per-directory conventions
- [x] **FOUND-04**: Evolution governance system with three zones (content/structure/system) and explicit rules for each
- [x] **FOUND-05**: Action classification system (AUTO / PROPOSE / NEVER) codified and enforced
- [x] **FOUND-06**: Changelog infrastructure (.claude/changelog.md) logging all autonomous actions
- [x] **FOUND-07**: Obsidian compatibility checklist verified (graph view, search, Properties panel, Dataview queries)

### Scanning & Indexing

- [x] **SCAN-01**: Level 1 parser extracts frontmatter, wiki-links, tags, and headings from all .md files
- [x] **SCAN-02**: Incremental scanning with content hashing detects changed files without full vault re-reads
- [x] **SCAN-03**: vault-index.json contains per-note metadata (path, type, tags, links, headings, hash, mtime)
- [x] **SCAN-04**: link-map.json maps every wiki-link to source and target notes
- [x] **SCAN-05**: tag-index.json maps every tag to the notes that use it
- [x] **SCAN-06**: scan-state.json tracks last scan time and per-file hashes for incremental updates
- [x] **SCAN-07**: /scan skill triggers manual re-index and reports changes

### Note Creation & Workflow

- [x] **NOTE-01**: /create skill selects appropriate template based on user intent
- [x] **NOTE-02**: /create fills frontmatter, substitutes template variables, and suggests wiki-links to existing notes
- [x] **NOTE-03**: /create places new note in correct folder per template conventions
- [x] **NOTE-04**: /daily skill creates today's daily note with template and rolls over open items from previous day

### Connection Intelligence

- [x] **CONN-01**: /connect discovers connections between notes from shared tags and explicit wiki-links (Level 1)
- [x] **CONN-02**: /connect suggests new wiki-links with evidence explaining why notes are related
- [x] **CONN-03**: /health detects orphan notes (0-1 connections) and suggests links
- [x] **CONN-04**: /health detects broken wiki-links (targets that don't exist) and suggests fixes
- [x] **CONN-05**: Semantic search finds notes by meaning, not just keyword matching

### Memory & Context

- [x] **MEM-01**: Working memory persists across sessions via MEMORY.md + topic files in .claude/memory/
- [x] **MEM-02**: Session start loads vault awareness (active projects, recent changes, priorities)
- [x] **MEM-03**: Four-layer memory architecture implemented (session, working, long-term summary, project-specific)
- [x] **MEM-04**: Long-term summary memory distills patterns, recurring themes, and organizational insights
- [x] **MEM-05**: Project-specific memory tracks per-project state, decisions, and context

### Proactive Intelligence

- [ ] **PROA-01**: /briefing generates calm daily executive summary (changes, priorities, neglected items, suggestions)
- [ ] **PROA-02**: /triage classifies inbox notes by type and suggests target folder with confidence level
- [ ] **PROA-03**: /triage auto-applies tags and metadata for high-confidence classifications (AUTO zone)
- [ ] **PROA-04**: /triage proposes folder moves and type changes for review (PROPOSE zone)
- [ ] **PROA-05**: /synthesize generates topic summaries from multiple related notes with wiki-link citations
- [ ] **PROA-06**: /synthesize marks generated notes as Claude-synthesized in frontmatter
- [ ] **PROA-07**: /maintain detects and fixes tag/frontmatter inconsistencies across vault
- [ ] **PROA-08**: /maintain detects stale projects (active but untouched for configurable period)
- [ ] **PROA-09**: /maintain detects outdated references and creates review queue

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Connection Intelligence

- **CONN-06**: /connect Level 2 -- semantic similarity from note content analysis
- **CONN-07**: /connect Level 3 -- transitive connections, cross-vault pattern discovery
- **CONN-08**: Typed relationships (supports, contradicts, extends, inspired-by, prerequisite-for, depends-on)
- **CONN-09**: Weighted connection strength tracking
- **CONN-10**: vault-graph.json with entity-relation-observation model

### Emergent Structure

- **EMRG-01**: Cluster detection -- identify thematic groupings across vault
- **EMRG-02**: MOC proposals when topic accumulates 5+ unnavigated notes
- **EMRG-03**: Area proposals for growing responsibility domains
- **EMRG-04**: Conflict detection across notes (contradictions, outdated claims)

### Smart Templates

- **TMPL-01**: Context-aware template adaptation (e.g., CLI tool vs. SaaS tool gets different fields)
- **TMPL-02**: Claude proposes new template types when existing 12 are insufficient

## Out of Scope

| Feature | Reason |
|---------|--------|
| Mobile app or non-Obsidian clients | Obsidian-native only -- full Obsidian compatibility is the constraint |
| Real-time sync or collaboration | Single-user vault -- personal knowledge management |
| External API integrations (Notion, Todoist) | Self-contained system, no external dependencies |
| Custom Obsidian JS plugins | All AI features via Claude Code skills, keeping system portable |
| Automatic deletion or archiving | Review-first always -- Claude proposes, user decides |
| Typed relationships in v1 | Needs to emerge from actual use patterns, not imposed upfront |
| Emergent structure in v1 | Needs critical mass of vault content to avoid noise |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| FOUND-06 | Phase 1 | Complete |
| FOUND-07 | Phase 1 | Complete |
| SCAN-01 | Phase 2 | Complete |
| SCAN-02 | Phase 2 | Complete |
| SCAN-03 | Phase 2 | Complete |
| SCAN-04 | Phase 2 | Complete |
| SCAN-05 | Phase 2 | Complete |
| SCAN-06 | Phase 2 | Complete |
| SCAN-07 | Phase 2 | Complete |
| NOTE-01 | Phase 3 | Complete |
| NOTE-02 | Phase 3 | Complete |
| NOTE-03 | Phase 3 | Complete |
| NOTE-04 | Phase 3 | Complete |
| CONN-01 | Phase 3 | Complete |
| CONN-02 | Phase 3 | Complete |
| CONN-03 | Phase 3 | Complete |
| CONN-04 | Phase 3 | Complete |
| CONN-05 | Phase 4 | Complete |
| MEM-01 | Phase 3 | Complete |
| MEM-02 | Phase 3 | Complete |
| MEM-03 | Phase 3 | Complete |
| MEM-04 | Phase 4 | Complete |
| MEM-05 | Phase 4 | Complete |
| PROA-01 | Phase 5 | Pending |
| PROA-02 | Phase 5 | Pending |
| PROA-03 | Phase 5 | Pending |
| PROA-04 | Phase 5 | Pending |
| PROA-05 | Phase 5 | Pending |
| PROA-06 | Phase 5 | Pending |
| PROA-07 | Phase 5 | Pending |
| PROA-08 | Phase 5 | Pending |
| PROA-09 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after roadmap creation*
