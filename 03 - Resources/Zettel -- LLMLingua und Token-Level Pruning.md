---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #token-efficiency
  - #nlp
  - #optimization
source: Research
---

# Zettel -- LLMLingua und Token-Level Pruning

## Idee

> Kompression von Prompts durch das Entfernen von Tokens mit geringem Informationsgehalt (Entropie).

## Explanation

LLMLingua nutzt ein kleineres Sprachmodell, um die Wichtigkeit jedes Tokens in einem Prompt zu bewerten. Tokens, die für das Verständnis nicht entscheidend sind (z.B. "der", "die", "ist", redundante Adjektive), werden gelöscht (ge-pruned).
- **Vorteil:** Reduziert die API-Kosten und Latenz um 20-50% bei minimalem Qualitätsverlust.
- **Prinzip:** Es bleibt ein "telegrammartiger" Text übrig, den ein LLM aber immer noch perfekt "entpacken" kann.

## Connections

- **Source:** [[Resource -- Wissens-Kompression für LLMs]]
- **Related Ideas:** [[Wissens-Zentrale Optimierung]]
- **Supports:** [[Layered Memory Architecture]]
---
