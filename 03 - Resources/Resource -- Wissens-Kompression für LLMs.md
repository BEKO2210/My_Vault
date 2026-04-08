---
type: resource
created: 2026-04-08
updated: 2026-04-08
tags:
  - #research
  - #llm
  - #token-efficiency
  - #summarization
source: Google Search
---

# Resource -- Wissens-Kompression für LLMs

## Summary

Diese Recherche fasst aktuelle Strategien zusammen, um große Mengen an Information für Large Language Models (LLMs) handhabbar zu machen, ohne das Kontext-Limit zu sprengen.

## Key Strategies

### 1. Hierarchische & Rekursive Zusammenfassung (Map-Reduce)
- **Prinzip:** Dokumente werden in Chunks unterteilt, einzeln zusammengefasst und diese Zusammenfassungen wieder zu einer Master-Summary kombiniert.
- **Nutzen:** Ermöglicht das "Lesen" beliebig langer Texte (Bücher, Logs).

### 2. Prompt-Kompression (Token Pruning)
- **Prinzip:** Entfernung von irrelevanten Tokens (z. B. Füllwörter) durch Algorithmen wie **LLMLingua**.
- **Nutzen:** Spart 20-50 % Token bei minimalem Qualitätsverlust.

### 3. Layered Memory (Sliding Window & Memory Slots)
- **Prinzip:** Die letzten $N$ Nachrichten bleiben im Volltext erhalten, ältere werden inkrementell in eine "Running Summary" überführt.
- **Nutzen:** Perfekt für langlaufende Agenten oder Chats.

### 4. Hierarchische Retrieval-Bäume
- **Prinzip:** RAG (Retrieval-Augmented Generation) wird mit Zusammenfassungen kombiniert. Man navigiert von einer groben Übersicht (Summary) tiefer in die Details (Original-Chunks).
- **Nutzen:** Schnelle Navigation in riesigen Wissensdatenbanken.

## Actionable Insights for Firstbrain

1. **Automatischer Rollover:** Bei jeder `/daily` Erstellung sollten die wichtigsten Aufgaben des Vortags in einer Zeile zusammengefasst werden.
2. **MOC als Index:** Jedes MOC sollte eine 3-zeilige Zusammenfassung des Bereichs enthalten, damit Claude nicht alle Unter-Notizen lesen muss.
3. **Summarization-Bot:** Ein Skript im `workspace/`, das alte Projekt-Logs in "Decisions & Milestones" komprimiert.

## Connections

- **Related Ideas:** [[Zettel -- Kontext-Kompression durch Summaries]]
- **Project:** [[Wissens-Zentrale Optimierung]]
- **MOC:** [[Resources MOC]]
