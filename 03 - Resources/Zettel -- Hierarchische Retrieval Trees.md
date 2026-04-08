---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #rag
  - #structure
  - #navigation
source: Research
---

# Zettel -- Hierarchische Retrieval Trees

## Idee

> Eine Navigations-Struktur für Wissensdatenbanken (RAG), die zwischen Überblick und Detail unterscheidet.

## Explanation

Statt einer flachen Liste von Dokumenten (Standard-Suche) wird ein Baum aufgebaut:
1. **Wurzel-Knoten:** Grobe Zusammenfassung des Bereichs.
2. **Unter-Knoten:** Zusammenfassungen einzelner Themen.
3. **Blatt-Knoten:** Der eigentliche Volltext.

Das Modell kann im Baum "zoomen". Es beginnt bei der Übersicht (Summary) und fragt nur dann tiefere Ebenen an, wenn mehr Detail-Wissen nötig ist.

## Connections

- **Source:** [[Hierarchische MOC-Strukturen für LLMs]]
- **Related Ideas:** [[Zettel -- Map-Reduce und Rekursive Summarization]]
- **Supports:** [[Wissens-Zentrale Optimierung]]
