---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #summarization
  - #algorithms
  - #long-context
source: Research
---

# Zettel -- Map-Reduce und Rekursive Summarization

## Idee

> Lange Dokumente werden in "Chunks" zerlegt, einzeln zusammengefasst und hierarchisch wieder zusammengeführt.

## Explanation

Dieses Verfahren ist der Goldstandard für Dokumente, die das Kontext-Fenster eines LLMs sprengen (z.B. ganze Bücher).
- **Map:** Das Dokument wird in kleine Teile (Chunks) unterteilt. Jeder Teil wird für sich zusammengefasst.
- **Reduce:** Die Zusammenfassungen der Teile werden kombiniert und erneut zusammengefasst, bis ein kompaktes Endergebnis vorliegt.
- **Recursive:** Der Prozess wird über mehrere Ebenen (Absatz -> Kapitel -> Buch) wiederholt.

## Connections

- **Source:** [[Resource -- Wissens-Kompression für LLMs]]
- **Related Ideas:** [[Zettel -- Kontext-Kompression durch Summaries]]
- **Project:** [[Wissens-Zentrale Optimierung]]
