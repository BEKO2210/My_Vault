---
type: project
created: 2026-04-08
updated: 2026-04-08
tags:
  - #pkm
  - #token-efficiency
  - #firstbrain
status: active
priority: high
workspace: [[workspace/wissens-zentrale-optimierung/]]
---

# Wissens-Zentrale Optimierung

## Goal

Maximierung des Wissenserhalts bei gleichzeitiger Minimierung des Token-Verbrauchs (Kontext-Effizienz).

## Status

- [x] Projektordner und Workspace erstellt.
- [ ] Research: Strategien zur Kompression von Wissen für LLMs.
- [ ] Implementierung: Automatisierte Zusammenfassung (Summarization) von alten Threads.
- [ ] Struktur: Aufbau einer hierarchischen MOC-Struktur zur gezielten Kontext-Injektion.

## Decisions

- **Strategie 1:** Nutzung von "Layered Memory" (Sitzung -> Arbeitsspeicher -> Langzeitgedächtnis).
- **Strategie 2:** Aggressive Nutzung von `MEMORY.md` als "Single Source of Truth" für den aktuellen Kontext.

## Next Actions

- [ ] Erstellen einer Forschungs-Notiz zu "Prompt Chaining & Context Management".
- [ ] Analyse der aktuellen `MEMORY.md` Struktur auf Redundanzen.

## Connections

- **Related:** [[Zettel -- Das Gehirn als Wissens-Zentrale]], [[Resource -- Wissens-Kompression für LLMs]]
- **New Research:** [[Zettel -- Map-Reduce und Rekursive Summarization]], [[Zettel -- LLMLingua und Token-Level Pruning]], [[Zettel -- Context Autoencoder (ICAE) und Soft Prompts]], [[Zettel -- Sliding Window und Observation Masking]], [[Zettel -- Hierarchische Retrieval Trees]]
- **Parent:** [[Home]]
- **MOC:** [[Projects MOC]]

## Log

### 2026-04-08
- Projekt "Wissens-Zentrale Optimierung" gestartet.
- Workspace initialisiert.
- Projektnotiz mit Zielsetzung und ersten Aufgaben aktualisiert.
- Vollständige Recherche zur Wissens-Kompression (Token-Effizienz) durchgeführt.
- 8 detaillierte Zettel-Notizen zu allen Unterthemen erstellt (Map-Reduce, LLMLingua, ICAE, Sliding Window, etc.).
- Prototyp-Skript `summarizer.cjs` im Workspace erstellt.
- Automatische MOC-Zusammenfassung für [[Projects MOC]] implementiert.
