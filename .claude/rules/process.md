---
name: process-rule
scope: inbox-processing
---

# Command Processor Rule

## Trigger

When the user types `/process`, or when `/watch` detects new files, scan the Inbox and execute.

## File Detection

Scan `00 - Inbox/` (not Daily Notes subfolder) for files with these markers after optional frontmatter:

| Marker | Mode | What Claude does |
|--------|------|-----------------|
| `PROMPT:` | **Vault mode** | Create vault notes, fill templates, link to MOCs |
| `ACTION:` | **Execution mode** | Execute instructions: code, files, git, shell commands |
| `TASK:` | **Execution mode** | Alias for ACTION: |

## PROMPT: Processing (vault notes)

1. Read the instruction text
2. Create deliverables in correct PARA folders using vault templates
3. Link to MOCs, connect to related notes
4. Log to project CHANGELOG.md + global changelog
5. Archive to `03 - Resources/Prompts/`

## ACTION:/TASK: Processing (execution)

1. Read the instruction text
2. Identify or create the target project:
   - Check `project:` frontmatter field → find existing project note
   - If no project exists → create vault note in `01 - Projects/` + workspace folder
3. Execute the instructions:
   - Create files/folders in `workspace/{project}/`
   - Write code, configs, docs
   - Run shell commands (build, test, install deps)
   - Git operations (init, commit, push)
   - Create GitHub repos if requested
4. Update the project vault note (`## Log` section)
5. Update `.claude/memory/project-{name}.md`
6. Archive the action file to `03 - Resources/Prompts/` with results metadata
7. Log to global changelog

### Action file frontmatter (optional but helpful)

```yaml
---
type: action
project: "[[Project Name]]"
priority: high|medium|low
---

ACTION: Your instructions here.
Multiple lines are fine.
Be as specific or as vague as you want.
```

If `project:` is missing, Claude infers from context or asks.

## Governance

- File creation from PROMPT:/ACTION:/TASK: is **AUTO**
- Code creation in workspace/ is **AUTO**
- Git commit + push is **AUTO** (user authorized via action file)
- File archiving is **AUTO**
- **PROPOSE:** Delete workspace files, force-push, deploy
- **NEVER:** Delete vault notes, expose secrets, spend money
- **NEVER:** Process files without PROMPT:/ACTION:/TASK: markers

## External Content

Files from external AI tools (Gemini, Kimi, etc.) in `00 - Inbox/`:
- With PROMPT:/ACTION:/TASK: → process via `/process`
- Without marker → handle via `/triage`
