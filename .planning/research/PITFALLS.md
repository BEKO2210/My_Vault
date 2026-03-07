# Pitfalls Research

**Domain:** AI-native personal knowledge management (Obsidian vault with Claude Code cognitive layer)
**Researched:** 2026-03-07
**Confidence:** HIGH (domain-specific pitfalls well-documented across multiple sources; Claude Code session limitations confirmed by official docs and community)

## Critical Pitfalls

### Pitfall 1: Silent Over-Automation Destroys User Trust

**What goes wrong:**
Claude autonomously modifies notes -- moving files between folders, rewriting frontmatter, adding/removing tags, inserting wiki-links -- without the user understanding what changed or why. The user opens their vault and finds notes in unexpected places, connections they did not make, or metadata they do not recognize. Trust collapses quickly: once a user suspects the AI is "doing things behind their back," they stop using AI features entirely, even the helpful ones.

**Why it happens:**
The design philosophy says "Claude autonomously maintains the vault." Developers interpret "autonomous" as "do everything silently." Low-risk actions (tagging) blur into high-risk actions (moving, merging, restructuring) without clear boundaries. There is no audit trail, so users cannot see what changed or revert it. The PROJECT.md explicitly distinguishes "auto for low-risk, propose for structural" but implementing this boundary requires discipline -- the temptation is always to automate more.

**How to avoid:**
- Define an explicit action classification system with three tiers: AUTO (tags, metadata timestamps, frontmatter normalization), PROPOSE (file moves, link additions, MOC updates, structural changes), and NEVER (deleting notes, merging content, overriding user-set values).
- Every AUTO action must be logged in a `.claude/changelog.md` with timestamp, file path, and what changed.
- Every PROPOSE action must produce a visible suggestion the user can accept or reject -- never silently execute.
- Build the changelog system BEFORE building any automation. If you cannot log it, you cannot automate it.

**Warning signs:**
- Users report "I didn't do that" moments when reviewing their vault.
- Frontmatter values or tags change without corresponding user action.
- Notes appear in folders the user did not move them to.
- The `.claude/changelog.md` is empty or does not exist while automation is active.

**Phase to address:**
Phase 1 (Foundation). The action classification and changelog system must be the very first thing built before ANY automation ships. This is a trust infrastructure prerequisite.

---

### Pitfall 2: Cache-Markdown Drift (JSON State Diverges from Source of Truth)

**What goes wrong:**
The `.claude/` directory contains JSON caches (knowledge graph, memory state, relationship maps) that are derived from markdown files. Over time, these caches drift from reality: notes get edited outside of Claude sessions, files are renamed in Obsidian, frontmatter is updated manually, or notes are deleted. The JSON cache still references old filenames, stale tags, or relationships that no longer exist. Claude then operates on phantom data -- suggesting connections to deleted notes, referencing outdated project states, or missing new content entirely.

**Why it happens:**
The markdown files are the source of truth, but the JSON cache is what Claude actually reads at session start (for performance). If the cache is not validated against the filesystem on every session start, it silently becomes wrong. Users do not know the cache exists, so they never think to regenerate it. Partial regeneration is harder than full regeneration, and full regeneration is too slow at scale. The PROJECT.md says "JSON caches are derivative and regenerable" but does not specify WHEN they get regenerated.

**How to avoid:**
- Implement a cache validation step that runs at the start of every Claude session: compare file modification timestamps against the cache's last-built timestamp, and flag stale entries.
- Design the cache format to be incrementally updatable: store per-file hashes so only changed files trigger re-processing.
- Never read from cache without a staleness check. If the cache is older than the newest file modification, at minimum do a quick diff scan.
- Include a `/rebuild-cache` skill that wipes and regenerates from scratch as an escape valve.
- Store the cache generation timestamp and source file count in the cache header so drift is detectable.

**Warning signs:**
- Claude references notes that no longer exist or have been renamed.
- Claude suggests connections that do not match current note content.
- The knowledge graph shows relationships to deleted or archived notes.
- Newly created notes do not appear in Claude's suggestions until a manual rebuild.

**Phase to address:**
Phase 2 (Memory/Cache Architecture). Must be solved before any feature that reads cached state. The incremental validation protocol is a prerequisite for the knowledge graph, memory system, and every maintenance skill.

---

### Pitfall 3: Context Window Exhaustion Causes Catastrophic Knowledge Loss Mid-Session

**What goes wrong:**
Claude Code has a ~200K token context window. For a vault with 1,000+ notes, loading the knowledge graph, memory state, and even a subset of notes can consume 50-80% of the context before the user asks their first question. During long sessions, context compaction fires automatically, discarding early conversation history including critical architectural decisions, file paths, and relationship context. Claude then makes contradictory changes or "forgets" instructions given earlier in the same session.

**Why it happens:**
Developers design the system assuming the full vault context is available. They load everything at session start ("read the whole knowledge graph"), then wonder why Claude runs out of space. Context compaction (documented in Claude Code official docs) preserves recent messages but drops earlier ones. There is no mechanism to mark certain context as "protected" -- it all gets equal treatment during compaction. The problem compounds: the more sophisticated the AI features, the more context they consume, the less room for actual user interaction.

**How to avoid:**
- Design every skill to be context-minimal: load only what is needed for the current task, not the entire vault state.
- Create a tiered loading strategy: (1) always load a compact "vault summary" (~2K tokens max) with key statistics and active projects, (2) load topic-specific context on demand, (3) never load full note content unless explicitly working on that note.
- Use the CLAUDE.md and `.claude/` memory files as compressed, high-signal context rather than raw data dumps.
- Set up explicit session checkpointing: before context gets heavy, write a session state file that can be read if compaction occurs.
- Target a "context budget" of <30% for system context (memory + cache + instructions), leaving 70%+ for actual user work.

**Warning signs:**
- Sessions become sluggish or Claude starts giving shorter, less detailed responses.
- Claude contradicts instructions given earlier in the same session.
- The `/compact` command fires frequently during normal work.
- Skills that worked with 100 notes fail with 500 notes.

**Phase to address:**
Phase 1 (Foundation) for the context budget design. Phase 2 (Memory Architecture) for the tiered loading strategy. Every subsequent phase must respect the context budget as a hard constraint.

---

### Pitfall 4: Obsidian Compatibility Breaks (Graph View, Search, and Plugin Conflicts)

**What goes wrong:**
AI features that modify the vault in ways incompatible with Obsidian's expectations break core user experiences. Examples: (1) JSON files in non-hidden directories appear in Obsidian's search results and graph view, cluttering the user's workspace. (2) Frontmatter modifications that use non-standard YAML (nested objects, arrays of objects, custom types) break Obsidian's Properties view and Dataview queries. (3) Wiki-links inserted by Claude reference notes that do not exist yet, creating "ghost nodes" in the graph view. (4) File operations that do not update Obsidian's link resolution (renaming a file without updating all backlinks) break the link graph.

**Why it happens:**
Claude operates on files as a text editor -- it does not go through Obsidian's API. Obsidian has specific expectations: wiki-links must use shortest-path format (configured in app.json: `"newLinkFormat": "shortest"`), frontmatter must use flat key-value pairs for Properties compatibility, and the `alwaysUpdateLinks` setting means Obsidian auto-updates links on rename -- but only when renamed THROUGH Obsidian, not via filesystem operations. The `.claude/` directory is hidden from Obsidian (dot-prefix means Obsidian ignores it), but any JSON or metadata files placed in visible directories will pollute the user experience.

**How to avoid:**
- ALL AI metadata (caches, knowledge graph, memory state) must live in `.claude/` or another dot-prefixed directory. Zero exceptions.
- Never create non-markdown files in user-visible directories.
- Frontmatter modifications must use only flat key-value pairs and arrays of strings -- nothing Obsidian's Properties panel cannot render.
- Wiki-links must always use the shortest-path format matching the vault's `newLinkFormat` setting.
- When creating wiki-links to notes that do not exist yet, explicitly note this is a "suggested link" in the proposal, not an auto-inserted one.
- Test every vault modification against Obsidian's graph view, search, backlinks panel, and Dataview queries.
- File renames must be done through Obsidian or must manually update all backlinks across the vault.

**Warning signs:**
- JSON files appear in Obsidian's file explorer or search results.
- Graph view shows unexpected nodes (cache files, metadata files).
- Properties panel shows errors or "invalid property" warnings.
- Dataview queries return unexpected results or errors after Claude modifications.
- Broken links appear in the backlinks panel.

**Phase to address:**
Phase 1 (Foundation). Obsidian compatibility is a hard constraint, not a feature. Every phase must include an "Obsidian compatibility check" in its definition of done. The first phase should establish a compatibility test checklist.

---

### Pitfall 5: Semantic Analysis Produces Noisy, Wrong Connections

**What goes wrong:**
The tiered understanding model (Level 2: semantic inference, Level 3: relational inference) generates connections between notes based on superficial textual similarity rather than genuine conceptual relationships. A note about "Python programming" gets linked to a note about "Monty Python" because they share a keyword. A zettel about "mental models" gets connected to a meeting note that casually mentions "model" in a different context. The knowledge graph fills with low-quality connections that make it harder, not easier, to find genuinely related content. Users learn to ignore AI suggestions, defeating the purpose.

**Why it happens:**
LLMs perform semantic analysis at the token/embedding level, which captures surface similarity but not domain-specific conceptual relationships. Without confidence thresholds, every vague similarity becomes a suggested connection. The system lacks feedback loops -- there is no way for users to say "this connection is wrong" and have the system learn from it. Early in the vault's life, with few notes, every connection seems plausible. As the vault grows, noise scales faster than signal.

**How to avoid:**
- Implement confidence scores for every suggested connection. Only surface connections above a configurable threshold (start conservative at 0.8+).
- Use typed relationships (the PROJECT.md already specifies: supports, contradicts, extends, inspired-by, prerequisite-for, depends-on) and require the system to justify WHY a relationship has a specific type, not just that it exists.
- Build explicit feedback: when a user dismisses a suggestion, log it as a negative signal. Accumulate negative signals to suppress similar suggestions.
- Start with Level 1 (explicit structure) connections only. Level 2 and Level 3 should be gated behind user opt-in and presented as suggestions, never auto-applied.
- Prefer precision over recall: 5 correct connections are worth more than 50 noisy ones.

**Warning signs:**
- Users consistently ignore or dismiss connection suggestions.
- The knowledge graph becomes a "hairball" where everything connects to everything.
- Connection suggestions include obviously wrong relationships (topic mismatch).
- The number of suggested connections per note exceeds 10-15 (likely noise).

**Phase to address:**
Phase 3 (Semantic Engine). This is an inherently difficult problem. Start with the simplest version (Level 1: explicit wiki-links and tags only) and add semantic inference incrementally. Each tier of understanding should be a separate phase with its own quality gate.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Loading full vault into context at session start | Simple implementation, "Claude knows everything" | Context exhaustion at 500+ notes, no room for user interaction | Never -- design for selective loading from day one |
| Storing relationship metadata as inline Dataview fields | Visible in Obsidian, queryable with Dataview | Clutters note content, conflicts with user edits, breaks clean markdown | Never -- use `.claude/` JSON or frontmatter properties only |
| Single monolithic JSON cache file | Easy to read/write, one file to manage | Grows unboundedly, slow to parse at scale, atomic updates impossible | Only in prototype (<100 notes); split to per-directory indexes before Phase 2 |
| Hardcoding relationship types | Quick to implement initial version | Cannot adapt to user's domain, new types require code changes | MVP only -- make types configurable in Phase 2 |
| Skipping the changelog/audit system | Ship features faster | Trust erosion when users discover unexplained changes, no debugging trail | Never -- changelog is infrastructure, not a feature |
| Using absolute file paths in cache | Simpler path resolution | Breaks when vault is moved, synced, or cloned to another machine | Never -- always use vault-relative paths |

## Integration Gotchas

Common mistakes when connecting Claude Code to the Obsidian vault ecosystem.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Obsidian Templates | Claude reads templates and treats `{{date}}`, `{{title}}` as literal text instead of variables | Detect template variable patterns and substitute with actual values before writing |
| Obsidian Properties (YAML) | Using nested YAML objects or non-string arrays that Obsidian's Properties panel cannot parse | Stick to flat key-value pairs; arrays must be arrays of strings |
| Dataview Queries | Adding frontmatter fields with spaces or capitals that Dataview sanitizes differently | Use lowercase, hyphenated field names (e.g., `project-area` not `Project Area`) |
| Wiki-Link Format | Using full path `[[01 - Projects/My Project]]` instead of shortest path `[[My Project]]` | Read `app.json` `newLinkFormat` setting and match it; this vault uses "shortest" |
| Daily Notes | Creating daily notes in the wrong folder or with wrong naming format | Check `.obsidian/daily-notes.json` for folder and format configuration |
| Git Version Control | Committing `.claude/` cache files that change every session, creating noisy diffs | Add volatile cache files to `.gitignore`; only commit stable config and memory files |
| File Renaming | Renaming files via filesystem without updating wiki-links throughout the vault | Either rename through Obsidian or implement a backlink-updating rename function |

## Performance Traps

Patterns that work at small scale but fail as the vault grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Full vault scan on every session start | Session init takes 30+ seconds, context window fills with file listing | Incremental scanning: track file modification timestamps, only process changed files | 500+ notes |
| Single JSON knowledge graph file | Slow parse time, memory spikes, cannot partially load | Split into per-directory index files with a root manifest | 1,000+ notes, or when JSON exceeds 1MB |
| Loading all note content for semantic analysis | Context window exhaustion, analysis becomes superficial due to truncation | Analyze notes individually or in small batches, store results in cache | 200+ notes (context limit) |
| Obsidian graph view with AI metadata nodes | Graph becomes unusable, rendering lag, visual noise | All AI metadata in `.claude/` (hidden from Obsidian); never create visible metadata files | 100+ AI-generated metadata entries |
| Unbounded relationship storage | Knowledge graph grows O(n^2) with note count | Cap relationships per note (e.g., max 20); prune low-confidence connections periodically | 500+ notes with semantic analysis active |
| Full-text search across all notes for every query | Slow response time, high token consumption | Pre-build keyword/topic indexes; search indexes, not raw files | 300+ notes |

## Security Mistakes

Domain-specific security issues for an open-source AI-augmented vault.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Storing API keys or personal tokens in `.claude/` config files that get committed to the public repo | Credential exposure to anyone who clones the vault | Use environment variables for secrets; `.claude/settings.local.json` must be in `.gitignore`; add pre-commit hook to scan for secrets |
| Including personal note content in example files or documentation | Privacy leak -- user's actual notes become public via GitHub | All example content must be synthetic/placeholder; document this convention explicitly |
| Claude skills reading arbitrary files outside the vault directory | Potential information disclosure if vault is in a sensitive directory tree | Skills should validate all file paths are within the vault root; reject paths with `..` traversal |
| Memory/summary files containing sensitive personal information getting committed | Personal data exposed in public repo | Memory files (`.claude/memory/`) should be in `.gitignore` by default; provide a `.gitignore` template that covers all user-specific state |
| Default CLAUDE.md containing personal workflow instructions that identify the user | Doxxing risk in an open-source project | CLAUDE.md should contain only project-level conventions; personal instructions go in `.claude/settings.local.json` or user-level config |

## UX Pitfalls

Common user experience mistakes in AI-native knowledge management.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| AI suggestions interrupt the writing flow with pop-ups or inline insertions | Users feel surveilled and cannot think clearly; "calm intelligence" violated | Batch suggestions into a daily briefing or on-demand `/connect` skill; never interrupt active editing |
| Every note gets 15+ connection suggestions | Information overload; user stops reading suggestions | Cap at 3-5 highest-confidence suggestions per note; quality over quantity |
| Automated categorization that disagrees with user's mental model | User feels the AI "doesn't get" their system; trust erodes | AI proposes categories but ALWAYS defers to user's explicit placement; never auto-move |
| Complex commands required to use AI features (`/maintain --scope=orphans --threshold=0.7 --dry-run`) | Only power users can use the system; violates "open-source template for anyone" goal | Simple defaults (`/maintain` does the right thing); advanced flags optional |
| AI-generated content indistinguishable from user-written content | User cannot tell what they wrote vs. what AI wrote; ownership confusion | Prefix AI contributions with a marker (e.g., `> [AI suggestion]` blockquote) or log them in a separate section |
| The system requires Claude Code to function at all | Non-Claude users get a broken, confusing vault | Every feature must degrade gracefully: vault is fully usable without Claude, AI features are additive |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Knowledge Graph:** Often missing cache invalidation -- verify that renaming a note updates the graph within one session
- [ ] **Inbox Triage:** Often missing the "undo" path -- verify users can reject a triage suggestion and the note stays in inbox unchanged
- [ ] **Orphan Detection:** Often missing template files as false positives -- verify templates in `05 - Templates/` are excluded from orphan analysis
- [ ] **Daily Briefing:** Often missing "nothing to report" handling -- verify it produces useful output even when the vault has not changed
- [ ] **Memory System:** Often missing session-to-session continuity test -- verify memory persists correctly across 3+ separate Claude sessions
- [ ] **Link Suggestions:** Often missing duplicate detection -- verify it does not suggest a link that already exists in the note
- [ ] **MOC Auto-Update:** Often missing format preservation -- verify auto-updates do not break existing MOC formatting, Dataview queries, or user-added content
- [ ] **Tag Normalization:** Often missing case sensitivity handling -- verify `#Project` and `#project` are treated as the same tag
- [ ] **Vault Statistics:** Often missing the `.claude/` directory exclusion -- verify statistics do not count cache files as "notes"
- [ ] **English Rewrite:** Often missing wiki-link updates -- verify that translating note TITLES also updates all wiki-links pointing to the old German titles

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Cache-Markdown drift | LOW | Delete `.claude/` cache directory and run `/rebuild-cache`; by design, all caches are regenerable from markdown source |
| Silent over-automation damage | MEDIUM | Use git history to identify AI changes; revert specific files; tighten action classification rules; review changelog |
| Context window exhaustion mid-session | LOW | End session, start new one; critical state should already be in `.claude/` memory files; redesign the skill to use less context |
| Broken Obsidian compatibility | MEDIUM | Identify the offending files/frontmatter; fix or remove non-standard content; run Obsidian's "reload vault" command; test graph view |
| Noisy semantic connections | LOW | Clear the relationship cache; tighten confidence thresholds; rebuild with stricter criteria; disable Level 2/3 analysis temporarily |
| Trust erosion from wrong suggestions | HIGH | Cannot easily recover trust; requires visible improvements, explicit user control options, and a period of conservative (less autonomous) operation |
| Security leak (personal data in public repo) | HIGH | Immediately remove from git history (`git filter-branch` or BFG); rotate any exposed credentials; update `.gitignore`; notify affected users |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Silent over-automation | Phase 1: Foundation | Changelog exists and logs every automated action; action classification documented |
| Cache-Markdown drift | Phase 2: Memory/Cache | Cache validation runs on session start; `/rebuild-cache` works; incremental updates tested |
| Context window exhaustion | Phase 1-2: Foundation + Memory | Context budget documented (<30% system); tested with 500+ note vault; no compaction during normal use |
| Obsidian compatibility breaks | Every Phase (continuous) | Obsidian compatibility checklist in every phase's definition of done; graph view, search, Properties tested |
| Noisy semantic connections | Phase 3: Semantic Engine | Precision metrics tracked; user feedback loop exists; confidence threshold configurable |
| Open-source template fragility | Phase 1: Foundation | Vault works with zero `.claude/` files; tested on fresh clone by non-creator; no hardcoded paths |
| Feature creep in AI capabilities | All Phases (governance) | Each feature has a clear user problem it solves; features can be disabled individually; complexity budget enforced |
| Knowledge graph hairball | Phase 3-4: Graph + Maintenance | Max relationships per note enforced; graph visualization remains usable at 1,000 notes; pruning exists |
| Memory system knowledge drift | Phase 2: Memory Architecture | Memory accuracy tested across 5+ sessions; terms do not drift; decisions do not resurface as open questions |
| Performance degradation at scale | Phase 2+: Architecture | Load-tested with 5,000 note synthetic vault; session init under 10 seconds; no full vault scans |

## Sources

- [Building at the Edges of LLM Tooling: Lessons from a Personal Knowledge Management System](https://earezki.com/ai-news/2026-02-16-what-happens-when-you-try-to-build-something-real-with-llms/) -- MEDIUM confidence; first-hand account of LLM knowledge drift, term shifting, and sustained project failure modes
- [Claude Code Session Persistence Feature Request](https://github.com/anthropics/claude-code/issues/18417) -- HIGH confidence; official GitHub issue documenting session persistence limitations
- [Claude Code Forgets Everything Between Sessions](https://dev.to/hw20200214/claude-code-forgets-everything-between-sessions-i-tested-5-fixes-199p) -- MEDIUM confidence; practical workarounds tested by community
- [How Claude Code Works - Official Docs](https://code.claude.com/docs/en/how-claude-code-works) -- HIGH confidence; official documentation on context compaction behavior
- [Claude Code Context Buffer Management](https://claudefa.st/blog/guide/mechanics/context-buffer-management) -- MEDIUM confidence; detailed analysis of the 33K-45K token buffer problem
- [Obsidian Forum: Exclude Files from Indexers](https://forum.obsidian.md/t/ignore-exclude-completely-files-or-a-folder-from-all-obsidian-indexers-and-parsers/52025) -- HIGH confidence; official forum confirming dot-prefix directory exclusion behavior
- [Obsidian Forum: Large Vault Performance](https://forum.obsidian.md/t/terabyte-size-million-notes-vaults-how-scalable-is-obsidian/66674) -- HIGH confidence; community reports on Obsidian performance limits
- [Obsidian Graph View at Scale](https://wasi0013.com/2025/09/22/data-visualization-challenge-the-struggle-to-visualize-thousands-of-zettelkasten-notes-and-how-i-solved-it/) -- MEDIUM confidence; practical experience with graph visualization at 6,000+ notes
- [How to Beat AI Feature Creep](https://builtin.com/articles/beat-ai-feature-creep) -- MEDIUM confidence; general framework but directly applicable to AI-native products
- [Auto-Tagging: How AI Tags Improve Content Management](https://kontent.ai/blog/ai-based-auto-tagging-of-content-what-you-need-to-know/) -- MEDIUM confidence; precision/recall tradeoffs in automated tagging
- [Obsidian App Configuration](C:/Users/belki/Desktop/Firstbrain-main/.obsidian/app.json) -- HIGH confidence; direct reading of vault configuration confirming shortest-path link format
- [81% of Consumers Fear AI Data Access](https://ppc.land/81-of-consumers-fear-ai-data-access-but-daily-use-keeps-climbing/) -- MEDIUM confidence; quantifies user trust concerns with AI automation

---
*Pitfalls research for: AI-native personal knowledge management (Firstbrain)*
*Researched: 2026-03-07*
