---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #token-efficiency
  - #summarization
  - #pkm
source: Claude
---

# Zettel -- Kontext-Kompression durch Summaries

## Idee

> Alte Gespräche und Rohdaten werden periodisch in kompakte, semantisch dichte Zusammenfassungen (Summaries) umgewandelt.

## Explanation

Statt den gesamten Verlauf einer Diskussion (viele Token) zu speichern, extrahieren wir nur:
1. **Getroffene Entscheidungen**
2. **Offene Fragen**
3. **Konkrete Fakten**

Dadurch bleibt das System "wissend", ohne das Token-Limit durch redundante Füllwörter zu sprengen.

## Connections

- **Source:** [[Wissens-Zentrale Optimierung]]
- **Related Ideas:** [[Zettel -- Layered Memory Architecture]]
- **Supports:** [[MEMORY.md]]
