# Feature Research

**Domain:** AI-native personal knowledge management (Obsidian vault + Claude Code cognitive layer)
**Researched:** 2026-03-07
**Confidence:** MEDIUM-HIGH (strong competitor evidence, some novel features lack precedent)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist in any AI-enhanced PKM system. Missing these means the product feels broken or incomplete compared to what Obsidian AI plugins, Mem.ai, Reflect, Capacities, and Tana already offer.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Semantic search across vault** | Every AI PKM tool offers this. Smart Connections, Copilot, Reor, Mem, Reflect all have it. Users will not accept keyword-only search in an "AI-native" system. | MEDIUM | Requires embedding generation for all notes, vector similarity search. Can use local models (Transformers.js) or API-based embeddings. Obsidian Smart Connections v4 has proven this works well in Obsidian context. For Claude Code approach: build a JSON index in .claude/ with semantic fingerprints per note, query Claude to do similarity matching. |
| **Auto-suggested links** | Reor auto-links related notes. Smart Connections surfaces related content in sidebar. Mem.ai builds connections automatically. This is the baseline expectation for "AI-native." | MEDIUM | Claude reads note content and suggests wiki-links to existing notes. Not hard for Claude to do — the challenge is doing it at scale (5,000+ notes) without re-reading everything each time. Requires the semantic index. |
| **Chat with your notes (Q&A)** | Smart Connections Smart Chat, Copilot Vault Q&A, Mem's query interface, Reflect's graph-aware AI. Users expect to ask "What do I know about X?" and get a synthesized answer with citations. | MEDIUM | Claude Code already has vault access. The skill is to make this a repeatable slash command (/ask, /synthesize) that gathers relevant notes and produces a cited answer. Retrieval quality depends on the semantic index. |
| **Smart note creation from templates** | Capacities auto-fills object properties. Tana supertags define schemas. Even basic Obsidian templating (Templater plugin) handles variable substitution. Users expect the AI to pick the right template and fill it intelligently. | LOW | The vault already has 12 templates. Claude needs a /create skill that selects the correct template based on content description, fills frontmatter, substitutes variables, and adds initial wiki-links. Straightforward. |
| **Frontmatter and tag management** | Capacities, Tana, and Notion all auto-tag. Obsidian AI plugins like Notemd auto-generate tags. Users expect AI to maintain consistent metadata without manual effort. | LOW | Claude reads Tag Conventions, applies correct tags during creation and maintenance. Auto-tagging on creation is low risk. Retroactive tag cleanup needs the maintenance scan. |
| **Orphan detection and link health** | Obsidian CLI skill already identifies orphaned notes and broken links. Any vault management tool is expected to surface disconnected notes. This is basic graph hygiene. | LOW | Scan all notes for incoming/outgoing links. Notes with zero connections are orphans. Broken links point to non-existent files. Report via /maintain or /health command. |
| **Daily notes workflow** | Obsidian Daily Notes is core. Reflect auto-creates meeting notes. Tana has daily nodes. Every PKM tool supports daily capture as a first-class workflow. | LOW | Already in the vault structure (00 - Inbox/Daily Notes/). Claude needs a /daily skill that creates today's note from template and optionally summarizes yesterday's open items. |
| **Persistent context across sessions** | Every serious Claude Code + Obsidian setup uses CLAUDE.md and memory files. The ballred/obsidian-claude-pkm and naushadzaman Knowledge Vault both implement this. Users expect Claude to "remember" what happened last session. | MEDIUM | Requires a layered memory system: session memory (conversation), working memory (.claude/ files loaded at startup), long-term summary (.claude/ distilled patterns). Already designed in PROJECT.md. The implementation challenge is the compression/distillation logic. |

### Differentiators (Competitive Advantage)

Features that set Firstbrain apart from both Obsidian AI plugins and standalone AI PKM tools. These are not universally expected but create significant value when present. They align with the project's core value: "Claude autonomously maintains, connects, and evolves the knowledge base."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Typed, weighted relationships** | No consumer PKM tool offers typed relationship edges (supports, contradicts, extends, inspired-by, prerequisite-for, depends-on) with weights. Tana has a knowledge graph but with generic edges. Obsidian has plain wiki-links. This is a genuine differentiator that enables reasoning Tana and Reflect cannot do: "find notes that contradict this claim" or "what are the prerequisites for this project?" | HIGH | Requires an AI metadata layer stored in .claude/ (not cluttering markdown). Each relationship needs: source note, target note, relationship type, weight (0-1), confidence, evidence snippet. Claude maintains this as a JSON graph. The markdown notes keep clean wiki-links; the typed graph is Claude's private reasoning layer. This is the hardest feature to build well. |
| **Knowledge decay detection** | No consumer PKM tool actively detects stale knowledge. Enterprise KM tools (Shelf, Aisera) do this, but personal tools do not. Firstbrain detecting "this project hasn't been updated in 90 days," "this resource references a deprecated tool," or "these meeting notes have unresolved action items from 6 months ago" is genuinely novel in the personal PKM space. | MEDIUM | Decay signals: last-modified date vs expected update frequency (projects should update weekly, areas monthly), references to tools/versions that have changed, unresolved tasks past their implied deadlines, notes that used to be frequently linked but have become isolated. Requires periodic scanning via /maintain. |
| **Emergent structure proposals** | Mem.ai auto-organizes but opaquely. No tool lets the user see emerging patterns and choose whether to formalize them. Firstbrain proposing "I've noticed 7 notes about machine learning — should I create a MOC for this?" gives the user agency over structure evolution. This is the "governed evolution" philosophy made tangible. | HIGH | Requires analyzing note clusters (by topic similarity, shared tags, co-linkage patterns) and detecting when a cluster exceeds a threshold for formalization. Claude proposes: new MOCs, new Areas, tag consolidation, folder restructuring. User approves or rejects. The hard part is setting thresholds that avoid noise. |
| **Calm daily briefing system** | Read AI has a "Monday Briefing." Notion agents can summarize workspace state. But no personal PKM tool delivers a calm, executive-style briefing: "3 active projects, 1 stalled. 2 notes added yesterday. Inbox has 5 items needing triage. Suggestion: review the 'Career' area, untouched for 45 days." This is the system being proactively helpful without being noisy. | MEDIUM | The /briefing skill aggregates: active project status, recent changes, inbox count, neglected areas, upcoming review dates, and one suggested action. Output is a concise markdown section (not a wall of text). Depends on: working memory (to know state), decay detection (to flag neglect), inbox awareness. |
| **Inbox triage automation** | Email triage is well-understood (Krista AI, EmailTree). Applying this to PKM inbox is novel. Notes land in 00 - Inbox and Claude classifies them: "This looks like a Resource about Python — suggest moving to 03 - Resources/ with tags #resource #python" with confidence levels. Low-confidence items get proposed; high-confidence items auto-execute. | MEDIUM | Claude reads each inbox note, analyzes content against existing vault structure (templates, folders, tags), and produces a triage recommendation: destination folder, template type, suggested tags, suggested links. The /triage skill processes all inbox items and presents a batch proposal. Auto-execute threshold needs careful tuning. |
| **Cross-note synthesis** | Smart Connections shows related notes. Reflect AI answers questions. But synthesizing across multiple notes into a new artifact ("Write a summary of everything I know about project management based on my notes") with proper citations is rare. Mem.ai approaches this but the output quality varies. Firstbrain doing this well with Claude's reasoning ability is a strong differentiator. | MEDIUM | The /synthesize skill takes a topic, retrieves relevant notes via semantic index, and produces a synthesis note with wiki-link citations to source notes. Could create temporary "synthesis notes" in 03 - Resources/ or display inline. The quality depends entirely on retrieval — getting the right notes is harder than writing the synthesis. |
| **Conflict detection and resolution** | No consumer tool detects that Note A says "use React" while Note B says "avoid React" or that a project is tagged #completed but has open tasks. This is epistemological integrity — the vault being internally consistent. | HIGH | Requires the typed relationship graph (specifically the "contradicts" edge type) plus heuristic checks: status mismatches (completed project with open tasks), date inconsistencies (meeting note dated before project creation), tag conflicts (archived note linked as active resource). Depends on typed relationships being built first. |
| **Evolution governance** | No tool has explicit rules about what can change autonomously vs what requires approval. "Content evolves freely, structure evolves intentionally, system rules remain governed" is a unique design philosophy. Making this explicit and enforceable gives users trust that the AI won't reorganize their vault behind their back. | LOW | Define three zones in the system rules: (1) Content zone — Claude can edit note content, add links, update tags freely; (2) Structure zone — Claude proposes but doesn't execute folder moves, MOC creation, template changes; (3) System zone — changes to CLAUDE.md, templates, conventions require explicit user confirmation. Enforce via skill-level checks. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create real problems. Deliberately NOT building these preserves user trust, system simplicity, and the project's design philosophy.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Automatic note deletion or archiving** | "Clean up my vault automatically" sounds appealing. Enterprise KM tools auto-archive stale content. | Destroys user trust immediately. One wrongly deleted note and the user never trusts the system again. Violates "propose, don't override" philosophy. Even Notion agents don't auto-delete. The cost of a false positive (deleting something valuable) vastly exceeds the cost of a false negative (keeping something stale). | Decay detection flags stale notes. /maintain proposes archival with explanation. User confirms each batch. Never delete — only propose moving to 04 - Archive/. |
| **Real-time sync or collaboration** | Multi-user PKM is trendy (Notion, Tana teams). | Massively increases complexity. Conflict resolution for concurrent edits, real-time presence, permission systems. The vault is single-user by design. Obsidian Sync already handles device sync. Adding collaboration changes the entire architecture. | Stay single-user. Use Obsidian Sync or git for device sync. If collaboration needed, recommend Obsidian Publish for sharing read-only views. |
| **Custom Obsidian JS plugins** | "Build a sidebar panel" or "add a ribbon icon for Claude features" seems natural for Obsidian. | Requires JS plugin development, Obsidian API knowledge, review process for community plugins, maintenance across Obsidian versions. Completely different skill set from Claude Code skills. Breaks the "portable and maintainable" constraint. | Claude Code skills (slash commands) are the interface. They're markdown-based, version-controlled, work across any Claude Code environment. The Obsidian CLI skill (pablo-mano) bridges the gap for vault operations. |
| **Automatic reorganization of existing notes** | "AI should just organize everything for me" — Mem.ai's pitch. | Users have spatial memory of where things are. Moving 50 notes to "better" locations breaks every mental model the user has built. The Obsidian community has repeatedly rejected tools that move files without consent. Opaque reorganization is the #1 trust killer. | Propose changes via /maintain. Show before/after. User approves batch or individual moves. Never move without consent. For new notes, suggest the right location during creation — that's where auto-organization works. |
| **External API integrations** | "Connect to Todoist, Notion, Google Calendar, Slack" — feature requests that never end. | Infinite scope creep. Each integration requires auth, error handling, rate limits, schema mapping, and ongoing maintenance as APIs change. The vault becomes dependent on external services. | Self-contained system. Users paste content into inbox manually or use Obsidian's existing import tools (Readwise, web clipper). Claude triages what lands in inbox. The vault is the single source of truth, not a sync hub. |
| **Full-vault AI re-read on every session** | "Claude should read everything every time for full context." | Impossible at scale. 5,000 notes at average 500 words = 2.5M words. Even with 200K context windows, this exceeds limits and costs a fortune. Performance degrades linearly with vault size. | Layered memory: working memory (compact state summary) loaded at session start. Semantic index for targeted retrieval. Full note reads only when specifically needed. Incremental scanning — only process changed files. |
| **Notification spam and proactive interruptions** | "The AI should alert me about everything important." | Context switching destroys deep work. Push notifications from a PKM tool train users to ignore the system. The "calm intelligence" philosophy explicitly rejects this. | Daily briefing: one consolidated summary per day. User pulls information when ready (via /briefing). No push notifications. Suggestions surface only when the user is already interacting with Claude. |
| **Hallucinated citations or invented connections** | Not explicitly requested, but AI systems frequently generate plausible-sounding but false links between notes. | Destroys epistemic integrity of the knowledge base. If Claude says "Note A relates to Note B" but the connection is hallucinated, the knowledge graph becomes unreliable. Users cannot distinguish real from invented connections. | Every suggested link must cite the specific passage or concept that creates the connection. Confidence scores on all suggestions. Never assert a connection without evidence. Prefer missing a real connection over inventing a false one. |

## Feature Dependencies

```
[Semantic Index / Note Embeddings]
    |
    +--requires--> [Note Scanning / Parsing Engine]
    |
    +--enables--> [Semantic Search]
    +--enables--> [Auto-Suggested Links]
    +--enables--> [Cross-Note Synthesis]
    +--enables--> [Emergent Structure Detection]
    +--enables--> [Inbox Triage (classification)]

[Working Memory System]
    |
    +--requires--> [Note Scanning / Parsing Engine]
    |
    +--enables--> [Persistent Context Across Sessions]
    +--enables--> [Daily Briefing]
    +--enables--> [Knowledge Decay Detection]

[Typed Relationship Graph]
    |
    +--requires--> [Semantic Index]
    +--requires--> [Note Scanning / Parsing Engine]
    |
    +--enables--> [Conflict Detection]
    +--enables--> [Prerequisite Chains]
    +--enables--> [Emergent Structure Detection (enhanced)]

[Smart Note Creation]
    +--requires--> [Template System (already exists)]
    +--enhanced-by--> [Semantic Index (for link suggestions)]

[Daily Notes Workflow]
    +--requires--> [Template System (already exists)]
    +--enhanced-by--> [Working Memory (for open item rollover)]
    +--enhanced-by--> [Daily Briefing]

[Inbox Triage]
    +--requires--> [Note Scanning / Parsing Engine]
    +--requires--> [Semantic Index (for classification)]
    +--enhanced-by--> [Evolution Governance (for auto-execute thresholds)]

[Orphan Detection]
    +--requires--> [Note Scanning / Parsing Engine]
    +--enhanced-by--> [Auto-Suggested Links (to fix orphans)]

[Evolution Governance]
    +--requires--> nothing (policy layer, can be built first)
    +--enables--> [Safe auto-execution for low-risk operations]
    +--enables--> [User trust in autonomous features]
```

### Dependency Notes

- **Everything depends on Note Scanning / Parsing Engine:** This is the foundational layer. Before Claude can do anything intelligent, it needs to read, parse, and index the vault's notes (frontmatter, content, links, tags). This must be built first and must be incremental (not full re-scan) for scale.
- **Semantic Index enables most AI features:** Search, link suggestions, synthesis, triage, and structure detection all need a way to find relevant notes by meaning. This is the second foundational layer after scanning.
- **Working Memory enables proactive features:** Briefings, decay detection, and session persistence all need Claude to "know the vault state" without re-reading everything. Working memory is a compact summary that bootstraps each session.
- **Typed Relationship Graph is the most ambitious dependency:** It depends on both scanning and semantic understanding. It enables the most differentiated features (conflict detection, prerequisite chains) but is also the hardest to build correctly. Can be deferred to a later phase.
- **Evolution Governance should be built early:** It's a policy layer with no technical dependencies. Building it first establishes the trust framework that makes autonomous features safe to deploy.

## MVP Definition

### Launch With (v1)

Minimum viable "AI-native second brain" — what's needed to demonstrate the core value proposition. A user should be able to install this vault and immediately experience Claude as a cognitive layer, not just a chatbot.

- [ ] **English vault content** — All templates, MOCs, guides, system docs rewritten in English. Prerequisite for everything else; the vault must be usable internationally.
- [ ] **Note scanning and parsing engine** — Claude can read and index the vault incrementally. Foundation for all intelligence features. Stored in .claude/ as regenerable JSON.
- [ ] **Smart note creation (/create)** — Claude selects template, fills frontmatter, substitutes variables, suggests initial wiki-links. The first "wow moment" for new users.
- [ ] **Semantic search (/search)** — Ask a question, get relevant notes ranked by meaning not keywords. This is what makes the vault feel intelligent.
- [ ] **Auto-suggested links (/connect)** — Claude suggests links between notes that should be connected. Addresses the core value of discovering connections.
- [ ] **Orphan detection (/health)** — Surface notes with no connections. Basic vault hygiene.
- [ ] **Daily notes workflow (/daily)** — Create today's note, summarize open items from yesterday. Core daily habit support.
- [ ] **Persistent context via working memory** — Claude loads vault state at session start from .claude/ memory files. Makes Claude feel like it "knows" the vault.
- [ ] **Evolution governance rules** — Define the three zones (content/structure/system) and enforce them. Establishes trust from day one.

### Add After Validation (v1.x)

Features to add once the core is working and the scanning/indexing infrastructure is proven reliable.

- [ ] **Inbox triage (/triage)** — Process inbox items with classification and routing suggestions. Add when users are regularly dropping notes in inbox.
- [ ] **Cross-note synthesis (/synthesize)** — Generate topic summaries with citations. Add when the semantic index has proven accurate enough for retrieval.
- [ ] **Daily briefing (/briefing)** — Consolidated vault status summary. Add when working memory is stable and decay signals are reliable.
- [ ] **Knowledge decay detection** — Flag stale projects, outdated references, neglected areas. Add when the scanning engine has enough historical data to detect staleness patterns.
- [ ] **Frontmatter and tag consistency cleanup** — Batch fix inconsistent metadata. Add after tag conventions are well-established and governance rules are in place.

### Future Consideration (v2+)

Features to defer until the core system is mature and well-tested.

- [ ] **Typed relationship graph** — Full typed/weighted edges between notes. Defer because: requires significant design iteration, the right relationship types need to emerge from actual use, and the simpler wiki-link graph provides 80% of the value.
- [ ] **Conflict detection** — Detect contradictions and inconsistencies across notes. Defer because: depends on typed relationships, and the false positive rate will be high without extensive tuning.
- [ ] **Emergent structure proposals** — Propose new MOCs, areas, tag consolidation. Defer because: needs a large enough vault to have meaningful clusters, and premature structure proposals will feel noisy.
- [ ] **Smart template adaptation** — Context-aware template field adjustment. Defer because: the 12 existing templates cover most cases, and adaptation logic is hard to get right without user feedback on what's missing.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| English vault rewrite | HIGH | LOW | P1 |
| Note scanning / parsing engine | HIGH | MEDIUM | P1 |
| Smart note creation (/create) | HIGH | LOW | P1 |
| Semantic search (/search) | HIGH | MEDIUM | P1 |
| Auto-suggested links (/connect) | HIGH | MEDIUM | P1 |
| Persistent context (working memory) | HIGH | MEDIUM | P1 |
| Evolution governance rules | MEDIUM | LOW | P1 |
| Daily notes workflow (/daily) | MEDIUM | LOW | P1 |
| Orphan detection (/health) | MEDIUM | LOW | P1 |
| Inbox triage (/triage) | HIGH | MEDIUM | P2 |
| Cross-note synthesis (/synthesize) | HIGH | MEDIUM | P2 |
| Daily briefing (/briefing) | MEDIUM | MEDIUM | P2 |
| Knowledge decay detection | MEDIUM | MEDIUM | P2 |
| Tag/frontmatter consistency | MEDIUM | LOW | P2 |
| Typed relationship graph | HIGH | HIGH | P3 |
| Conflict detection | MEDIUM | HIGH | P3 |
| Emergent structure proposals | MEDIUM | HIGH | P3 |
| Smart template adaptation | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch — defines the "AI-native" experience
- P2: Should have, add after core is validated — completes the autonomous maintenance promise
- P3: Nice to have, future consideration — advanced intelligence features that need a mature foundation

## Competitor Feature Analysis

| Feature | Obsidian + Smart Connections | Mem.ai | Reflect | Tana | Capacities | Firstbrain (Our Approach) |
|---------|------------------------------|--------|---------|------|------------|---------------------------|
| **Semantic search** | Local embeddings, similarity scores in sidebar | Cloud-based, auto-surfaces relevant notes | Graph-aware AI search across all notes | Knowledge graph queries, multi-hop reasoning | AI chat with contextual awareness | Claude-powered semantic index in .claude/, /search command |
| **Auto-linking** | Shows related notes by similarity, no auto-insert | Automatic connection graph, no user intervention | Backlinks + AI-suggested connections | Supertags create implicit links between typed objects | Object relationships through properties | Claude suggests links with evidence; user confirms structural ones |
| **Knowledge graph** | Basic — similarity-based connections | Mem Graph — automatic, opaque | Backlink graph — first AI to use graph structure for queries | Native knowledge graph with typed supertags | Object graph through typed relationships | Typed, weighted relationship graph (AI metadata layer) |
| **Inbox triage** | None | Auto-organization (opaque) | None | Supertag-based classification | None | Explicit triage workflow with transparency |
| **Knowledge decay** | None | Temporal Context (tracks interaction timing) | None | None | None | Active decay detection with review queues |
| **Daily briefing** | None | None | Calendar integration, meeting prep | Daily nodes | None | Consolidated executive briefing with priorities |
| **Synthesis** | Smart Chat Q&A | Query-based answers from notes | Graph-aware Q&A with citations | AI commands on supertag collections | AI chat about notes | Topic synthesis creating new artifact with citations |
| **Structure proposals** | None | Auto-organization (no user choice) | None | Template store (manual) | None | Governed proposals: Claude suggests, user decides |
| **Conflict detection** | None | None | None | None | None | Contradiction and inconsistency detection (v2) |
| **Memory persistence** | None (plugin state only) | Cloud-based (always available) | Cloud-based (always available) | Cloud-based (always available) | Cloud-based (always available) | Layered local memory in .claude/ (session/working/long-term) |
| **Offline/local** | Yes (local embeddings) | No (cloud-required) | No (cloud-required) | No (cloud-required) | Yes (offline-first) | Yes (vault is local markdown, .claude/ is local JSON) |
| **Open source** | Plugin is open source | No | No | No | No | Fully open source vault template |
| **Vendor lock-in** | Low (Obsidian + plugin) | High (proprietary format) | High (proprietary) | High (proprietary) | Medium (export available) | None (plain markdown, Claude Code is optional layer) |

### Competitive Positioning Summary

Firstbrain's unique position in the market:

1. **Open source + no lock-in:** Unlike Mem, Reflect, Tana, and Capacities, the vault works perfectly without Claude. No proprietary formats. This is unique among AI-native PKM tools.

2. **Transparent AI:** Unlike Mem's opaque auto-organization, every Claude action is visible, explainable, and reversible. The "governed evolution" model has no competitor equivalent.

3. **Typed relationships:** No consumer PKM tool offers semantic relationship types (supports/contradicts/extends). Tana's knowledge graph is the closest but uses generic edges. This enables reasoning no competitor can match.

4. **Knowledge decay:** No personal PKM tool actively monitors and flags stale knowledge. This is an enterprise KM feature brought to personal use.

5. **Calm briefing over notification spam:** The deliberate choice to consolidate information into pull-based briefings rather than push notifications differentiates from tools that try to maximize engagement.

## Sources

### Competitor Products Analyzed
- [Obsidian Smart Connections](https://github.com/brianpetro/obsidian-smart-connections) — GitHub repo, feature documentation (MEDIUM confidence)
- [Mem.ai](https://get.mem.ai/) — Product pages, review sites (MEDIUM confidence)
- [Reflect Notes](https://reflect.app/) — Product pages, review sites (MEDIUM confidence)
- [Tana](https://tana.inc) — Product pages, TechCrunch coverage, feature docs (MEDIUM-HIGH confidence)
- [Capacities](https://capacities.io) — Product pages, roadmap, AI feature docs (MEDIUM confidence)
- [Anytype](https://blog.anytype.io/) — Blog posts, community updates (MEDIUM confidence)
- [Reor](https://github.com/reorproject/reor) — GitHub repo, feature documentation (MEDIUM confidence)
- [Notion AI](https://www.notion.com/releases) — Official release notes (HIGH confidence)

### Existing Obsidian + Claude Code Projects
- [ballred/obsidian-claude-pkm](https://github.com/ballred/obsidian-claude-pkm) — Starter kit with 8 skills, goal tracking, memory system (HIGH confidence — read directly)
- [naushadzaman Knowledge Vault](https://gist.github.com/naushadzaman/164e85ec3557dc70392249e548b423e9) — 8 skills, CLAUDE.md memory, digest workflow (HIGH confidence — read directly)
- [pablo-mano/Obsidian-CLI-skill](https://github.com/pablo-mano/Obsidian-CLI-skill) — 130+ CLI commands for vault operations (HIGH confidence — read directly)
- [kepano/obsidian-skills](https://repovive.com/roadmaps/claude-code/obsidian-claude-code-your-ai-powered-second-brain/obsidian-skills) — Official Obsidian skills for Claude Code (MEDIUM confidence)

### AI Memory and Knowledge Management Research
- [Mem0 research on AI agent memory](https://mem0.ai/research) — Academic paper on long-term memory for AI (MEDIUM confidence)
- [Enterprise knowledge freshness automation](https://cobbai.com/blog/knowledge-freshness-automation) — Content decay detection patterns (MEDIUM confidence)
- [AI trust and anti-patterns](https://medium.com/@inderrsiingh_67158/when-your-users-dont-trust-the-machine-designing-ai-experiences-after-the-hype-crash-d67e1aafefc1) — Dark patterns in AI automation (MEDIUM confidence)

---
*Feature research for: AI-native personal knowledge management (Obsidian + Claude Code)*
*Researched: 2026-03-07*
