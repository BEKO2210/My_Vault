# Firstbrain — AI-Native Second Brain

## What This Is

Firstbrain is an open-source Obsidian vault that evolves from a traditional PARA + Zettelkasten starter kit into an adaptive AI-native second brain. Claude acts as the cognitive layer — maintaining structure, discovering connections, synthesizing knowledge, and proactively surfacing insights — while preserving full Obsidian compatibility. The vault is designed for anyone who wants an intelligent knowledge system that grows smarter over time without requiring manual organization.

## Core Value

Claude autonomously maintains, connects, and evolves the knowledge base so the user can focus on thinking and creating — not filing and organizing.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Full English rewrite of all existing vault content (templates, MOCs, guides, system docs)
- [ ] Tiered semantic understanding engine (Level 1: explicit structure, Level 2: semantic inference, Level 3: relational inference across vault)
- [ ] Persistent layered memory system (session memory, working memory, long-term summary memory, project-specific memory)
- [ ] Knowledge graph with typed, weighted relationships (supports, contradicts, extends, inspired-by, prerequisite-for, depends-on)
- [ ] Markdown-first architecture with regenerable JSON cache (.claude/ directory)
- [ ] Inbox triage automation (classify, suggest routing, auto-tag low-risk, propose moves)
- [ ] Orphan detection and link suggestion engine
- [ ] Knowledge decay detection (stale projects, outdated notes, deprecated references, review queues)
- [ ] Emergent structure proposals (new MOCs, areas, thematic clusters when patterns are strong)
- [ ] Cross-note synthesis capability (thematic summaries, concept overviews, "what the vault knows about X")
- [ ] Calm daily briefing system (priorities, changes, neglected items, suggestions)
- [ ] Conflict resolution system (detect misclassifications, propose corrections, never override silently)
- [ ] Smart template adaptation (context-aware template selection and field adjustment)
- [ ] Scalable architecture designed for 5,000+ notes (incremental scanning, indexing, selective rescans)
- [ ] Claude Code skills as primary implementation vehicle (/briefing, /maintain, /synthesize, /triage, /connect, etc.)
- [ ] Evolution governance system (content evolves freely, structure evolves intentionally, system rules remain governed)

### Out of Scope

- Mobile app or non-Obsidian clients — Obsidian-native only
- Real-time sync or collaboration features — single-user vault
- External API integrations (Notion, Todoist, etc.) — self-contained system
- Custom Obsidian plugins — Claude Code skills only, no JS plugin development
- Automatic deletion or archiving without user review — review-first always

## Context

### Current State
The vault is a well-structured but empty Obsidian starter kit. It has:
- PARA folder hierarchy (00-Inbox through 04-Archive)
- 12 templates (Project, Area, Resource, Tool, Zettel, Person, Decision, Meeting, Code Snippet, Daily Note, Weekly Review, Monthly Review)
- 8 Maps of Content (Projects, Areas, Resources, Tools, People, Code, Meetings, Decisions)
- Full system documentation (Home.md, START HERE.md, Workflow Guide.md, Tag Conventions.md)
- CLAUDE.md with conventions for Claude Code integration
- All content currently in German — scheduled for full English rewrite

### Design Philosophy
- **Markdown-first**: All knowledge lives in plain markdown files. JSON caches are derivative, regenerable, invisible to Obsidian users.
- **AI-native**: Claude is the cognitive layer, not just a chatbot. It understands semantics, tracks relationships, and maintains the vault autonomously.
- **Calm intelligence**: The system is proactive but restrained. Deep reasoning underneath, minimal surface noise. Executive briefing, not notification spam.
- **Governed evolution**: Content flows freely. Structure evolves when patterns are strong and repeated. System rules change only through explicit proposals.
- **Propose, don't override**: Claude suggests, explains, and offers actions. It never silently overrides user intent. Low-risk auto-actions (tags, metadata) are acceptable; structural changes require confirmation.

### Tiered Understanding Model
| Level | What Claude understands | Source |
|-------|------------------------|--------|
| 1 — Explicit | Frontmatter, tags, wiki-links, folder location | Direct file parsing |
| 2 — Semantic | Topics, themes, concepts inferred from note content | Content analysis |
| 3 — Relational | Cross-vault patterns, clusters, contradictions, knowledge gaps | Graph analysis |

### Memory Architecture
| Layer | Persistence | Content | Update frequency |
|-------|------------|---------|-----------------|
| Session memory | Current session only | Active conversation context | Continuous |
| Working memory | .claude/ files | Current priorities, active projects, recent changes | Per session start |
| Long-term summary | .claude/ files | Distilled patterns, recurring themes, organizational insights | Weekly or on significant change |
| Project-specific | .claude/ per-project files | Project state, decisions, blockers, context | Per project interaction |

### Target Audience
Open-source template for anyone who wants an AI-driven second brain. Must work well without Claude (standard Obsidian vault) but becomes significantly more powerful with Claude as the cognitive engine.

## Constraints

- **Obsidian compatibility**: Every feature must preserve full Obsidian compatibility. No note should require Claude to be readable or useful. The vault must work as a standard Obsidian vault for users who don't use Claude Code.
- **Markdown-first**: Source of truth is always markdown + frontmatter. JSON caches in .claude/ are derivative and regenerable. If the cache is deleted, Claude can rebuild it from markdown.
- **No custom plugins**: All AI features are implemented as Claude Code skills, not Obsidian JS plugins. This keeps the system portable and maintainable.
- **Open source**: Everything must be shareable. No hardcoded personal data, API keys, or user-specific configuration in the repository.
- **Scale-ready**: Architecture must handle 5,000+ notes without degrading. Incremental scanning, not full vault re-reads.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full English rewrite | Vault is open-source template for international audience | — Pending |
| Claude Code skills as implementation | Structured, versioned, shareable commands vs. CLAUDE.md instructions alone | — Pending |
| Markdown-first + JSON cache | Obsidian compatibility preserved, cache is regenerable, not a dependency | — Pending |
| Tiered semantic understanding | Balance between intelligence depth and computational cost | — Pending |
| Layered memory architecture | Compressed high-signal memory vs. raw context dumping | — Pending |
| Auto for low-risk, propose for structural | Balance autonomy with user trust — tags/metadata auto, moves/merges proposed | — Pending |
| Typed weighted relationships | Beyond plain wiki-links, but as AI metadata layer not cluttering markdown | — Pending |
| Emergent structure proposals | Claude proposes new MOCs/Areas when patterns are strong, doesn't force them | — Pending |
| Scale-ready from day one | Design for 5,000+ notes even though starting near zero | — Pending |
| Evolution governance | Content evolves freely, structure intentionally, system rules governed | — Pending |

---
*Last updated: 2026-03-07 after initialization*
