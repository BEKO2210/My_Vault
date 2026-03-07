# Stack Research

**Domain:** AI-native personal knowledge management system (Obsidian vault + Claude Code)
**Researched:** 2026-03-07
**Confidence:** HIGH (core stack), MEDIUM (semantic analysis patterns)

## Executive Summary

Firstbrain is not a traditional web application. It is a **Claude Code skill ecosystem** that operates on a local Obsidian vault of plain markdown files. There is no server, no database, no frontend framework. The "stack" is Claude Code's extensibility system (skills, subagents, hooks, memory) combined with shell-invocable scripts that parse markdown, build graph caches, and maintain persistent state in `.claude/` directories.

This distinction is critical: the primary "framework" is Claude Code itself. Skills are the delivery mechanism for every feature. Shell scripts (Node.js or Python) are the compute layer. JSON files in `.claude/` are the persistence layer. Markdown files are the source of truth.

## Recommended Stack

### Core Platform: Claude Code Extensibility

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Claude Code Skills | Current (v2.1+) | Primary delivery mechanism for all AI features | Skills are the official extensibility model. They replaced slash commands in v2.1.3 and support YAML frontmatter, supporting files, subagent delegation, argument passing, and dynamic context injection. Every Firstbrain capability (`/briefing`, `/maintain`, `/synthesize`, `/triage`, `/connect`) should be a skill. |
| Claude Code Subagents | Current (v2.1+) | Isolated execution for intensive analysis tasks | Subagents run in their own context window with custom system prompts, tool restrictions, and independent permissions. Use for vault-wide scanning, graph construction, and synthesis operations that would overwhelm the main conversation context. |
| Claude Code Hooks | Current (v2.0+) | Automated triggers on file changes and tool use | PostToolUse hooks on Write/Edit tools enable automatic index updates when notes change. PreToolUse hooks can validate operations before execution. |
| Claude Code Auto Memory | Current | Claude's own learning about the vault | Auto memory at `~/.claude/projects/<project>/memory/` lets Claude accumulate vault-specific patterns, user preferences, and organizational insights across sessions. |
| CLAUDE.md + .claude/rules/ | Current | Persistent project instructions and context | The vault's CLAUDE.md defines conventions. Path-specific rules in `.claude/rules/` scope instructions to file types (e.g., rules that load only when working with project files vs. resource files). |

**Confidence: HIGH** -- All verified against official Claude Code documentation at code.claude.com.

### Markdown Processing

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| gray-matter | 4.x | YAML frontmatter extraction from markdown | Battle-tested, used by Gatsby, Astro, VitePress, TinaCMS, Shopify, and hundreds of other projects. Returns clean `{ data, content }` objects. Supports YAML, JSON, TOML frontmatter. TypeScript types included. |
| unified + remark-parse | 11.x / 13.x | Markdown AST parsing | The standard markdown-to-AST pipeline. Produces mdast (markdown abstract syntax tree) that can be walked, queried, and transformed. Required for heading extraction, content structure analysis, and semantic sectioning. |
| @portaljs/remark-wiki-link | 0.x | Obsidian-style `[[wiki-link]]` extraction | Parses `[[Note Name]]` and `[[Note Name\|Display Text]]` into AST nodes. Supports Obsidian's shortest-path matching. Works as a remark plugin in the unified pipeline. |
| remark-frontmatter | 5.x | Frontmatter-aware AST parsing | Companion to remark-parse that prevents frontmatter from being parsed as markdown content. Ensures clean AST when using unified pipeline alongside gray-matter. |

**Confidence: HIGH** -- gray-matter and unified/remark are the de facto standards. npm download counts in millions/week. @portaljs/remark-wiki-link verified on npm.

### Knowledge Graph Storage

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| JSON adjacency list files | N/A | Graph persistence in `.claude/` | JSON is human-readable, git-friendly, and directly consumable by Claude without any library dependencies. An adjacency list format stores nodes and typed/weighted edges compactly. Regenerable from markdown source files. |
| Node.js `fs` module | Built-in | File system operations | No external dependency needed. `fs.readdir`, `fs.readFile`, `fs.writeFile` with `{ recursive: true }` handles all vault traversal. |

**Rationale for JSON over alternatives:**
- **No database**: SQLite or Neo4j would add dependencies and break the "regenerable from markdown" constraint. The vault must work without any installed database.
- **No binary formats**: Must be inspectable, debuggable, and git-diffable. JSON meets all three.
- **Claude-native**: Claude can read and reason about JSON directly. No serialization layer needed.
- **Size**: A 5,000-note graph with typed edges fits comfortably in a single JSON file under 5MB. Partitioned by type (nodes.json, edges.json, index.json), each file stays well under 1MB.

**Confidence: HIGH** -- JSON is the only format that satisfies all project constraints (regenerable, no dependencies, Claude-readable, git-friendly).

### Script Runtime

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Node.js | 18+ LTS | Script execution for vault analysis | Already required by Claude Code. Skills can invoke Node.js scripts via `!`command`` syntax or Bash tool. gray-matter and unified are Node.js libraries. Avoids adding Python as a second runtime dependency. |

**Confidence: HIGH** -- Node.js is the natural choice given the markdown processing libraries are all JavaScript/TypeScript.

### Memory & State Persistence

| Technology | Format | Purpose | Why Recommended |
|------------|--------|---------|-----------------|
| `.claude/memory/` directory | Markdown + JSON | Layered memory system | Aligns with Claude Code's auto memory pattern. MEMORY.md as index (first 200 lines loaded automatically), topic files on demand. Vault-specific knowledge persists across sessions. |
| `.claude/cache/` directory | JSON | Regenerable computed state | Graph cache, note index, tag index, relationship maps. All derivable from markdown source. Can be deleted and rebuilt without data loss. |
| `.claude/state/` directory | JSON | Session-bridging working state | Current priorities, active scan cursors, last-scan timestamps for incremental processing. Small files, frequently updated. |

**Memory Layer Mapping (from PROJECT.md):**

| PROJECT.md Layer | Implementation | Format | Update Frequency |
|------------------|----------------|--------|------------------|
| Session memory | Claude's native context window | N/A (ephemeral) | Continuous |
| Working memory | `.claude/state/working.json` | JSON | Per session start, updated during session |
| Long-term summary | `.claude/memory/MEMORY.md` + topic files | Markdown | Weekly or on significant change |
| Project-specific | `.claude/state/projects/<name>.json` | JSON | Per project interaction |

**Confidence: HIGH** -- Directly maps to Claude Code's documented auto memory architecture. The `.claude/` directory is already the designated location for Claude-specific data in the vault.

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| js-yaml | 4.x | YAML parsing beyond frontmatter | When processing tag conventions, parsing complex frontmatter structures, or generating YAML output. gray-matter uses this internally. |
| glob / fast-glob | 3.x / 3.x | File pattern matching for vault traversal | When skills need to find files matching patterns (e.g., all projects, all notes modified this week). More efficient than manual `fs.readdir` recursion for pattern-based queries. |
| natural | 6.x | Lightweight NLP: tokenization, stemming, TF-IDF | For Level 2 semantic analysis: keyword extraction, topic similarity scoring between notes without external API calls. Runs entirely locally. No embeddings API needed. |
| mdast-util-to-string | 4.x | Extract plain text from mdast nodes | When converting parsed markdown AST sections to plain text for analysis or comparison. |

**Confidence: MEDIUM** -- gray-matter, js-yaml, glob verified. `natural` is a well-known NLP library for Node.js but its fit for this specific use case (vault-scale topic extraction) needs validation during implementation.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Claude Code `/agents` command | Interactive subagent management | Create, edit, test subagents without manual file editing |
| Claude Code `/memory` command | Memory inspection and management | View loaded CLAUDE.md files, toggle auto memory, browse memory directory |
| Claude Code `/context` command | Context window inspection | Check loaded skills, rules, and context usage. Critical for debugging skill loading issues. |
| Node.js `--test` runner | Script testing | Built-in test runner (Node 18+) avoids adding jest/mocha dependency. Sufficient for utility script testing. |

## Skill Architecture

### Skill Directory Structure

```
.claude/
  skills/
    briefing/
      SKILL.md              # Daily briefing generation
      templates/
        briefing-template.md
    maintain/
      SKILL.md              # Vault maintenance operations
    synthesize/
      SKILL.md              # Cross-note synthesis
    triage/
      SKILL.md              # Inbox triage automation
    connect/
      SKILL.md              # Link suggestion engine
    scan/
      SKILL.md              # Vault scanning and index rebuild
      scripts/
        scan-vault.mjs      # Node.js vault scanner
        build-graph.mjs     # Graph construction script
        extract-metadata.mjs # Frontmatter extraction
    health/
      SKILL.md              # Vault health check (orphans, decay, conflicts)
  agents/
    vault-analyzer.md       # Subagent for deep vault analysis
    graph-builder.md        # Subagent for knowledge graph construction
  rules/
    note-creation.md        # Rules for creating notes (scoped to template paths)
    project-notes.md        # Rules when working in 01 - Projects/
    resource-notes.md       # Rules when working in 03 - Resources/
  cache/
    graph.json              # Knowledge graph (nodes + edges)
    note-index.json         # Note metadata index
    tag-index.json          # Tag frequency and co-occurrence
    link-index.json         # Bidirectional link map
  state/
    working.json            # Current session working state
    scan-cursor.json        # Incremental scan position
    projects/               # Per-project state files
  memory/
    MEMORY.md               # Memory index (loaded first 200 lines)
    patterns.md             # Discovered vault patterns
    decisions.md            # Key decisions and rationale
```

### Skill Frontmatter Patterns

**User-invoked task skills** (e.g., `/briefing`, `/maintain`):
```yaml
---
name: briefing
description: Generate a daily briefing with priorities, changes, and suggestions
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---
```

**Auto-invoked reference skills** (e.g., note creation conventions):
```yaml
---
name: note-conventions
description: Conventions for creating and editing notes in the vault. Use when creating, modifying, or classifying notes.
user-invocable: false
---
```

**Subagent-delegated skills** (e.g., full vault scan):
```yaml
---
name: scan
description: Scan the vault, rebuild indexes, and update the knowledge graph
context: fork
agent: vault-analyzer
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---
```

### Subagent Patterns

**Vault Analyzer** (`.claude/agents/vault-analyzer.md`):
```yaml
---
name: vault-analyzer
description: Deep vault analysis agent for scanning, indexing, and pattern detection. Runs in isolation to avoid overwhelming main context.
tools: Read, Grep, Glob, Bash
model: sonnet
memory: project
---
```

**Graph Builder** (`.claude/agents/graph-builder.md`):
```yaml
---
name: graph-builder
description: Constructs and updates the knowledge graph from vault content. Use for full or incremental graph rebuilds.
tools: Read, Grep, Glob, Bash, Write
model: sonnet
memory: project
---
```

Both use `memory: project` so their `.claude/agent-memory/<name>/` directories accumulate vault-specific knowledge across sessions.

## Graph Data Format

### Recommended JSON Structure

**`cache/graph.json`** -- the knowledge graph:
```json
{
  "version": 1,
  "generated": "2026-03-07T10:00:00Z",
  "scanCursor": "2026-03-07T10:00:00Z",
  "nodes": {
    "Website Relaunch": {
      "path": "01 - Projects/Website Relaunch.md",
      "type": "project",
      "tags": ["active", "high"],
      "created": "2026-01-15",
      "modified": "2026-03-06",
      "headings": ["Ziele", "Meilensteine", "Verbindungen"],
      "wordCount": 450
    }
  },
  "edges": [
    {
      "source": "Website Relaunch",
      "target": "Web Development",
      "type": "belongs-to",
      "weight": 1.0,
      "origin": "explicit"
    },
    {
      "source": "Website Relaunch",
      "target": "React Patterns",
      "type": "depends-on",
      "weight": 0.8,
      "origin": "inferred"
    }
  ]
}
```

**Edge types** (from PROJECT.md requirements):
- `supports` -- Note A provides evidence or backing for Note B
- `contradicts` -- Note A conflicts with Note B
- `extends` -- Note A builds upon or elaborates Note B
- `inspired-by` -- Note A was inspired by Note B
- `prerequisite-for` -- Note A must be understood before Note B
- `depends-on` -- Note A depends on Note B for its context
- `belongs-to` -- Note A is part of Area/MOC B (structural)
- `mentions` -- Note A links to Note B (basic wiki-link, lowest weight)

**Edge origins**:
- `explicit` -- derived from wiki-links in the markdown
- `inferred` -- derived from semantic analysis (Level 2/3)
- `structural` -- derived from folder location or frontmatter

### Supporting Index Files

**`cache/note-index.json`** -- fast lookup without graph traversal:
```json
{
  "byPath": { "01 - Projects/Website Relaunch.md": { "title": "Website Relaunch", "type": "project", "modified": "2026-03-06" } },
  "byType": { "project": ["Website Relaunch", "..."], "area": ["..."] },
  "byTag": { "active": ["Website Relaunch", "..."] },
  "orphans": ["Unlinked Note"],
  "stale": [{ "title": "Old Project", "lastModified": "2025-01-01", "daysSinceModified": 431 }]
}
```

## Incremental Processing Strategy

The vault must scale to 5,000+ notes. Full-vault rescans on every session start are unacceptable.

**Approach: Modification-timestamp-based incremental scanning**

1. `.claude/state/scan-cursor.json` stores the last scan timestamp.
2. On session start, compare file `mtime` against the cursor.
3. Only re-parse files modified since last scan.
4. Update graph edges and index entries for changed files only.
5. Periodic full rebuild (e.g., weekly via `/maintain`) catches any drift.

**Implementation:** A Node.js script invoked by the `/scan` skill walks the vault directory, checks `mtime`, and processes only changed files through gray-matter + remark-parse pipeline.

**Confidence: HIGH** -- Standard incremental indexing pattern. File modification timestamps are reliable on all platforms.

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Frontmatter parsing | gray-matter | front-matter (npm) | gray-matter is more widely used (30M+ weekly downloads), supports multiple formats, better TypeScript support, and is actively maintained |
| Markdown AST | unified + remark-parse | markdown-it | markdown-it is HTML-focused. We need AST traversal, not HTML output. unified/remark gives us a proper AST to walk and query. |
| Wiki-link parsing | @portaljs/remark-wiki-link | Custom regex | Regex breaks on edge cases (nested brackets, aliased links, embedded links). A proper parser handles all Obsidian link formats correctly. |
| Graph storage | JSON files | SQLite | SQLite adds a binary dependency, is not human-readable, and is not directly consumable by Claude. JSON satisfies all constraints. |
| Graph storage | JSON files | Neo4j | Massive overkill for a single-user local vault. Adds infrastructure dependency. JSON covers all required graph operations. |
| NLP/Semantics | natural (local) | OpenAI/Anthropic embeddings API | External API calls add latency, cost, and network dependency for every analysis. TF-IDF and keyword extraction from `natural` are sufficient for topic similarity. Embeddings are a future enhancement, not a requirement. |
| Script runtime | Node.js | Python | Would introduce a second runtime. Node.js is already available (Claude Code dependency), and all markdown processing libraries are JavaScript. Python's obsidiantools is nice but adds dependency management complexity. |
| Skill delivery | Claude Code Skills | CLAUDE.md instructions only | Skills are versioned, shareable, can delegate to subagents, support argument passing, and have frontmatter configuration. CLAUDE.md alone cannot provide structured commands. |
| Memory persistence | .claude/ markdown + JSON | Mem0 or other memory frameworks | External memory frameworks add dependencies and complexity. Claude Code's native auto memory + handcrafted memory files in .claude/ provide exactly the layered persistence the project needs. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Obsidian JS plugins | Project explicitly excludes custom plugin development. Claude Code skills are the chosen implementation vehicle. Plugins require Obsidian API knowledge and are harder to version/share. | Claude Code skills in `.claude/skills/` |
| Vector databases (Pinecone, Weaviate, ChromaDB) | Adds external service dependency. Single-user local vault does not need vector search infrastructure. | TF-IDF keyword similarity via `natural`, or Claude's own reasoning about note content |
| LangChain / LlamaIndex | Frameworks designed for RAG pipelines with external LLMs. Firstbrain uses Claude Code as the cognitive engine directly -- no intermediary framework needed. | Direct Claude Code skills + shell scripts |
| Electron/Tauri UI | No separate UI is needed. Obsidian IS the UI. Claude Code IS the command interface. Building another UI layer adds complexity with zero value. | Obsidian for visual interaction, Claude Code CLI for AI features |
| MongoDB / PostgreSQL | Server-side databases are inappropriate for a local, single-user, file-based system. | JSON files in `.claude/cache/` |
| remark-obsidian (npm) | Low download count, uncertain maintenance status. More opinionated than needed -- we only need wiki-link parsing, not full Obsidian flavor support. | @portaljs/remark-wiki-link for wiki-links, gray-matter for frontmatter |
| Python obsidiantools | Excellent library, but introduces Python dependency management alongside Node.js. The same functionality (vault traversal, link extraction, graph construction) is achievable with gray-matter + remark in Node.js. | gray-matter + unified/remark-parse + @portaljs/remark-wiki-link |

## Stack Patterns by Variant

**If the vault has < 500 notes (early stage):**
- Full vault scan on every `/briefing` or `/maintain` invocation is acceptable
- Single `graph.json` file, no partitioning needed
- `natural` NLP can process all notes in one pass

**If the vault has 500-5,000 notes (growth stage):**
- Incremental scanning becomes essential
- Consider partitioning graph cache by note type (projects.json, resources.json, etc.)
- Topic files in `.claude/memory/` should be organized by domain

**If the vault exceeds 5,000 notes (scale stage):**
- Stream-based file processing (process files one at a time, don't load all into memory)
- Graph partitioning by folder/type required
- Consider adding a `cache/search-index.json` with pre-computed TF-IDF vectors for fast similarity queries
- Subagent-based analysis (delegate to vault-analyzer subagent to keep main context clean)

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| gray-matter@4.x | Node.js 18+ | Stable, no breaking changes expected. Uses js-yaml internally. |
| unified@11.x | remark-parse@11.x, remark-frontmatter@5.x | ESM-only. Ensure `"type": "module"` in package.json or use `.mjs` extension. |
| @portaljs/remark-wiki-link@0.x | unified@11.x, remark-parse@11.x | ESM-only. Drop-in remark plugin. |
| natural@6.x | Node.js 18+ | Large package (~25MB). Only import specific submodules (TfIdf, PorterStemmer) to minimize footprint. |

**Critical note:** unified v11+ and remark-parse v11+ are **ESM-only**. All vault analysis scripts must use `.mjs` extension or set `"type": "module"`. This is non-negotiable since CommonJS imports will fail.

## Installation

```bash
# Create a package.json for vault utility scripts
cd .claude/scripts
npm init -y

# Core markdown processing
npm install gray-matter unified remark-parse remark-frontmatter

# Obsidian wiki-link support
npm install @portaljs/remark-wiki-link

# AST utilities
npm install mdast-util-to-string

# NLP for semantic analysis (Level 2)
npm install natural

# File pattern matching
npm install fast-glob

# Development
npm install -D @types/node
```

**Note:** These packages live in `.claude/scripts/` (or a similar `.claude/` subdirectory), not at the vault root. The vault root should remain a clean Obsidian vault. The `node_modules` directory should be in `.gitignore`.

## Sources

- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills) -- Official docs on skill creation, frontmatter, supporting files, subagent delegation (HIGH confidence)
- [Claude Code Memory Documentation](https://code.claude.com/docs/en/memory) -- CLAUDE.md hierarchy, auto memory, .claude/rules/, imports (HIGH confidence)
- [Claude Code Subagents Documentation](https://code.claude.com/docs/en/sub-agents) -- Subagent creation, .claude/agents/, memory persistence, hooks (HIGH confidence)
- [gray-matter on npm](https://www.npmjs.com/package/gray-matter) -- Frontmatter parser documentation and API (HIGH confidence)
- [gray-matter on GitHub](https://github.com/jonschlinkert/gray-matter) -- Source, examples, TypeScript support (HIGH confidence)
- [unified ecosystem](https://unifiedjs.com/) -- remark-parse, AST processing pipeline (HIGH confidence)
- [@portaljs/remark-wiki-link on npm](https://www.npmjs.com/package/@portaljs/remark-wiki-link) -- Obsidian-style wiki-link parser (MEDIUM confidence -- lower download count but maintained)
- [JSON Graph Specification](https://github.com/jsongraph/json-graph-specification) -- Reference for graph data format in JSON (MEDIUM confidence)
- [Building Persistent Memory for AI Agents](https://dev.to/oblivionlabz/building-persistent-memory-for-ai-agents-a-4-layer-file-based-architecture-4pip) -- 4-layer file-based memory architecture (MEDIUM confidence)
- [Agent Memory Architecture](https://dev.to/mfs_corp/agent-memory-architecture-how-our-ai-remembers-across-sessions-j8l) -- Memory patterns for AI agents (MEDIUM confidence)
- [Obsidian Forum: Vault Scalability](https://forum.obsidian.md/t/terabyte-size-million-notes-vaults-how-scalable-is-obsidian/66674) -- Performance characteristics at scale (MEDIUM confidence)
- [natural on npm](https://www.npmjs.com/package/natural) -- Node.js NLP library for tokenization, stemming, TF-IDF (MEDIUM confidence -- verified library, unverified fit for this exact use case)

---
*Stack research for: AI-native Obsidian knowledge management with Claude Code*
*Researched: 2026-03-07*
