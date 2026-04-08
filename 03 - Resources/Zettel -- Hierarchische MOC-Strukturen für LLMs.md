---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #pkm
  - #moc
  - #structure
source: Claude
---

# Zettel -- Hierarchische MOC-Strukturen für LLMs

## Idee

> Maps of Content (MOCs) dienen als "Inhaltsverzeichnisse" für die KI, um gezielt relevante Informationen zu finden.

## Explanation

Statt alle Notizen auf einmal einzulesen, navigiert das System über MOCs:
1. **[[Atlas MOC]]** -> Einstiegspunkt.
2. **Themen-MOCs** (z.B. [[Projects MOC]]) -> Navigation zum Fachbereich.
3. **Konkrete Notiz** -> Nur diese wird geladen.

Dies minimiert den "Noise" (irrelevante Daten) und spart massiv Token.

## Connections

- **Source:** [[06 - Atlas/MOCs/Areas MOC.md]]
- **Related Ideas:** [[Zettel -- Layered Memory Architecture]]
- **Supports:** [[Wissens-Zentrale Optimierung]]
