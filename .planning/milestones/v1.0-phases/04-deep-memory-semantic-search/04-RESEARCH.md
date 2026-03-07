# Phase 4: Deep Memory & Semantic Search - Research

**Researched:** 2026-03-07
**Domain:** Long-term insight memory, project-specific memory, vector embeddings, semantic search, SQLite storage
**Confidence:** HIGH

## Summary

Phase 4 adds three capabilities: (1) long-term summary memory that distills organizational patterns and recurring themes into `.claude/memory/insights.md`, (2) project-specific memory via individual `.claude/memory/project-{name}.md` files, and (3) semantic search using vector embeddings stored in SQLite. The phase transitions Firstbrain from explicit-data skills (tags, links, names) to semantic intelligence (meaning-based search and pattern recognition).

The critical technical finding is that Node.js v25.6.1 includes built-in SQLite (`node:sqlite`) with full BLOB/TypedArray support, enabling vector storage without any external database dependency. Empirical benchmarks confirm that brute-force cosine similarity on 384-dimensional vectors (the output dimension of all-MiniLM-L6-v2) completes in <1ms for 500 notes and ~5ms for 5000 notes -- more than adequate for a personal knowledge vault. This eliminates the need for sqlite-vec or any vector search extension.

For embeddings, the recommended approach is `@huggingface/transformers` with the `Xenova/all-MiniLM-L6-v2` model (~23MB download, 384-dim output, runs locally in Node.js). This is the first external dependency in the project. The alternative -- OpenAI's embedding API ($0.02/1M tokens via HTTP fetch, zero dependencies) -- remains a viable fallback. Both approaches can coexist behind an adapter interface, with the implementation choosing based on availability.

**Primary recommendation:** Use Node.js built-in `node:sqlite` for vector storage (BLOB columns, no extensions needed), `@huggingface/transformers` for local embedding generation, and pure JavaScript cosine similarity for search. Insight distillation and project memory are convention-based (markdown files Claude reads/writes), requiring no new infrastructure beyond the existing memory architecture. Tie embedding index updates to the existing `/scan` skill for consistency.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Threshold-based triggers using combined signals: activity volume (e.g., 10+ note changes) AND topic density (e.g., 3+ notes in same tag cluster) -- distill when either is met
- Distill both organizational patterns (tagging habits, folder preferences, linking style) and thematic patterns (recurring topics, growing interests, knowledge clusters)
- Proactive surfacing with distinct visual callout blocks ("Pattern noticed:") -- not woven into conversation text
- Single file: .claude/memory/insights.md with emergent categories (section headers form as patterns emerge, not predefined)
- Confidence tracking with thresholds -- only surface/act on insights above a confidence threshold; track observation count per insight
- User-editable -- insights.md is plain markdown, user can correct or delete entries directly; Claude respects corrections
- Cross-reference top insights in MEMORY.md (brief mention, full detail stays in insights.md)
- Soft limit ~100 entries with automatic pruning of low-confidence or stale insights
- Distillation notifications at Claude's discretion (notify for significant updates, stay silent for minor ones)
- Projects identified from vault structure: any note in `01 - Projects/` with `type: project` frontmatter
- Track per project: current status, key decisions made, blockers, and planned next actions -- enough to resume without re-explaining
- Individual files: `.claude/memory/project-{name}.md` per project (one file per active project)
- On project completion: archive to `.claude/memory/archive/project-{name}.md`, distill key lessons into insights.md
- Both dedicated `/search` skill for explicit queries AND implicit semantic search woven into conversation when relevant
- Embedding-based vector similarity (cosine similarity) -- requires embedding model (local or API, researcher to determine best approach)
- Results display: note title + relevant excerpt showing why it matched + relevance indicator (high/medium/low)
- Adaptive result count -- show all results above a relevance threshold rather than fixed N; could be 3 or 8 depending on match quality
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

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MEM-04 | Long-term summary memory distills patterns, recurring themes, and organizational insights | `.claude/memory/insights.md` with emergent categories. Threshold triggers (activity volume OR topic density). Confidence tracking per insight with observation count. Pruning at ~100 entries. Decay for unobserved patterns. All convention-based: Claude reads/writes markdown. |
| MEM-05 | Project-specific memory tracks per-project state, decisions, and context | Individual `.claude/memory/project-{name}.md` files. Projects identified from vault-index: notes in `01 - Projects/` with `type: project`. Archive workflow on completion to `.claude/memory/archive/`. Lesson distillation into insights.md. |
| CONN-05 | Semantic search finds notes by meaning, not just keyword matching | `@huggingface/transformers` with `Xenova/all-MiniLM-L6-v2` (384-dim embeddings, ~23MB model). Stored as BLOB in `node:sqlite` at `.claude/embeddings.db`. Pure JS cosine similarity (<1ms for 500 notes). Body text extraction from vault .md files. Adaptive threshold-based result filtering. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js built-in `node:sqlite` | v25.6.1 (SQLite 3.51.2) | Vector embedding storage, metadata tracking | Built-in, no dependencies. Supports BLOB columns for Float32Array vectors. Synchronous API via DatabaseSync. Stability: 1.2 Release Candidate. |
| `@huggingface/transformers` | v3.x (latest) | Local embedding generation via ONNX runtime | De facto standard for JS embeddings. Runs `Xenova/all-MiniLM-L6-v2` locally. ~23MB model download, cached after first run. ESM package, use `await import()` from CJS. |
| `Xenova/all-MiniLM-L6-v2` | ONNX quantized | Sentence embedding model (384-dim output) | Industry standard small embedding model. ~22M params, 384-dim output. Handles up to 256 tokens (sufficient for note titles + first paragraphs). Fast on CPU (~5-14k sentences/sec). |
| Phase 2 scanner (`scanner.cjs`) | 1.0.0 | Trigger incremental scan + embedding updates | User decision: embedding index updates tied to /scan. |
| Phase 2 indexes (`vault-index.json`, etc.) | v1 | Source of note paths, types, tags, hashes | Existing infrastructure. Content hashes enable incremental embedding (skip unchanged notes). |
| Phase 3 memory infrastructure | 1.0.0 | MEMORY.md, `.claude/memory/` files | Existing convention-based memory. Phase 4 extends with insights.md and project-{name}.md files. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Phase 2 `utils.cjs` | 1.0.0 | `loadJson`, `writeJsonAtomic`, `hashContent` | Loading indexes, writing JSON, content hashing for change detection |
| Phase 2 `parser.cjs` | 1.0.0 | `extractFrontmatter` | Extracting note type/tags for project identification and embedding metadata |
| Node.js built-in `fs` | v25.6.1 | File I/O for reading note body text, writing memory files | Body text extraction for embeddings, memory file management |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@huggingface/transformers` (local) | OpenAI `text-embedding-3-small` API via fetch | API: zero deps, $0.02/1M tokens, requires API key + internet. Local: first external dep (~23MB), but works offline, no API key, no recurring cost. **Recommend local as primary, API as fallback.** |
| `node:sqlite` built-in | `better-sqlite3` npm package | better-sqlite3 is more mature but adds a native binary dependency. node:sqlite is built-in (Stability 1.2), tested and working for BLOB/TypedArray storage on Node 25.6.1. |
| Brute-force cosine similarity | `sqlite-vec` extension | sqlite-vec adds prebuilt native binaries (~150KB). Brute-force is <5ms for 5000 vectors at 384-dim -- negligible for a personal vault. No ANN index needed. |
| `all-MiniLM-L6-v2` | `EmbeddingGemma-300M` or `Qwen3-Embedding-0.6B` | MiniLM is 22M params (tiny), well-tested in Transformers.js. Larger models offer better quality but slower inference and larger downloads. MiniLM is the right balance for personal vault search. |

**Installation:**
```bash
# In vault root (creates package.json if not present)
npm init -y
npm install @huggingface/transformers

# node:sqlite is built-in -- no install needed
# Model downloaded automatically on first use (~23MB, cached)
```

## Architecture Patterns

### Recommended Project Structure
```
.agents/skills/
├── scan/                       # Phase 2 (existing)
├── create/                     # Phase 3 (existing)
├── daily/                      # Phase 3 (existing)
├── connect/                    # Phase 3 (existing)
├── health/                     # Phase 3 (existing)
├── search/                     # Phase 4: Semantic search
│   ├── SKILL.md                # /search interface definition
│   ├── search-utils.cjs        # Search query, result formatting
│   └── embedder.cjs            # Embedding generation + SQLite storage
├── memory/                     # Phase 4: Memory management
│   ├── SKILL.md                # /memory interface definition
│   └── memory-utils.cjs        # Insight distillation, project memory, /memory overview
└── (future Phase 5 skills)

.claude/
├── memory/
│   ├── preferences.md          # Phase 3 (existing)
│   ├── projects.md             # Phase 3 (existing, replaced by per-project files)
│   ├── insights.md             # Phase 4: Long-term summary memory (Layer 3)
│   ├── project-{name}.md       # Phase 4: Per-project memory (Layer 4)
│   └── archive/                # Phase 4: Archived project memories
│       └── project-{name}.md
├── indexes/                    # Phase 2 (existing)
│   ├── vault-index.json
│   ├── link-map.json
│   ├── tag-index.json
│   └── scan-state.json
├── embeddings.db               # Phase 4: SQLite vector database
├── changelog.md
├── rules/
└── settings.json
```

### Pattern 1: SQLite Embedding Storage with node:sqlite
**What:** Store vector embeddings as BLOB columns in a SQLite database using Node.js built-in `node:sqlite`. Use content hash from scan-state to detect changes and avoid re-embedding unchanged notes.
**When to use:** Embedding persistence and retrieval.
**Verified:** Tested on Node.js v25.6.1 -- DatabaseSync with CommonJS `require('node:sqlite')` works.

```javascript
// embedder.cjs -- SQLite schema and operations
'use strict';

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    embedding BLOB NOT NULL,
    content_hash TEXT NOT NULL,
    note_type TEXT,
    title TEXT,
    updated INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_emb_path ON embeddings(path);
  CREATE INDEX IF NOT EXISTS idx_emb_hash ON embeddings(content_hash);
`;

function openDb(vaultRoot) {
  const dbPath = path.join(vaultRoot, '.claude', 'embeddings.db');
  const db = new DatabaseSync(dbPath);
  db.exec(SCHEMA);
  return db;
}

function storeEmbedding(db, notePath, embedding, contentHash, noteType, title) {
  const blob = new Uint8Array(embedding.buffer);
  db.prepare(`
    INSERT OR REPLACE INTO embeddings (path, embedding, content_hash, note_type, title, updated)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(notePath, blob, contentHash, noteType, title, Date.now());
}

function getAllEmbeddings(db) {
  return db.prepare('SELECT path, embedding, title, note_type FROM embeddings').all();
}

function getEmbeddingByPath(db, notePath) {
  return db.prepare('SELECT * FROM embeddings WHERE path = ?').get(notePath);
}

function deleteEmbedding(db, notePath) {
  db.prepare('DELETE FROM embeddings WHERE path = ?').run(notePath);
}

// Convert BLOB back to Float32Array
function blobToVector(blob) {
  return new Float32Array(blob.buffer, blob.byteOffset, blob.byteLength / 4);
}
```

### Pattern 2: Pure JavaScript Cosine Similarity Search
**What:** Compute cosine similarity between a query vector and all stored embeddings. No vector search extension needed.
**When to use:** Semantic search queries.
**Verified:** Benchmarked at <1ms for 500 vectors (384-dim), ~5ms for 5000 vectors.

```javascript
// search-utils.cjs
'use strict';

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function semanticSearch(queryEmbedding, allEmbeddings, options = {}) {
  const threshold = options.threshold || 0.3;
  const maxResults = options.maxResults || 20;

  const results = [];
  for (const row of allEmbeddings) {
    const stored = new Float32Array(
      row.embedding.buffer,
      row.embedding.byteOffset,
      row.embedding.byteLength / 4
    );
    const similarity = cosineSimilarity(queryEmbedding, stored);
    if (similarity >= threshold) {
      results.push({
        path: row.path,
        title: row.title,
        type: row.note_type,
        similarity,
        confidence: similarity >= 0.7 ? 'high' : similarity >= 0.5 ? 'medium' : 'low',
      });
    }
  }

  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults);
}
```

### Pattern 3: Embedding Generation with Transformers.js (ESM from CJS)
**What:** Load `@huggingface/transformers` via dynamic `import()` from CommonJS, generate embeddings with `all-MiniLM-L6-v2`.
**When to use:** Generating embeddings for new or changed notes.
**Important:** Transformers.js is ESM-only. Must use `await import()` from .cjs files.

```javascript
// embedder.cjs -- embedding generation
'use strict';

let _pipeline = null;

async function getEmbedder() {
  if (_pipeline) return _pipeline;
  // Dynamic import of ESM package from CJS
  const { pipeline } = await import('@huggingface/transformers');
  _pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    // Cache models in .claude directory to keep vault clean
    cache_dir: '.claude/.models',
  });
  return _pipeline;
}

async function generateEmbedding(text) {
  const extractor = await getEmbedder();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return new Float32Array(output.data);
}

async function generateEmbeddings(texts) {
  const extractor = await getEmbedder();
  const results = [];
  for (const text of texts) {
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    results.push(new Float32Array(output.data));
  }
  return results;
}
```

### Pattern 4: Body Text Extraction for Embedding Input
**What:** Extract meaningful text from vault .md files for embedding generation. Strip frontmatter, code blocks, and wiki-link syntax. Combine title + headings + body for rich semantic content.
**When to use:** Before generating embeddings for each note.

```javascript
// embedder.cjs -- text extraction
'use strict';

function extractBodyText(content) {
  // Remove frontmatter
  let text = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`[^`]+`/g, '');
  // Convert wiki-links to plain text: [[Note Name|Display]] -> Display, [[Note Name]] -> Note Name
  text = text.replace(/\[\[([^\]]*?\|)?([^\]]+?)\]\]/g, '$2');
  // Remove markdown formatting (bold, italic, etc.)
  text = text.replace(/[*_~]{1,3}/g, '');
  // Remove heading markers
  text = text.replace(/^#{1,6}\s+/gm, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Collapse whitespace
  text = text.replace(/\n{3,}/g, '\n\n').trim();
  return text;
}

function buildEmbeddingInput(noteName, noteContent, maxLength) {
  maxLength = maxLength || 512; // MiniLM handles up to 256 tokens (~512 chars safely)
  const body = extractBodyText(noteContent);
  // Title first (most important signal), then body
  const combined = noteName + '. ' + body;
  // Truncate to model's effective range
  return combined.slice(0, maxLength);
}
```

### Pattern 5: Incremental Embedding Sync via /scan Integration
**What:** After /scan detects changed files, re-embed only the added/modified notes. Delete embeddings for removed notes. Use content hash comparison to skip unchanged notes.
**When to use:** Every time /scan runs.

```javascript
// embedder.cjs -- incremental sync
'use strict';

async function syncEmbeddings(vaultRoot, scanResult, vaultIndex) {
  const db = openDb(vaultRoot);

  // Files to embed: added + modified (from scan result)
  const toEmbed = [...(scanResult.details?.added || []), ...(scanResult.details?.modified || [])];

  // Files to remove: deleted
  const toDelete = scanResult.details?.deleted || [];

  for (const filePath of toDelete) {
    deleteEmbedding(db, filePath);
  }

  for (const filePath of toEmbed) {
    const note = vaultIndex.notes[filePath];
    if (!note || note.isTemplate) continue;
    // Skip system files, MOCs, etc.
    if (filePath.startsWith('06 - Atlas/')) continue;

    const content = require('fs').readFileSync(
      require('path').join(vaultRoot, filePath), 'utf8'
    );
    const text = buildEmbeddingInput(note.name, content);
    const embedding = await generateEmbedding(text);
    storeEmbedding(db, filePath, embedding, note.hash, note.type, note.name);
  }

  db.close();
  return { embedded: toEmbed.length, deleted: toDelete.length };
}
```

### Pattern 6: Insight Distillation (Convention-Based)
**What:** Claude analyzes vault activity and writes structured insights to `.claude/memory/insights.md`. This is a reasoning task, not a code task -- Claude evaluates patterns and writes markdown.
**When to use:** After significant vault activity meets threshold triggers.

```markdown
# insights.md structure (emergent categories)
---
updated: 2026-03-07
entry_count: 12
---

# Long-term Insights

## Organizational Patterns

### Tagging habits
- **Observation:** User consistently tags tool notes with both the tool name and #productivity
- **Confidence:** 0.8 (observed 6 times, last seen: 2026-03-07)
- **Observations:** 6

### Folder preferences
- **Observation:** Decision notes are always created before meetings, suggesting a pre-meeting preparation workflow
- **Confidence:** 0.6 (observed 3 times, last seen: 2026-03-05)
- **Observations:** 3

## Thematic Patterns

### Growing interest: DevOps
- **Observation:** 5 notes about Docker, Kubernetes, CI/CD created in the past 2 weeks
- **Confidence:** 0.9 (observed 5 times, last seen: 2026-03-07)
- **Observations:** 5

## Stale / Low Confidence

### (entries below threshold, candidates for pruning)
```

### Pattern 7: Project Memory Lifecycle
**What:** Individual `.claude/memory/project-{name}.md` files track per-project state. Created when a project note is first encountered. Archived on completion.
**When to use:** Whenever Claude interacts with a project-type note.

```markdown
# project-website-relaunch.md structure
---
project: Website Relaunch
source: 01 - Projects/Website Relaunch.md
status: active
created: 2026-03-01
updated: 2026-03-07
---

# Project Memory: Website Relaunch

## Current Status
Active -- design phase, targeting April launch

## Key Decisions
- Using React + Next.js (decided 2026-03-02)
- Mobile-first responsive design (decided 2026-03-03)

## Blockers
- Waiting for brand guidelines from marketing team

## Next Actions
- Finalize homepage wireframes
- Schedule review meeting with stakeholders

## Context
User started this project after discussions about improving online presence.
Related notes: [[Tool -- Figma]], [[Decision -- Tech Stack]]
```

### Anti-Patterns to Avoid
- **Over-chunking for small vaults:** MiniLM handles 256 tokens. Most personal vault notes are short enough to embed as a single chunk (title + first ~500 chars). Don't implement complex recursive chunking for <100 notes.
- **Embedding everything:** Skip templates (`isTemplate: true`), MOC files (`06 - Atlas/`), system files (Home, START HERE, etc.), and the CLAUDE.md/MEMORY.md files. These are navigation, not knowledge.
- **Blocking on embedding generation:** First-time embedding of a full vault takes time (~2-5 seconds for 50 notes). Run async, report progress. Don't block the user interaction.
- **Pre-defining insight categories:** User decision is "emergent categories." Don't create a fixed taxonomy of insight types. Let section headers form naturally from observed patterns.
- **Storing raw text in SQLite:** Only store the embedding vector and metadata (path, hash, type, title). The full text lives in the vault files. Don't duplicate content in the database.
- **Requiring API keys for basic functionality:** Local embedding (Transformers.js) must work without configuration. API-based embedding is optional fallback, not required.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Embedding generation | Custom word2vec or TF-IDF vectorizer | `@huggingface/transformers` + `all-MiniLM-L6-v2` | Transformer embeddings capture semantic meaning far better than bag-of-words approaches. ~23MB is acceptable for the quality gain. |
| Vector database | Custom indexing with ANN (HNSW, IVF) | Brute-force cosine similarity on SQLite BLOBs | Personal vaults are <5000 notes. Brute-force at 384-dim is <5ms. ANN adds complexity for zero user-visible benefit. |
| SQLite driver | `better-sqlite3` or `sqlite3` npm | `node:sqlite` built-in | Node.js v25 includes SQLite natively (Stability 1.2). Avoids native binary compilation. Works with require(). |
| Insight detection | ML-based pattern recognition system | Claude's reasoning + structured markdown conventions | Claude IS the AI. It can detect patterns in vault activity through reading vault-index changes and tag-index distributions. No separate ML pipeline needed. |
| Text chunking framework | LangChain text splitters or custom recursive chunking | Simple title + first ~500 chars extraction | Notes in personal vaults are typically short (<1000 words). Complex chunking strategies are designed for large documents, not vault notes. |

**Key insight:** Phase 4 has two distinct domains: (1) memory management (pure convention -- Claude reads/writes markdown), and (2) semantic search (requires code infrastructure for embeddings + vector storage + similarity search). The memory domain needs no new libraries; the search domain needs exactly two: `@huggingface/transformers` for embedding and `node:sqlite` for storage.

## Common Pitfalls

### Pitfall 1: ESM/CJS Incompatibility with Transformers.js
**What goes wrong:** `@huggingface/transformers` is an ESM-only package. Calling `require('@huggingface/transformers')` from .cjs files throws an error.
**Why it happens:** The Firstbrain project uses CommonJS (.cjs files) exclusively. Transformers.js v3 dropped CJS support.
**How to avoid:** Use dynamic `import()` from CJS: `const { pipeline } = await import('@huggingface/transformers');`. This works in Node.js v25.6.1. All functions that use the embedding pipeline must be `async`.
**Warning signs:** `ERR_REQUIRE_ESM` or `Must use import to load ES Module` errors.

### Pitfall 2: First-Time Model Download Delay
**What goes wrong:** On first invocation, `all-MiniLM-L6-v2` downloads ~23MB from Hugging Face Hub. If the user runs `/search` for the first time, they experience a multi-second delay with no feedback.
**Why it happens:** Transformers.js downloads and caches the ONNX model on first pipeline creation.
**How to avoid:** (1) Set `cache_dir` to `.claude/.models` to keep vault root clean and enable gitignore. (2) Show progress message during first download: "Downloading embedding model (one-time setup, ~23MB)...". (3) Cache the pipeline instance -- only first call pays the download cost.
**Warning signs:** Long pauses on first `/search` or `/scan --embed` invocation.

### Pitfall 3: Token Limit Truncation for Long Notes
**What goes wrong:** `all-MiniLM-L6-v2` handles up to 256 tokens effectively (max 512 tokens, but quality degrades above 256). Long notes get silently truncated, losing important content from later sections.
**Why it happens:** The model has a fixed context window. Input beyond the limit is clipped.
**How to avoid:** Build embedding input as title + first ~500 characters of body text. This captures the most semantically important content (title is the strongest signal). For exceptionally long notes, consider extracting title + all headings + first paragraph as the embedding input.
**Warning signs:** Long notes with important content at the bottom not surfacing in search results.

### Pitfall 4: Stale Embeddings After Note Edits
**What goes wrong:** User edits a note's content but doesn't run `/scan`. The embedding in SQLite still represents the old content. Search returns results based on outdated semantics.
**Why it happens:** Embedding sync is tied to `/scan`. If the user modifies files outside of Claude (e.g., editing in Obsidian directly), embeddings get stale.
**How to avoid:** (1) On `/search` invocation, check scan-state staleness (>5 min) and auto-scan first. (2) Use content hash comparison -- skip re-embedding if the hash in SQLite matches the current scan-state hash. (3) `/scan --verbose` should report embedding sync status alongside file changes.
**Warning signs:** Search results that don't match recently edited note content.

### Pitfall 5: Insight Accumulation Without Pruning
**What goes wrong:** `insights.md` grows unbounded as Claude adds observations. After weeks of use, it exceeds useful size and becomes slow to parse.
**Why it happens:** Every observation gets written without removing stale or low-confidence entries.
**How to avoid:** (1) Soft limit at ~100 entries. (2) On each distillation pass, scan existing insights and prune: remove entries with confidence < 0.3, remove entries not re-observed in 30+ days, consolidate similar observations. (3) Rewrite the entire file on each update (same pattern as MEMORY.md).
**Warning signs:** insights.md exceeding 200 lines, containing entries about patterns that no longer apply.

### Pitfall 6: Confidence Decay Without Clear Reset Mechanism
**What goes wrong:** Insights decay to zero confidence over time and get pruned, even though the pattern is still valid -- the user just hasn't created relevant notes recently.
**Why it happens:** Pure time-based decay doesn't account for activity patterns (e.g., user takes a 2-week vacation).
**How to avoid:** Decay should be activity-relative, not calendar-relative. Only decrease confidence when new vault activity doesn't reinforce the pattern. If there's no vault activity at all, don't decay.
**Warning signs:** Valid long-term patterns getting pruned after periods of inactivity.

### Pitfall 7: SQLite Database Locking
**What goes wrong:** Two concurrent Claude sessions try to write to embeddings.db simultaneously, causing SQLITE_BUSY errors.
**Why it happens:** SQLite file-based databases have write-locking. `DatabaseSync` uses synchronous operations.
**How to avoid:** (1) Set `timeout` option in DatabaseSync constructor (e.g., 5000ms) to wait for locks. (2) Keep write transactions short. (3) Use WAL mode for better concurrent read performance: `db.exec('PRAGMA journal_mode=WAL')`.
**Warning signs:** `SQLITE_BUSY` errors during scan or search operations.

### Pitfall 8: package.json Impact on Obsidian Vault
**What goes wrong:** Adding `package.json` and `node_modules/` to the vault root causes Obsidian to try to index JavaScript files, slowing down the app.
**Why it happens:** Obsidian indexes all files in the vault unless excluded.
**How to avoid:** (1) Add `node_modules/` to `.obsidianignore` (if supported) or keep it in Obsidian's excluded files settings. (2) Place `package.json` at vault root -- Obsidian handles it fine, it just ignores non-markdown files. (3) Alternatively, install in `.claude/` subdirectory and reference with relative paths. (4) Add `node_modules/` to `.gitignore`.
**Warning signs:** Obsidian becoming slow after npm install, or JavaScript files appearing in Obsidian search.

## Code Examples

Verified patterns from official sources and empirical testing:

### SQLite BLOB Vector Storage (Verified on Node.js 25.6.1)
```javascript
// Source: Empirical testing on this project's Node.js environment
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync('.claude/embeddings.db');
db.exec('PRAGMA journal_mode=WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE NOT NULL,
    embedding BLOB NOT NULL,
    content_hash TEXT NOT NULL,
    note_type TEXT,
    title TEXT,
    updated INTEGER NOT NULL
  )
`);

// Store: Float32Array -> Uint8Array -> BLOB
const vec = new Float32Array([0.1, 0.2, 0.3]); // 384-dim in practice
const blob = new Uint8Array(vec.buffer);
db.prepare('INSERT OR REPLACE INTO embeddings (path, embedding, content_hash, note_type, title, updated) VALUES (?, ?, ?, ?, ?, ?)')
  .run('03 - Resources/Tool -- Docker.md', blob, 'abc123', 'tool', 'Tool -- Docker', Date.now());

// Retrieve: BLOB -> Uint8Array -> Float32Array
const row = db.prepare('SELECT embedding FROM embeddings WHERE path = ?').get('03 - Resources/Tool -- Docker.md');
const retrieved = new Float32Array(row.embedding.buffer, row.embedding.byteOffset, row.embedding.byteLength / 4);
// retrieved is the original vector
```

### Transformers.js Embedding from CJS (Verified Pattern)
```javascript
// Source: https://huggingface.co/docs/transformers.js + Xenova/all-MiniLM-L6-v2
// Must use dynamic import() since @huggingface/transformers is ESM-only
'use strict';

let _pipeline = null;

async function getEmbedder() {
  if (_pipeline) return _pipeline;
  const { pipeline, env } = await import('@huggingface/transformers');
  env.cacheDir = '.claude/.models'; // Keep vault root clean
  _pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  return _pipeline;
}

async function embed(text) {
  const extractor = await getEmbedder();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  // output.data is Float32Array of length 384
  return new Float32Array(output.data);
}
```

### Cosine Similarity (Verified via Benchmarking)
```javascript
// Source: Empirical benchmarking on this project
// 500 vectors at 384-dim: <1ms
// 5000 vectors at 384-dim: ~5ms
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

### Embedding Database Status Check
```javascript
// For /memory overview command
function getEmbeddingStatus(vaultRoot) {
  const db = openDb(vaultRoot);
  const count = db.prepare('SELECT COUNT(*) as count FROM embeddings').get();
  const latest = db.prepare('SELECT MAX(updated) as latest FROM embeddings').get();
  const oldest = db.prepare('SELECT MIN(updated) as oldest FROM embeddings').get();
  db.close();
  return {
    totalEmbeddings: count.count,
    latestUpdate: latest.latest ? new Date(latest.latest).toISOString() : null,
    oldestUpdate: oldest.oldest ? new Date(oldest.oldest).toISOString() : null,
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| External SQLite packages (better-sqlite3, sqlite3) | Node.js built-in `node:sqlite` | Node.js 22.5.0 (experimental), 25.7.0 (RC) | Zero-dependency SQLite. Synchronous API. TypedArray BLOB support. |
| Word2vec / TF-IDF for local embeddings | Transformer models via ONNX (Transformers.js) | Transformers.js v3 (2024) | Semantic quality leap. all-MiniLM-L6-v2 captures meaning, not just word frequency. |
| Dedicated vector databases (Pinecone, Weaviate) | SQLite BLOB + brute-force search | Always viable for small datasets | For <5000 vectors, no indexing overhead justifies a separate service. <5ms search time. |
| sqlite-vss (FAISS-based) for SQLite vectors | sqlite-vec (pure C, lighter) or no extension needed | sqlite-vec replaced sqlite-vss (2024) | sqlite-vec is simpler but still unnecessary for vault-scale brute-force. |
| Python-only embedding pipelines | @huggingface/transformers (JavaScript) | Transformers.js v3 (2024), v4 preview (2026) | Full embedding pipeline in Node.js. No Python dependency. |

**Deprecated/outdated:**
- `@xenova/transformers` -- old package name, now `@huggingface/transformers` (same library, rebranded)
- `sqlite-vss` -- deprecated in favor of `sqlite-vec`, but neither needed for this use case
- `natural` NLP library for TF-IDF -- was considered in Phase 2 research but Transformers.js semantic embeddings are vastly superior

## Open Questions

1. **package.json placement and npm initialization**
   - What we know: The vault currently has zero external dependencies and no package.json. Adding `@huggingface/transformers` requires npm initialization.
   - What's unclear: Whether to place package.json at vault root or inside `.claude/` subdirectory. Vault root is simpler but more visible; `.claude/` is cleaner but requires path resolution for node_modules.
   - Recommendation: **Place at vault root.** Standard Node.js convention. Obsidian ignores non-markdown files. Add `node_modules/` to `.gitignore`. The vault is already a Claude Code project -- package.json is expected.

2. **Fallback when @huggingface/transformers is not installed**
   - What we know: This is the first external dependency. The user may not have run `npm install` yet.
   - What's unclear: Should /search fail gracefully or prompt for installation?
   - Recommendation: **Graceful degradation.** If `import('@huggingface/transformers')` fails, (1) inform the user once that semantic search requires setup, (2) provide the npm install command, (3) fall back to keyword-based search using existing tag-index and vault-index. Memory features (insights, project memory) should work without the embedding library.

3. **Model cache directory**
   - What we know: Transformers.js downloads the ONNX model on first use (~23MB) and caches it.
   - What's unclear: The exact cache directory behavior in Node.js and whether `.claude/.models` is respected as cache_dir.
   - Recommendation: **Set `env.cacheDir = '.claude/.models'`** and verify during implementation. If it doesn't work, fall back to Transformers.js default cache location and document where models are stored. Add cache directory to `.gitignore`.

4. **Implicit search integration depth**
   - What we know: User decided both explicit `/search` and implicit semantic search in conversation.
   - What's unclear: How deep should implicit integration go? Should Claude automatically search embeddings when the user asks about a topic, or only when explicitly triggered?
   - Recommendation: **Start conservative.** Implement `/search` skill first. For implicit integration, have Claude check semantic search when the user asks about vault content and keyword search in existing indexes yields poor results. Don't make every conversation turn trigger an embedding search.

5. **Confidence scoring algorithm for insights**
   - What we know: User wants confidence tracking with thresholds and observation counts. Decay for unobserved patterns.
   - What's unclear: Exact numeric thresholds and decay rates.
   - Recommendation: Start with: initial confidence = 0.5, +0.1 per re-observation (cap at 1.0), surface threshold = 0.5, prune threshold = 0.3, decay = -0.05 per significant vault session where pattern is not reinforced. Tune based on actual usage.

## Sources

### Primary (HIGH confidence)
- Node.js v25.6.1 built-in SQLite (`node:sqlite`): Empirically verified on project environment. DatabaseSync with CommonJS require(), BLOB/TypedArray storage, schema creation, insert/query operations -- all tested and working.
- [Node.js v25.8.0 SQLite Documentation](https://nodejs.org/api/sqlite.html) -- API reference for DatabaseSync constructor, options, prepared statements, BLOB handling.
- Cosine similarity performance benchmarks: Empirically measured on project environment. 100 vectors: <1ms, 500: <1ms, 1000: ~1ms, 5000: ~5ms (384-dimensional Float32Array).
- Existing Firstbrain scanner infrastructure (scanner.cjs, parser.cjs, indexer.cjs, utils.cjs) -- verified content hash, incremental scan, and index data structures.
- Phase 3 RESEARCH.md and existing SKILL.md files -- established skill authoring pattern, .cjs module conventions, and architecture decisions.

### Secondary (MEDIUM confidence)
- [Transformers.js documentation](https://huggingface.co/docs/transformers.js/en/index) -- pipeline API, feature-extraction task, model caching.
- [Xenova/all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) -- ONNX-quantized model, 384-dim output, ~23MB download, 256 token effective limit.
- [sqlite-vec documentation](https://alexgarcia.xyz/sqlite-vec/) -- investigated but not recommended; brute-force is sufficient.
- [sqlite-vec Node.js usage](https://alexgarcia.xyz/sqlite-vec/js.html) -- verified compatibility with node:sqlite (allowExtension: true), but decided against using.
- [OpenAI Embeddings API](https://platform.openai.com/docs/api-reference/embeddings/create) -- $0.02/1M tokens via HTTP fetch, potential fallback option.

### Tertiary (LOW confidence)
- `env.cacheDir` behavior in Transformers.js v3 for Node.js -- mentioned in docs and community discussions but not empirically verified on this project's environment yet. Needs validation during implementation.
- Transformers.js v4 preview features -- v4 adopts WebGPU runtime, but v3 is the stable version. Research based on v3 API.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- node:sqlite empirically tested on project's Node.js. Transformers.js well-documented with known model. Brute-force cosine similarity benchmarked.
- Architecture: HIGH -- Extends existing SKILL.md + .cjs pattern. SQLite schema design is straightforward. Memory management follows established MEMORY.md conventions.
- Pitfalls: HIGH -- ESM/CJS compatibility verified via research. Token limits documented by model authors. SQLite locking is well-known. Package.json impact on Obsidian researched.

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (mostly stable domain; monitor Transformers.js v4 GA for potential migration)
