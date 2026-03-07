# Firstbrain — Obsidian Starter Vault

A preconfigured Obsidian vault for anyone who wants their notes, projects, and ideas in one place at last. No more chaos, no more forgotten scraps — just a system that grows with you.

## Why?

I spent years with notes scattered across different apps. Google Docs here, Apple Notes there, Slack messages to myself, and somewhere a text file named "IMPORTANT". Eventually enough was enough. I wanted **one** system that covers everything — and I built it.

This is the result. It is based on three proven methods that I combined to work for everyday use:

- **PARA** — Four folders instead of twenty: Projects, Areas, Resources, Archive. Done.
- **Zettelkasten** — Write down every idea in your own words and link it to other ideas. Sounds simple, works surprisingly well.
- **Maps of Content** — Overview pages instead of endlessly nested folders.

## What Is Included?

```
00 - Inbox/          Everything new goes here first
01 - Projects/       Projects with a start and end
02 - Areas/          Life areas (career, family, hobbies...)
03 - Resources/      Knowledge: books, tools, ideas, contacts
04 - Archive/        Completed and stored away
05 - Templates/      12 templates for different note types
06 - Atlas/MOCs/     8 overview pages for navigation
07 - Extras/         Images and attachments
```

Plus: preconfigured Obsidian settings (graph colors, Daily Notes, attachment folder) and a dashboard as your home page.

## Getting Started

**1.** Clone the repo or download as ZIP:
```bash
git clone https://github.com/BEKO2210/Firstbrain.git
```

**2.** Open as a vault in Obsidian ("Open folder as vault").

**3.** Install the Community Plugin **Dataview** (Settings → Community Plugins → Browse). Without Dataview, the automatic lists on the MOC pages will not work.

**4.** Open `Home.md`. From there you can reach everything — including one-click links for creating new notes.

For a detailed guide, open `START HERE.md` in the vault.

## Templates

There are 12 templates you can insert via Ctrl+Shift+T:

| Template | Purpose |
|----------|---------|
| Project | Active projects with tasks and deadlines |
| Area | Life areas and responsibilities |
| Resource | Books, courses, articles |
| Tool | Software and services |
| Zettel | Personal thoughts and ideas (atomic) |
| Decision | Decisions with pros and cons |
| Person | Contacts and network |
| Meeting | Meeting notes |
| Code Snippet | Code snippets with context |
| Daily Note | Daily notes |
| Weekly Review | Weekly retrospective |
| Monthly Review | Monthly retrospective |

Each template includes correct frontmatter, a clean structure, and a Connections section for wiki-links.

## Navigating the Vault

`Home.md` is your starting point. There you will find:

- **One-click creation** — A table with links for instantly creating new notes
- **Active projects** — Automatic list of all ongoing projects
- **Open tasks** — All unfinished tasks at a glance
- **Recent changes** — What was last edited?

The 8 MOCs (Maps of Content) provide overview by topic: Projects, Areas, Resources, Tools, Contacts, Code, Meetings, Decisions.

## Claude Code

The vault includes a `CLAUDE.md` that Claude Code reads automatically on startup. This gives it knowledge of the folder structure, all templates, and the conventions. Simply start `claude` in the vault folder and say things like:

- *"Create a new project: Kitchen renovation"*
- *"What are my open tasks?"*
- *"Write a zettel about idea XY"*

Works just as well without Claude Code — it is a normal Obsidian vault.

## Recommended Plugins

| Plugin | Why | Required? |
|--------|-----|-----------|
| [Dataview](https://github.com/blacksmithgu/obsidian-dataview) | Automatic lists and tables | Yes |
| [Templater](https://github.com/SilentVoid13/Templater) | Advanced template variables | No |
| [Calendar](https://github.com/liamcain/obsidian-calendar-plugin) | Calendar for Daily Notes | No |

## Contributing

Ideas, bugs, or new templates? Gladly — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — Take it, use it, make it yours.

---

[![Star History Chart](https://api.star-history.com/svg?repos=BEKO2210/Firstbrain&type=Date)](https://star-history.com/#BEKO2210/Firstbrain&Date)
