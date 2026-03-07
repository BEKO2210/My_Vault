# Phase 4: Deep Memory & Semantic Search - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Claude develops long-term understanding of vault patterns and can find notes by meaning, not just keywords. This phase transitions from explicit data to semantic intelligence by implementing:
- Long-term summary memory (Layer 3) that distills recurring themes, organizational patterns, and insights
- Project-specific memory (Layer 4) that tracks per-project state, decisions, blockers, and context
- Semantic search that finds notes by meaning using vector embeddings

</domain>

<decisions>
## Implementation Decisions

### Insight Distillation
- Threshold-based triggers using combined signals: activity volume (e.g., 10+ note changes) AND topic density (e.g., 3+ notes in same tag cluster) -- distill when either is met
- Distill both organizational patterns (tagging habits, folder preferences, linking style) and thematic patterns (recurring topics, growing interests, knowledge clusters)
- Proactive surfacing with distinct visual callout blocks ("Pattern noticed:") -- not woven into conversation text
- Single file: .claude/memory/insights.md with emergent categories (section headers form as patterns emerge, not predefined)
- Confidence tracking with thresholds -- only surface/act on insights above a confidence threshold; track observation count per insight
- User-editable -- insights.md is plain markdown, user can correct or delete entries directly; Claude respects corrections
- Cross-reference top insights in MEMORY.md (brief mention, full detail stays in insights.md)
- Soft limit ~100 entries with automatic pruning of low-confidence or stale insights
- Distillation notifications at Claude's discretion (notify for significant updates, stay silent for minor ones)

### Project Memory
- Projects identified from vault structure: any note in `01 - Projects/` with `type: project` frontmatter
- Track per project: current status, key decisions made, blockers, and planned next actions -- enough to resume without re-explaining
- Individual files: `.claude/memory/project-{name}.md` per project (one file per active project)
- On project completion: archive to `.claude/memory/archive/project-{name}.md`, distill key lessons into insights.md

### Semantic Search
- Both dedicated `/search` skill for explicit queries AND implicit semantic search woven into conversation when relevant
- Embedding-based vector similarity (cosine similarity) -- requires embedding model (local or API, researcher to determine best approach)
- Results display: note title + relevant excerpt showing why it matched + relevance indicator (high/medium/low)
- Adaptive result count -- show all results above a relevance threshold rather than fixed N; could be 3 or 8 depending on match quality

### Memory Lifecycle
- Confidence decay: insights lose confidence over time if not re-observed; old patterns with no recent evidence get lower priority
- Embedding index updates tied to /scan skill -- consistent with existing incremental scanning infrastructure
- Embedding storage: SQLite database at .claude/embeddings.db -- better performance for large vaults
- /memory overview command: shows working memory summary, insight count + categories, active project memories, embedding index status

### Claude's Discretion
- Exact confidence scoring algorithm and thresholds
- Embedding model selection (local vs API, specific model)
- SQLite schema design for embeddings
- Exact distillation notification logic (when to notify vs stay silent)
- Insight pruning strategy details
- /memory command output formatting
- How implicit semantic search integrates into conversation flow

</decisions>

<specifics>
## Specific Ideas

- Insights should feel like a knowledgeable partner noticing patterns, not a surveillance system logging behavior
- The /memory command should serve as a "dashboard for your AI's brain" -- a single entry point to understand what Claude knows
- Semantic search should find notes even when the exact term doesn't appear (e.g., "notes about productivity systems" finds relevant notes about GTD, time management, etc.)
- Project memory should make returning to a project after weeks feel seamless -- Claude remembers where you left off

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 04-deep-memory-semantic-search*
*Context gathered: 2026-03-07*
