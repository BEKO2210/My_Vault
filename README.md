# Firstbrain Elite 🧠

**Firstbrain** is an AI-Native Second Brain and Execution Engine built on top of Obsidian and Claude Code. It transforms your note-taking vault into an active, intelligent terminal capable of creating, organizing, reasoning, and executing code autonomously.

## 🚀 Features

- **TUI Dashboard (Firstbrain Elite)**: A high-end, responsive terminal interface providing live stats, quick actions, and easy access to the AI.
- **Dual-Mode Operation**:
  - **Vault Mode**: Automates knowledge organization, tagging, linking, and MOC (Map of Content) management.
  - **Execution Mode**: Translates your notes and prompts into actual code and executes it right inside your workspace.
- **Layered Memory Architecture**: Persists context across sessions using intelligent indexing, preferences, and long-term insight extraction.
- **Semantic Search & Graph Engine**: Built-in SQLite-backed vector embeddings (`@huggingface/transformers`) and graph analysis to discover connections between your notes.
- **Automated Inbox Processing**: Watch your inbox for prompts, commands, and actionable tasks, and let Firstbrain automatically generate workflows and code.

## 📦 Installation & Setup

1. **Prerequisites**:
   - [Node.js](https://nodejs.org/) v22.5.0 or higher.
   - [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (`npm install -g @anthropic-ai/claude-code`).
   - An API key for Claude.

2. **Clone the Vault**:
   ```bash
   git clone https://github.com/BEKO2210/Firstbrain.git
   cd Firstbrain
   npm install
   ```

3. **Launch the Dashboard**:
   Simply double-click `start.bat` (Windows) or run `npm run scan` and use your standard terminal. The script will automatically open the **Firstbrain Elite Dashboard**, providing an interactive UI.

## ⚙️ Commands

When inside the Claude Code interface, the following native skills are available:
- `/scan` – Incrementally scan your vault and rebuild JSON indexes and vector embeddings.
- `/briefing` – Generate a daily summary of your vault.
- `/create` – Create a new formatted note based on templates.
- `/daily` – Create or retrieve today's daily note.
- `/process` – Process all `PROMPT:` and `ACTION:` files in your Inbox.

## 🛡️ Governance & Security

Firstbrain operates with strict, explicit boundaries outlined in `.claude/rules/governance.md`. 
It can autonomously fix metadata and structure, but will **always propose** before destructive changes, new folders, or system configurations.

## 🤝 Contribution
Contributions, issues, and feature requests are welcome. Make sure to update the semantic embeddings and indexes before submitting a PR.

---
*Firstbrain Elite – Neural Knowledge Interface*