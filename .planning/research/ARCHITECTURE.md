# Architecture Research: Firstbrain AI-Native Knowledge Management

**Domain:** AI-native Obsidian knowledge management system
**Researched:** 2026-03-07
**Confidence:** HIGH (Claude Code skills/memory architecture verified via official docs; JSON cache and graph patterns verified via multiple sources)

## System Overview

```
+=====================================================================+
|                        USER INTERFACE LAYER                          |
|  (Obsidian app, Claude Code CLI, slash commands)                    |
+=====================================================================+
         |                    |                    |
         v                    v                    v
+------------------+ +------------------+ +------------------+
|  Claude Code     | |  Claude Code     | |  Claude Code     |
|  Skills          | |  Agents          | |  Rules           |
|  /briefing       | |  vault-scanner   | |  path-specific   |
|  /triage         | |  note-organizer  | |  conventions     |
|  /maintain       | |  inbox-processor | |  per-directory   |
|  /connect        | |  graph-builder   | |  frontmatter     |
|  /synthesize     | |                  | |                  |
+--------+---------+ +--------+---------+ +--------+---------+
         |                    |                    |
         +--------------------+--------------------+
                              |
                              v
+=====================================================================+
|                     AI COGNITIVE LAYER                               |
|  (Session context, working memory, long-term memory)                |
+=====================================================================+
         |                    |                    |
         v                    v                    v
+------------------+ +------------------+ +------------------+
|  Memory System   | |  Knowledge Graph | |  Understanding   |
|  MEMORY.md       | |  vault-graph.json| |  Engine          |
|  topic files     | |  search-index.json|  Level 1: Parse  |
|  project memory  | |  link-map.json   | |  Level 2: Infer  |
|  session state   | |  entity cache    | |  Level 3: Relate |
+--------+---------+ +--------+---------+ +--------+---------+
         |                    |                    |
         +--------------------+--------------------+
                              |
                              v
+=====================================================================+
|                    MARKDOWN SOURCE LAYER                             |
|  (Obsidian-compatible .md files - THE source of truth)              |
|                                                                     |
|  00-Inbox/ | 01-Projects/ | 02-Areas/ | 03-Resources/ | 04-Archive/|
|  05-Templates/ | 06-Atlas/MOCs/ | 07-Extras/                       |
+=====================================================================+
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Skills** (`.claude/skills/`) | User-invoked vault operations: briefing, triage, synthesis, connection discovery, maintenance | SKILL.md files with frontmatter, supporting scripts, templates |
| **Agents** (`.claude/agents/`) | Background autonomous workers: scanning, graph building, organizing, inbox processing | AGENT.md files with `memory: project`, model and tool restrictions |
| **Rules** (`.claude/rules/`) | Path-specific conventions loaded when Claude reads files in matching directories | Markdown files with `paths:` frontmatter for conditional loading |
| **Memory System** (`~/.claude/projects/<project>/memory/`) | Cross-session persistent intelligence: patterns, decisions, vault state summaries | Auto-memory MEMORY.md + topic files, max 200 lines index |
| **Knowledge Graph** (`.claude/cache/`) | Derived JSON indexes of vault structure, relationships, entities, semantic clusters | JSON/JSONL files regenerable from markdown source |
| **Understanding Engine** | Tiered analysis pipeline: explicit parsing, semantic inference, relational discovery | Implemented within skills/agents, outputs cached in graph layer |
| **Markdown Source** (vault root) | The immutable source of truth. All knowledge lives here. Everything else is derivative | Standard Obsidian-flavored markdown with YAML frontmatter |

## Recommended Project Structure

```
.claude/
|-- skills/                     # User-invokable commands
|   |-- briefing/
|   |   |-- SKILL.md            # /briefing - daily vault briefing
|   |   +-- templates/
|   |       +-- briefing.md     # Output template
|   |-- triage/
|   |   |-- SKILL.md            # /triage - inbox classification
|   |   +-- rules.md            # Classification taxonomy
|   |-- maintain/
|   |   |-- SKILL.md            # /maintain - vault hygiene
|   |   +-- checks.md           # Maintenance checklist reference
|   |-- connect/
|   |   |-- SKILL.md            # /connect - discover cross-note links
|   |   +-- strategies.md       # Connection discovery heuristics
|   |-- synthesize/
|   |   |-- SKILL.md            # /synthesize - thematic summaries
|   |   +-- templates/
|   |       +-- synthesis.md    # Output template
|   |-- review/
|   |   +-- SKILL.md            # /review - weekly/monthly review
|   +-- scan/
|       +-- SKILL.md            # /scan - rebuild cache from markdown
|
|-- agents/                     # Autonomous background workers
|   |-- vault-scanner.md        # Incremental file scanner
|   |-- graph-builder.md        # Knowledge graph maintainer
|   |-- inbox-processor.md      # GTD-style inbox triage
|   +-- note-organizer.md       # Orphan detection, link repair
|
|-- rules/                      # Path-specific conventions
|   |-- projects.md             # Rules for 01-Projects/ files
|   |-- resources.md            # Rules for 03-Resources/ files
|   |-- templates.md            # Rules: never modify templates
|   +-- mocs.md                 # Rules for 06-Atlas/MOCs/ files
|
|-- cache/                      # Regenerable derived data (gitignored)
|   |-- vault-index.json        # File metadata + frontmatter index
|   |-- vault-graph.json        # Knowledge graph (entities + relations)
|   |-- link-map.json           # Wiki-link adjacency map
|   |-- tag-index.json          # Tag-to-file reverse index
|   |-- scan-state.json         # Incremental scan fingerprints
|   +-- clusters.json           # Semantic clusters (emergent MOC candidates)
|
|-- settings.json               # Claude Code project settings
+-- CLAUDE.md                   # Project-level persistent instructions
```

### Structure Rationale

- **skills/:** Each skill is a directory because complex skills need supporting files (templates, reference docs, validation scripts). The SKILL.md is the entry point; supporting files load on demand to save context budget. Skills are user-invocable by default.
- **agents/:** Single-file agents because they are simpler (system prompt + frontmatter config). They run in forked contexts with their own memory. Using `memory: project` gives them cross-session learning stored in `.claude/agent-memory/<name>/`.
- **rules/:** Path-scoped rules load automatically when Claude reads files in matching directories. This replaces stuffing everything into CLAUDE.md and keeps context lean.
- **cache/:** All JSON files here are derivative and regenerable from markdown. This directory should be gitignored in the open-source template but included in `.claude/` so it persists locally. If deleted, a `/scan` command rebuilds everything.

## Architectural Patterns

### Pattern 1: Markdown-First with Regenerable Cache

**What:** All knowledge lives in plain markdown files with YAML frontmatter. The `.claude/cache/` directory contains JSON indexes derived entirely from parsing these markdown files. If the cache is deleted, it can be rebuilt from scratch.

**When to use:** Always. This is the fundamental architectural invariant.

**Trade-offs:** Slower cold start (must scan vault to rebuild cache) but zero risk of cache-source divergence causing data loss. Users who never use Claude still have a fully functional Obsidian vault.

**Example:**

```
Source of Truth (markdown):
  ---
  type: project
  status: active
  tags: [webdev, portfolio]
  ---
  # Website Relaunch
  Related to [[Design System]] and [[Brand Guidelines]]

Derived Cache (vault-index.json entry):
  {
    "path": "01 - Projects/Website Relaunch.md",
    "hash": "a1b2c3d4",           // Content hash for change detection
    "mtime": "2026-03-07T10:30:00Z",
    "frontmatter": {
      "type": "project",
      "status": "active",
      "tags": ["webdev", "portfolio"]
    },
    "outlinks": ["Design System", "Brand Guidelines"],
    "headings": ["Ziel", "Kontext", "Tasks", "Notizen", "Verbindungen", "Log"],
    "wordCount": 142
  }
```

### Pattern 2: Incremental Scanning with Content Hashing

**What:** Instead of re-reading all 5,000+ files on every session start, maintain a `scan-state.json` that maps each file path to its content hash (MD5 or SHA-256 of file content) and last-modified timestamp. On scan, compare filesystem mtime to cached mtime. Only re-parse files that changed.

**When to use:** Every session start, triggered by agent or skill initialization.

**Trade-offs:** Requires maintaining scan state, but reduces a 5,000-file scan from reading all files to reading only changed files. The mtime check is O(n) on file count but avoids actual file reads. If mtime changed, hash the content to confirm actual change (handles touch-without-modify).

**Example:**

```
scan-state.json:
{
  "lastFullScan": "2026-03-07T08:00:00Z",
  "files": {
    "01 - Projects/Website Relaunch.md": {
      "mtime": "2026-03-06T14:22:00Z",
      "hash": "a1b2c3d4",
      "size": 1842
    },
    "03 - Resources/Zettel - Knowledge Graphs.md": {
      "mtime": "2026-03-05T09:11:00Z",
      "hash": "e5f6g7h8",
      "size": 923
    }
  },
  "deletedSince": []
}

Incremental scan algorithm:
  1. List all .md files in vault (fast filesystem operation)
  2. For each file:
     a. If NOT in scan-state → new file → full parse, add to index
     b. If mtime unchanged → skip (no change)
     c. If mtime changed → read file, hash content
        - If hash unchanged → update mtime only (touched but not modified)
        - If hash changed → full re-parse, update all caches
  3. For files in scan-state but NOT on filesystem → mark deleted, clean caches
  4. Update scan-state.json with new state
```

### Pattern 3: Tiered Understanding Pipeline

**What:** Process vault knowledge through three levels of increasing sophistication. Each level builds on the previous, and each can be run independently.

**When to use:** Level 1 on every scan. Level 2 on demand or when building connection suggestions. Level 3 periodically or when the user asks for synthesis/patterns.

**Trade-offs:** Level 1 is cheap (string parsing). Level 2 requires Claude inference (costs tokens). Level 3 requires graph analysis plus Claude reasoning (most expensive). The tiered approach means you pay for depth only when needed.

```
Level 1 - Explicit Structure (automated, every scan):
  Input:  Raw markdown file
  Parse:  YAML frontmatter, wiki-links [[...]], tags #..., headings ##
  Output: vault-index.json entries, link-map.json, tag-index.json
  Cost:   Zero LLM tokens (pure text parsing)

Level 2 - Semantic Inference (on demand, per-file):
  Input:  File content + Level 1 metadata
  Infer:  Topics, themes, concepts, sentiment, key claims
  Output: Enriched vault-graph.json entities with observations
  Cost:   LLM tokens per file analyzed (~500-2000 tokens per note)

Level 3 - Relational Discovery (periodic, vault-wide):
  Input:  vault-graph.json + all Level 2 enrichments
  Infer:  Cross-note patterns, clusters, contradictions, knowledge gaps
  Output: clusters.json, connection suggestions, emergent MOC proposals
  Cost:   LLM tokens for graph analysis (~5000-20000 tokens per run)
```

### Pattern 4: Skills as User Interface, Agents as Background Workers

**What:** Skills (`/slash-commands`) are the user-facing interface. They are invoked explicitly by the user or automatically by Claude when conversation context matches. Agents are background workers that run in forked contexts with restricted tools and persistent memory.

**When to use:** Skills for anything the user explicitly triggers (briefing, triage, synthesis). Agents for autonomous maintenance tasks (scanning, graph building, organizing).

**Trade-offs:** Skills run in the main conversation context (access to chat history, user can interact). Agents run in isolation (no chat history, cannot ask user questions unless in foreground). This separation prevents maintenance noise from cluttering the user's conversation.

**Skill example (`/briefing`):**

```yaml
---
name: briefing
description: Generate a calm daily briefing summarizing vault state, priorities, recent changes, neglected items, and suggestions. Use when starting a work session.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---

Generate a daily briefing for this Obsidian vault.

Read .claude/cache/vault-index.json for current vault state.
Read the active projects from 01 - Projects/.
Check for notes modified in the last 24 hours.
Check for orphaned notes (no inbound links).
Check for stale projects (no updates in 14+ days).

Format as a calm executive briefing:
## Today's Briefing - $ARGUMENTS

### Active Projects (by priority)
### Recent Changes (last 24h)
### Items Needing Attention
### Suggestions
```

**Agent example (`vault-scanner`):**

```yaml
---
name: vault-scanner
description: Scans vault files incrementally, detects changes, and updates the JSON cache indexes. Use proactively at session start or when vault state may be stale.
tools: Read, Glob, Bash, Write
model: haiku
memory: project
---

You are the vault scanner agent. Your job is to maintain the JSON cache
in .claude/cache/ by incrementally scanning vault markdown files.

1. Read .claude/cache/scan-state.json for previous scan state
2. List all .md files in the vault (exclude .claude/, .planning/, .obsidian/)
3. Compare each file's mtime against cached state
4. For changed/new files: read content, parse frontmatter + links + tags
5. Update vault-index.json, link-map.json, tag-index.json
6. Update scan-state.json with new fingerprints
7. Report: X files scanned, Y changed, Z new, W deleted

Write concise scan results to your agent memory.
```

### Pattern 5: Layered Memory Architecture

**What:** Four distinct memory layers with different persistence, scope, and update frequency. This prevents "context stuffing" where everything is dumped into one file.

**When to use:** Always. This is how Claude maintains intelligence across sessions without overwhelming its context window.

**Trade-offs:** More complex than a single memory file, but scales far better. The 200-line limit on auto-loaded MEMORY.md forces distillation rather than accumulation.

```
Layer 1: Session Memory (ephemeral)
  Location: Claude's context window
  Content:  Current conversation, active task state
  Lifespan: Current session only
  Size:     Bounded by context window (~200K tokens)

Layer 2: Working Memory (per-session load)
  Location: ~/.claude/projects/<project>/memory/MEMORY.md (first 200 lines)
  Content:  Current priorities, active project summaries, recent vault changes
  Lifespan: Persists across sessions, updated frequently
  Size:     200 lines max in index, topic files for detail

Layer 3: Long-Term Summary Memory (periodic distillation)
  Location: ~/.claude/projects/<project>/memory/ topic files
  Content:  Distilled patterns, recurring themes, organizational insights
  Lifespan: Persists indefinitely, updated weekly or on significant change
  Size:     Unbounded but curated (loaded on demand, not at startup)

Layer 4: Agent-Specific Memory (per agent)
  Location: .claude/agent-memory/<agent-name>/
  Content:  Agent-specific learnings (scan patterns, common fixes, user prefs)
  Lifespan: Persists across sessions, scoped to agent
  Size:     Per-agent MEMORY.md + topic files
```

### Pattern 6: Knowledge Graph as Entity-Relation-Observation Model

**What:** Model the vault as a knowledge graph using three primitives: Entities (notes, concepts, people, projects), Relations (typed directed edges between entities), and Observations (atomic facts about entities). Store in JSON, derive entirely from markdown.

**When to use:** For Level 2 and Level 3 understanding. The graph enables connection discovery, contradiction detection, knowledge gap analysis, and emergent structure proposals.

**Trade-offs:** Building the graph requires LLM inference (not free). But once built, graph queries are fast (JSON traversal). The graph is fully regenerable from markdown.

**Example (`vault-graph.json`):**

```json
{
  "entities": [
    {
      "name": "Website Relaunch",
      "type": "project",
      "source": "01 - Projects/Website Relaunch.md",
      "observations": [
        "Active project with high priority",
        "Depends on Design System completion",
        "Deadline is Q2 2026"
      ]
    },
    {
      "name": "Design System",
      "type": "resource",
      "source": "03 - Resources/Design System.md",
      "observations": [
        "Component library for brand consistency",
        "Uses Tailwind CSS as foundation"
      ]
    }
  ],
  "relations": [
    {
      "from": "Website Relaunch",
      "to": "Design System",
      "type": "depends-on",
      "weight": 0.9,
      "source": "explicit-link"
    },
    {
      "from": "Website Relaunch",
      "to": "Brand Guidelines",
      "type": "extends",
      "weight": 0.7,
      "source": "semantic-inference"
    }
  ]
}
```

## Data Flow

### Flow 1: Session Initialization

```
Session Start
    |
    v
Load CLAUDE.md + rules (automatic by Claude Code)
    |
    v
Load MEMORY.md first 200 lines (auto-memory)
    |
    v
[vault-scanner agent] Incremental scan
    |
    +-- Read scan-state.json
    +-- Compare filesystem mtimes
    +-- Parse changed files only
    +-- Update vault-index.json, link-map.json, tag-index.json
    +-- Update scan-state.json
    |
    v
Session ready. User can invoke skills or converse.
```

### Flow 2: User Invokes /briefing

```
User: /briefing
    |
    v
Skill loads SKILL.md instructions
    |
    v
Read .claude/cache/vault-index.json (current vault state)
    |
    v
Read active projects (filter vault-index by type=project, status=active)
    |
    v
Identify: recent changes, orphans, stale items, review queue
    |
    v
Format and present calm daily briefing to user
```

### Flow 3: User Invokes /connect (Connection Discovery)

```
User: /connect "Website Relaunch"
    |
    v
Skill loads SKILL.md + strategies.md
    |
    v
Read vault-graph.json for existing entity/relations
    |
    v
Level 1: Find all explicit links from/to "Website Relaunch"
    |
    v
Level 2: Semantic similarity - find notes with overlapping themes/topics
    |         (Uses cached entity observations if available,
    |          otherwise reads note content for inference)
    |
    v
Level 3: Relational inference - find transitive connections
    |         (A links to B, B links to C, but A does not link to C)
    |
    v
Present ranked connection suggestions with rationale
    |
    v
User approves suggestions --> add wiki-links to markdown files
```

### Flow 4: Inbox Triage

```
New note lands in 00-Inbox/
    |
    v
[inbox-processor agent] or /triage skill
    |
    v
Parse note content (frontmatter + body)
    |
    v
Classify: what type? (project, zettel, resource, meeting, etc.)
    |
    v
Suggest: destination folder, tags, related notes, template fields
    |
    v
Auto-apply low-risk: tags, frontmatter type, created date
    |
    v
Propose structural: folder move, wiki-links, MOC additions
    |
    v
User reviews and approves proposals --> execute moves/links
```

### Flow 5: Knowledge Graph Update Pipeline

```
Changed files detected (by vault-scanner)
    |
    v
Level 1 update (automatic, zero-cost):
    +-- Re-parse frontmatter
    +-- Re-extract wiki-links, tags, headings
    +-- Update vault-index.json, link-map.json, tag-index.json
    |
    v
Level 2 update (on demand, per changed file):
    +-- [graph-builder agent] reads changed file content
    +-- Infers topics, themes, key claims
    +-- Creates/updates entity + observations in vault-graph.json
    |
    v
Level 3 update (periodic or on /synthesize):
    +-- Analyze full graph for patterns
    +-- Detect: new clusters, contradictions, knowledge gaps
    +-- Propose: new MOCs, missing links, stale connections
    +-- Update clusters.json
    |
    v
Results flow into /briefing and /connect outputs
```

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0-500 notes | Full vault scan on session start is fine (~2-5 seconds). Flat JSON cache files work well. No need for Level 2/3 unless desired. |
| 500-2,000 notes | Incremental scanning becomes important. Level 1 cache essential for performance. Split vault-index.json by folder if single file gets large (>5MB). |
| 2,000-5,000 notes | Incremental scanning mandatory. Use content hashing, not just mtime. Consider splitting vault-graph.json into per-type files (projects.json, resources.json). Level 2 analysis should be truly on-demand, not batch. |
| 5,000+ notes | Incremental is the only viable approach. Consider a scan-budget: analyze max N changed files per session. Level 3 analysis should be scheduled (weekly) not per-session. Graph queries may need optimization (pre-computed adjacency lists). |

### Scaling Priorities

1. **First bottleneck: Full vault reads.** At 1,000+ notes, reading every file at session start consumes too much time and context. Incremental scanning with content hashing solves this completely. Build this from day one.

2. **Second bottleneck: LLM token usage for Level 2 analysis.** Semantic inference on every note is expensive. Batch processing with "analyze only changed files" keeps costs proportional to activity, not vault size. Cache aggressively.

3. **Third bottleneck: Context window saturation.** At 5,000+ notes, even summarized vault state may exceed context. The layered memory architecture (200-line MEMORY.md index + topic files loaded on demand) prevents this by design.

## Anti-Patterns

### Anti-Pattern 1: Cache as Source of Truth

**What people do:** Store AI-generated metadata, relationship data, or enrichments only in JSON cache files, treating them as primary data rather than derived data.

**Why it's wrong:** If the cache is corrupted, accidentally deleted, or out of sync, knowledge is lost. Users who don't use Claude cannot access the information. The vault becomes dependent on Claude to function.

**Do this instead:** All knowledge lives in markdown. The cache is always regenerable. If enrichments are valuable enough to persist, write them into the markdown frontmatter or note body. For example, Claude-discovered tags go into YAML frontmatter, not just the tag-index.json.

### Anti-Pattern 2: Full Vault Read on Every Operation

**What people do:** Skills that start with "Read every file in the vault to understand context" or use `Glob **/*.md` followed by `Read` on each file.

**Why it's wrong:** At 5,000 notes, this consumes the entire context window, costs significant tokens, and takes minutes. It doesn't scale, and most files are irrelevant to any given operation.

**Do this instead:** Use the cached vault-index.json for metadata queries. Use link-map.json for relationship traversal. Read individual files only when specifically needed. The cache layer exists precisely to avoid full reads.

### Anti-Pattern 3: Monolithic CLAUDE.md

**What people do:** Stuff all conventions, rules, memory, state, and instructions into a single massive CLAUDE.md file.

**Why it's wrong:** CLAUDE.md is loaded into every session. Large files (500+ lines) consume excessive context and reduce adherence. Mixing different concerns (rules vs. state vs. conventions) makes maintenance difficult.

**Do this instead:** Split into CLAUDE.md (core conventions, <200 lines), .claude/rules/ (path-specific rules loaded conditionally), auto-memory MEMORY.md (Claude's own notes), and skills (loaded on demand). Each mechanism has its own scope and loading behavior.

### Anti-Pattern 4: Silent Structural Changes

**What people do:** Build automation that moves files, merges notes, renames things, or restructures folders without user review.

**Why it's wrong:** Users lose trust when files move unexpectedly. Obsidian graph views change. Bookmarks break. The vault feels unpredictable.

**Do this instead:** Auto-apply only low-risk metadata changes (tags, frontmatter fields, created dates). For structural changes (folder moves, note merges, MOC creation), always propose and wait for explicit user approval. The "propose, don't override" principle is architecturally enforced by separating auto-actions from proposed-actions in skill outputs.

### Anti-Pattern 5: Embedding AI Metadata in Markdown Body

**What people do:** Insert AI-generated sections, relationship maps, or analysis results directly into note content where users write.

**Why it's wrong:** Mixes user-authored content with AI-generated content. Creates merge conflicts. Makes notes ugly. Users don't want `<!-- AI-GENERATED: confidence=0.8 cluster=productivity -->` in their writing.

**Do this instead:** AI metadata lives in three places only: (1) YAML frontmatter (tags, type, status -- things Obsidian can query), (2) the `## Verbindungen` section at the bottom of notes (wiki-links are Obsidian-native), (3) JSON cache files in .claude/cache/ (invisible to Obsidian users). Never insert AI commentary into the note body.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Skills <-> Cache | Read JSON for queries, Write JSON for updates | Skills never modify markdown based on cache alone; always verify against source |
| Agents <-> Cache | Read/Write JSON in forked context | Agents update cache in background; changes available to skills in next invocation |
| Skills <-> Markdown | Read for content, Write for user-approved changes | All markdown writes go through Write/Edit tools with permission controls |
| Agents <-> Markdown | Read only (scanning), Write only for auto-approved metadata | Agents should use `acceptEdits` permission mode for metadata-only writes |
| Memory <-> Skills | MEMORY.md loaded at session start, read on demand | Skills read memory for context but rarely write to it directly |
| Memory <-> Agents | Agents maintain own memory via `memory: project` | Agent memory is isolated per-agent; does not cross-contaminate |
| Rules <-> Skills/Agents | Loaded automatically by Claude Code when matching files are read | No explicit communication; rules inject themselves into context transparently |
| Cache <-> Obsidian | Cache is invisible to Obsidian (in .claude/ directory) | Obsidian has zero dependency on cache files |

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Obsidian App | Reads/writes same markdown files | No direct integration; shared filesystem is the interface. Obsidian sees changes on save. |
| Obsidian CLI (v1.12+) | Available via `obsidian` command in Bash tool | Can create notes, search, manage daily notes, query properties. Use for operations Obsidian handles better than raw file ops. |
| Git | Version control for vault + .claude/ skills/rules | Cache directory (.claude/cache/) should be gitignored. Skills, agents, rules should be committed. |
| Claude Code Auto-Memory | Built-in system at ~/.claude/projects/ | Do not fight this system -- work with it. Skills should trigger memory updates when significant vault state changes occur. |

## Suggested Build Order

Based on component dependencies, the recommended build sequence is:

```
Phase 1: Foundation
  [Markdown Source Layer]     -- Already exists (vault structure, templates)
  [CLAUDE.md + Rules]        -- Core conventions, path-specific rules
  [Level 1 Parser]           -- Frontmatter + link + tag extraction
  [scan-state.json pattern]  -- Content hashing for incremental scanning

  WHY FIRST: Everything else depends on being able to read and index markdown.

Phase 2: Cache Infrastructure
  [vault-index.json]         -- File metadata index
  [link-map.json]            -- Wiki-link adjacency map
  [tag-index.json]           -- Tag reverse index
  [vault-scanner agent]      -- Incremental scan agent

  WHY SECOND: Skills need cached data to avoid full vault reads.

Phase 3: Core Skills
  [/briefing]                -- Daily vault overview (reads cache)
  [/triage]                  -- Inbox classification (reads cache + files)
  [/maintain]                -- Vault hygiene (reads cache, proposes fixes)
  [/scan]                    -- Manual cache rebuild trigger

  WHY THIRD: User-facing value. Depends on cache being available.

Phase 4: Knowledge Graph
  [vault-graph.json]         -- Entity-relation-observation model
  [graph-builder agent]      -- Level 2 semantic analysis
  [/connect]                 -- Connection discovery skill
  [/synthesize]              -- Thematic synthesis skill

  WHY FOURTH: Requires Level 1 cache + LLM inference. Higher complexity.

Phase 5: Intelligence Layer
  [clusters.json]            -- Semantic clustering (Level 3)
  [Emergent MOC proposals]   -- Structure evolution suggestions
  [Contradiction detection]  -- Cross-note conflict identification
  [Knowledge gap analysis]   -- What the vault doesn't know

  WHY LAST: Requires full graph + significant LLM reasoning. Highest value
  but highest complexity. Also depends on having enough vault content
  to analyze meaningfully.
```

## Sources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- Official, verified (HIGH confidence)
- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory) -- Official, verified (HIGH confidence)
- [Claude Code Sub-Agents Documentation](https://code.claude.com/docs/en/sub-agents) -- Official, verified (HIGH confidence)
- [Knowledge Graph Memory MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) -- Official Anthropic reference implementation (HIGH confidence)
- [Obsidian Skills by Kepano](https://github.com/kepano/obsidian-skills) -- Official Obsidian creator's implementation (HIGH confidence)
- [Obsidian Claude PKM by ballred](https://github.com/ballred/obsidian-claude-pkm) -- Community reference architecture (MEDIUM confidence)
- [Graphiti incremental knowledge graph architecture](https://neo4j.com/blog/developer/graphiti-knowledge-graph-memory/) -- Verified pattern (MEDIUM confidence)
- [CocoIndex knowledge graph from markdown](https://cocoindex.io/blogs/meeting-notes-graph) -- Pattern reference (MEDIUM confidence)
- [Obsidian Forum: Large vault performance](https://forum.obsidian.md/t/quicker-global-search-file-search-better-indexing/56569) -- Community evidence (MEDIUM confidence)

---
*Architecture research for: AI-native Obsidian knowledge management*
*Researched: 2026-03-07*
