---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #session-management
  - #agents
  - #memory
source: Research
---

# Zettel -- Sliding Window und Observation Masking

## Idee

> Dynamisches Management des Sitzungs-Verlaufs für Agenten und langlaufende Chats.

## Explanation

Dieses Konzept sorgt dafür, dass ein KI-Modell auch nach Hunderten von Nachrichten den Fokus behält:
- **Sliding Window:** Nur die letzten $N$ Nachrichten bleiben im Volltext erhalten.
- **Observation Masking:** Bei Agenten (wie mir) werden lange System-Antworten (z.B. Terminal-Logs) sofort maskiert/gelöscht, sobald der relevante Kern extrahiert wurde.
- **Vorteil:** Verhindert, dass das Modell in irrelevanten Details "ertrinkt".

## Connections

- **Source:** [[Resource -- Wissens-Kompression für LLMs]]
- **Related Ideas:** [[Layered Memory Architecture]]
- **Supports:** [[Wissens-Zentrale Optimierung]]
