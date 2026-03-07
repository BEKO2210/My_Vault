# Project Research Summary

**Project:** Firstbrain -- AI-Native Personal Knowledge Management
**Domain:** Claude Code skill ecosystem operating on a local Obsidian vault
**Researched:** 2026-03-07
**Confidence:** HIGH

## Executive Summary

Firstbrain is not a web application, mobile app, or traditional software project. It is a **Claude Code skill ecosystem** that transforms a plain-markdown Obsidian vault into an AI-native knowledge management system. There is no server, no database, no frontend framework. The "stack" is Claude Code's extensibility layer (skills, subagents, hooks, memory) combined with Node.js scripts for markdown parsing and JSON files in `.claude/` for derived state. The vault's markdown files are the immutable source of truth; everything in `.claude/` is regenerable from them. This architecture means the vault works perfectly without Claude -- AI features are additive, never required. Experts in this space (ballred/obsidian-claude-pkm, kepano/obsidian-skills, naushadzaman Knowledge Vault) have validated this pattern.

The recommended approach is to build in five phases, starting with the vault scanning and indexing foundation, then layering on user-facing skills (/create, /connect, /health, /daily), proactive intelligence (/briefing, /triage, /synthesize), and finally the advanced knowledge graph with typed relationships and conflict detection. The critical architectural decision is the **tiered understanding pipeline**: Level 1 (pure text parsing, zero LLM cost) runs on every scan, Level 2 (semantic inference) runs on demand per file, and Level 3 (relational discovery) runs periodically. This tiering keeps costs proportional to user activity, not vault size, and is the key to scaling beyond 5,000 notes.

The dominant risk is **trust erosion through silent over-automation**. Every competitor that auto-organizes content (Mem.ai, early Notion AI) has faced user backlash when changes happen without consent. Firstbrain's "governed evolution" philosophy -- auto-apply low-risk metadata, propose structural changes, never delete -- must be enforced from day one through an action classification system and changelog. The second major risk is **cache-markdown drift**, where JSON indexes diverge from the actual vault state. Incremental scanning with content hashing on every session start prevents this. The third risk is **context window exhaustion**: at 1,000+ notes, naive "read everything" approaches fill the 200K token window before the user asks a question. The layered memory architecture (200-line MEMORY.md index + topic files on demand) solves this by design.

## Key Findings

### Recommended Stack

The stack is unconventional: Claude Code itself is the framework, skills are the delivery mechanism, and Node.js scripts are the compute layer. There are no web frameworks, no databases, no build tools.

**Core technologies:**
- **Claude Code Skills** (.claude/skills/): Primary delivery mechanism for all AI features -- each vault capability (/briefing, /maintain, /synthesize, /triage, /connect) is a skill with YAML frontmatter, supporting files, and optional subagent delegation
- **Claude Code Subagents** (.claude/agents/): Isolated execution contexts for intensive operations (vault scanning, graph building) that would overwhelm the main conversation context; use `memory: project` for cross-session learning
- **gray-matter + unified/remark-parse**: Battle-tested markdown processing pipeline -- gray-matter (30M+/week npm downloads) for YAML frontmatter extraction, remark-parse for markdown AST, @portaljs/remark-wiki-link for Obsidian-style `[[wiki-links]]`
- **JSON files in .claude/cache/**: Knowledge graph, note index, tag index, link map -- all regenerable from markdown source; human-readable, git-friendly, Claude-native (no serialization layer needed)
- **Node.js 18+ LTS**: Script runtime, already required by Claude Code; all markdown processing libraries are JavaScript/TypeScript; avoids adding Python as a second runtime dependency
- **natural (Node.js NLP)**: Local TF-IDF and keyword extraction for semantic similarity without external API calls; deferred to Level 2 analysis

**Critical version note:** unified v11+ and remark-parse v11+ are ESM-only. All scripts must use `.mjs` extension or set `"type": "module"`. CommonJS imports will fail.

### Expected Features

**Must have (table stakes -- P1):**
- English vault rewrite (prerequisite for international usability)
- Note scanning and parsing engine (foundation for all intelligence)
- Smart note creation (/create) -- template selection, frontmatter fill, variable substitution, link suggestions
- Semantic search (/search) -- meaning-based retrieval, not just keyword matching
- Auto-suggested links (/connect) -- discover connections between notes with evidence
- Orphan detection (/health) -- surface disconnected notes, broken links
- Daily notes workflow (/daily) -- create today's note, roll over open items
- Persistent context via working memory -- Claude "remembers" vault state across sessions
- Evolution governance rules -- three zones (content/structure/system) enforced from day one

**Should have (differentiators -- P2):**
- Inbox triage (/triage) -- classify and route inbox notes with confidence levels
- Cross-note synthesis (/synthesize) -- generate topic summaries with wiki-link citations
- Daily briefing (/briefing) -- calm executive summary of vault state, priorities, neglected areas
- Knowledge decay detection -- flag stale projects, outdated references, neglected areas
- Tag/frontmatter consistency cleanup -- batch fix inconsistent metadata

**Defer (v2+):**
- Typed relationship graph (supports/contradicts/extends edges) -- needs to emerge from actual use
- Conflict detection -- depends on typed relationships, high false-positive risk without tuning
- Emergent structure proposals (MOC creation, area suggestions) -- needs critical mass of vault content
- Smart template adaptation -- existing 12 templates cover most cases

### Architecture Approach

The system follows a three-layer architecture: **Markdown Source Layer** (Obsidian-compatible .md files as immutable source of truth), **AI Cognitive Layer** (memory system, knowledge graph, tiered understanding engine), and **User Interface Layer** (Obsidian app for visual interaction, Claude Code skills for AI commands). Skills are the user-facing interface; agents are background workers. The separation prevents maintenance noise from cluttering user conversations. All derived state lives in `.claude/cache/` (gitignored, regenerable), while skills, agents, and rules live in `.claude/` (committed, version-controlled).

**Major components:**
1. **Skills** (.claude/skills/) -- User-invoked slash commands for briefing, triage, synthesis, connection discovery, maintenance, scanning
2. **Agents** (.claude/agents/) -- Autonomous background workers for vault scanning, graph building, inbox processing, note organizing; run in forked contexts with restricted tools
3. **Rules** (.claude/rules/) -- Path-specific conventions loaded automatically when Claude reads files in matching directories; keeps context lean vs. monolithic CLAUDE.md
4. **Cache layer** (.claude/cache/) -- Regenerable JSON indexes: vault-index.json, link-map.json, tag-index.json, vault-graph.json, scan-state.json, clusters.json
5. **Memory system** -- Four layers: session memory (ephemeral context), working memory (MEMORY.md first 200 lines), long-term summary (topic files), agent-specific memory (per-agent learning)
6. **Understanding engine** -- Three tiers: Level 1 (parse frontmatter/links/tags, zero LLM cost), Level 2 (semantic inference per file, LLM tokens), Level 3 (relational discovery across vault, most expensive)

### Critical Pitfalls

1. **Silent over-automation destroys trust** -- Define an explicit action classification: AUTO (tags, timestamps), PROPOSE (file moves, link additions), NEVER (deletions, merges). Build a changelog system (.claude/changelog.md) BEFORE any automation ships. If you cannot log it, do not automate it.

2. **Cache-markdown drift** -- JSON caches silently diverge from markdown reality when users edit outside Claude sessions. Run cache validation (mtime + content hash comparison) at every session start. Include a `/rebuild-cache` escape valve. Store per-file hashes for incremental updates.

3. **Context window exhaustion** -- At 1,000+ notes, loading everything fills the 200K context before the user's first question. Enforce a context budget: less than 30% for system context (memory + cache + instructions), 70%+ for user work. Use tiered loading: compact vault summary always, topic-specific context on demand, full note content only when working on that specific note.

4. **Obsidian compatibility breaks** -- Claude edits files as a text editor, not through Obsidian's API. All AI metadata must live in `.claude/` (dot-prefix = hidden from Obsidian). Frontmatter must use flat key-value pairs only. Wiki-links must use shortest-path format. Never create non-markdown files in user-visible directories.

5. **Noisy semantic connections** -- LLM similarity matching produces surface-level connections (Python language linked to Monty Python). Set confidence thresholds conservatively (0.8+), require typed relationship justification, build user feedback loops, prefer precision over recall. Start with Level 1 (explicit links only) and gate Level 2/3 behind user opt-in.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation and Vault Preparation
**Rationale:** Everything depends on being able to read and index markdown. The vault is currently in German and needs English rewrite. Trust infrastructure (governance, changelog) must exist before any automation.
**Delivers:** English vault content, CLAUDE.md + path-specific rules, action classification system, changelog infrastructure, evolution governance zones, Obsidian compatibility checklist
**Addresses:** English vault rewrite (P1), Evolution governance rules (P1)
**Avoids:** Silent over-automation (Pitfall 1), Obsidian compatibility breaks (Pitfall 4)
**Stack:** CLAUDE.md, .claude/rules/ -- no external dependencies yet

### Phase 2: Scanning Engine and Cache Infrastructure
**Rationale:** Every skill needs cached vault state to avoid full reads. The incremental scanning pattern (mtime + content hashing) is a prerequisite for all intelligence features. This is the technical foundation that enables everything else.
**Delivers:** Level 1 parser (frontmatter, links, tags, headings extraction), vault-index.json, link-map.json, tag-index.json, scan-state.json, incremental scanning with content hashing, vault-scanner agent, /scan skill
**Addresses:** Note scanning/parsing engine (P1), foundation for all P1/P2 features
**Avoids:** Cache-markdown drift (Pitfall 2), Context window exhaustion (Pitfall 3), Full vault read anti-pattern
**Stack:** gray-matter, unified + remark-parse, @portaljs/remark-wiki-link, remark-frontmatter, fast-glob, Node.js fs module

### Phase 3: Core User-Facing Skills
**Rationale:** Once the cache exists, user-facing skills can deliver immediate value. These skills define the "AI-native" experience and are the first "wow moments" for new users. They depend on cache but not on semantic analysis.
**Delivers:** /create (smart note creation with template selection and link suggestions), /daily (daily notes with open item rollover), /health (orphan detection, broken link detection, basic decay signals), /connect (Level 1 connections from explicit wiki-links and shared tags), working memory system (MEMORY.md + topic files for session persistence)
**Addresses:** Smart note creation (P1), Daily notes workflow (P1), Orphan detection (P1), Auto-suggested links (P1, Level 1), Persistent context (P1)
**Avoids:** Context exhaustion by reading cache not raw files (Pitfall 3)
**Stack:** Skills with Read/Grep/Glob/Bash tools, memory system in .claude/memory/

### Phase 4: Proactive Intelligence
**Rationale:** With scanning and core skills validated, add proactive features that make the vault feel like it "works for you." These depend on working memory being stable and the cache infrastructure being proven reliable.
**Delivers:** /briefing (calm daily vault summary), /triage (inbox classification with confidence-based auto-apply), /synthesize (cross-note topic synthesis with citations), knowledge decay detection (stale projects, neglected areas), /maintain (batch tag/frontmatter consistency cleanup)
**Addresses:** Inbox triage (P2), Cross-note synthesis (P2), Daily briefing (P2), Knowledge decay detection (P2), Tag/frontmatter consistency (P2)
**Avoids:** Noisy connections by using validated cache data (Pitfall 5), Trust erosion by using proposal-based triage (Pitfall 1)
**Stack:** Skills + agents, natural (NLP) for TF-IDF keyword extraction (Level 2 semantic analysis begins here)

### Phase 5: Advanced Knowledge Graph and Intelligence
**Rationale:** The most ambitious and risky features. Typed relationships need to emerge from actual use patterns before being codified. Conflict detection has high false-positive risk without extensive tuning. Emergent structure proposals need critical mass of vault content to avoid noise. This phase requires all previous phases to be stable.
**Delivers:** vault-graph.json with typed/weighted edges (supports, contradicts, extends, inspired-by, prerequisite-for, depends-on), graph-builder agent (Level 2 + Level 3 analysis), /connect enhanced (semantic similarity, transitive connections), conflict detection, emergent structure proposals (MOC candidates), clusters.json
**Addresses:** Typed relationship graph (P3), Conflict detection (P3), Emergent structure proposals (P3)
**Avoids:** Knowledge graph hairball (cap at 20 relationships per note, confidence thresholds, pruning), Noisy connections (typed justification required, user feedback loops)
**Stack:** natural (deep NLP), graph-builder agent with `memory: project`, vault-graph.json entity-relation-observation model

### Phase Ordering Rationale

- **Dependencies flow downward:** Each phase depends on the previous one. Scanning (Phase 2) needs the vault prepared (Phase 1). Skills (Phase 3) need the cache (Phase 2). Proactive features (Phase 4) need skills and memory proven (Phase 3). The knowledge graph (Phase 5) needs everything else stable.
- **Value delivery is front-loaded:** Phase 3 delivers all P1 user-facing features. A user installing after Phase 3 gets the core "AI-native" experience. Phases 4-5 are enhancements, not essentials.
- **Risk is back-loaded:** Phase 5 (typed relationships, conflict detection) carries the highest risk of noisy results and wasted effort. Deferring it lets the system accumulate real-world usage data to inform design decisions.
- **Trust is built incrementally:** Phase 1 establishes the governance framework. Phase 3 lets users experience helpful-but-controlled automation. Phase 4 adds proactive features only after trust is established. Phase 5 adds autonomous reasoning only with proven precision.
- **The English rewrite must come first** because all templates, MOCs, guides, and system docs are currently in German. Every subsequent phase depends on English content for international usability and consistent AI analysis.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Scanning Engine):** The incremental scanning pattern with content hashing is well-documented, but the specific interaction between Node.js `fs.stat` mtime precision and Obsidian's file save behavior on Windows needs validation. ESM-only imports for unified/remark may create tooling friction.
- **Phase 4 (Proactive Intelligence):** The `natural` NLP library's fit for vault-scale TF-IDF topic extraction is unvalidated. Inbox triage confidence thresholds need empirical tuning -- no clear precedent for PKM-specific classification thresholds exists.
- **Phase 5 (Knowledge Graph):** Typed relationship inference is genuinely novel in the personal PKM space. No competitor has solved this well. The relationship type taxonomy (supports/contradicts/extends/etc.) needs iteration based on actual vault usage. Research phase strongly recommended.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** Well-understood -- English content rewrite, CLAUDE.md conventions, governance rules. No technical unknowns.
- **Phase 3 (Core Skills):** Claude Code skill creation is well-documented. The patterns (read cache, generate output, propose changes) are established by ballred/obsidian-claude-pkm and kepano/obsidian-skills. Standard implementation.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack (Claude Code skills, gray-matter, unified/remark, JSON cache) verified against official docs and npm. `natural` NLP library fit is MEDIUM -- well-known library but unverified for this specific use case. |
| Features | MEDIUM-HIGH | Table stakes well-established across competitor analysis (Smart Connections, Mem.ai, Reflect, Tana, Capacities). Differentiators (typed relationships, decay detection, governed evolution) are genuinely novel -- no competitor precedent means less certainty about user reception. |
| Architecture | HIGH | Three-layer architecture verified against official Claude Code docs (skills, agents, memory). Knowledge graph as entity-relation-observation model validated by Anthropic's own MCP memory server reference implementation. Incremental scanning is a standard pattern. |
| Pitfalls | HIGH | Domain-specific pitfalls well-documented: trust erosion from over-automation (confirmed by community backlash against Mem.ai and early Notion AI), context window limits (confirmed by Claude Code official docs), cache drift (standard distributed systems problem). |

**Overall confidence:** HIGH

### Gaps to Address

- **`natural` NLP library validation:** The library is well-known but its TF-IDF implementation has not been tested against Obsidian vault content (mixed prose, code snippets, YAML frontmatter, wiki-link syntax). Validate during Phase 4 implementation with a representative sample of vault notes. Fallback: use Claude's own reasoning for semantic similarity instead of local NLP.
- **Windows-specific mtime precision:** The incremental scanning relies on file modification timestamps. Windows NTFS mtime granularity (100ns) is fine, but Obsidian's save behavior (atomic writes vs. in-place updates) may affect mtime consistency. Test during Phase 2 on the target platform.
- **Claude Code auto-memory interaction:** The layered memory system (MEMORY.md + topic files) interacts with Claude Code's built-in auto-memory feature. The exact loading order and potential conflicts need empirical testing. The official docs describe the 200-line limit but not edge cases around concurrent memory sources.
- **Semantic relationship precision at scale:** No consumer PKM tool has successfully deployed typed relationship inference. The false-positive rate for "contradicts" and "extends" relationships is unknown. Plan for extensive user testing and threshold tuning in Phase 5. Accept that this feature may need multiple iterations.
- **Obsidian CLI availability:** The architecture references Obsidian CLI (v1.12+) for certain operations. Verify this is available on the target system and document the fallback for systems without it.

## Sources

### Primary (HIGH confidence)
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- Skill creation, frontmatter, supporting files, subagent delegation
- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory) -- CLAUDE.md hierarchy, auto memory, .claude/rules/, imports
- [Claude Code Sub-Agents Documentation](https://code.claude.com/docs/en/sub-agents) -- Subagent creation, memory persistence, hooks
- [How Claude Code Works](https://code.claude.com/docs/en/how-claude-code-works) -- Context compaction behavior, session limits
- [gray-matter on npm/GitHub](https://www.npmjs.com/package/gray-matter) -- Frontmatter parser, 30M+/week downloads
- [unified ecosystem](https://unifiedjs.com/) -- remark-parse, AST processing pipeline
- [Knowledge Graph Memory MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) -- Entity-relation-observation model reference
- [Obsidian vault configuration](C:/Users/belki/Desktop/Firstbrain-main/.obsidian/app.json) -- Confirmed shortest-path link format

### Secondary (MEDIUM confidence)
- [ballred/obsidian-claude-pkm](https://github.com/ballred/obsidian-claude-pkm) -- Community reference: 8 skills, goal tracking, memory system
- [naushadzaman Knowledge Vault](https://gist.github.com/naushadzaman/164e85ec3557dc70392249e548b423e9) -- Community reference: 8 skills, digest workflow
- [natural on npm](https://www.npmjs.com/package/natural) -- Node.js NLP library (TF-IDF, stemming, tokenization)
- [@portaljs/remark-wiki-link](https://www.npmjs.com/package/@portaljs/remark-wiki-link) -- Wiki-link parser for remark pipeline
- [Obsidian Forum: Large vault scalability](https://forum.obsidian.md/t/terabyte-size-million-notes-vaults-how-scalable-is-obsidian/66674) -- Performance at scale
- [Claude Code session persistence workarounds](https://dev.to/hw20200214/claude-code-forgets-everything-between-sessions-i-tested-5-fixes-199p) -- Community memory patterns
- [Enterprise knowledge freshness automation](https://cobbai.com/blog/knowledge-freshness-automation) -- Decay detection patterns

### Tertiary (LOW confidence)
- [Graphiti incremental knowledge graph](https://neo4j.com/blog/developer/graphiti-knowledge-graph-memory/) -- Pattern reference, not directly applicable
- [AI trust research](https://medium.com/@inderrsiingh_67158/when-your-users-dont-trust-the-machine-designing-ai-experiences-after-the-hype-crash-d67e1aafefc1) -- Qualitative trust patterns

---
*Research completed: 2026-03-07*
*Ready for roadmap: yes*
