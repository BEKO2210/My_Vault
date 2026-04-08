---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #memory
  - #architecture
  - #firstbrain
source: Claude
---

# Zettel -- Layered Memory Architecture

## Idee

> Das Gehirn arbeitet in Schichten: Session Memory (aktuell), Working Memory (kurzfristig), Long-term Memory (langfristig).

## Explanation

Um Token zu sparen, laden wir Daten hierarchisch:
1. **Schicht 1:** Nur der aktuelle Prompt (Session).
2. **Schicht 2:** [[MEMORY.md]] (Working Memory) als kompakte Zusammenfassung aller Projekte.
3. **Schicht 3:** Gezieltes Nachschlagen in [[01 - Projects|Projektnotizen]] (Long-term), nur wenn nötig.

## Connections

- **Source:** [[Wissens-Zentrale Optimierung]]
- **Related Ideas:** [[Zettel -- Kontext-Kompression durch Summaries]]
- **Supports:** [[Zettel -- Das Gehirn als Wissens-Zentrale]]
