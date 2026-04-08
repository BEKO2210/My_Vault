---
type: zettel
created: 2026-04-08
updated: 2026-04-08
tags:
  - #neural-networks
  - #embeddings
  - #compression
source: Research
---

# Zettel -- Context Autoencoder (ICAE) und Soft Prompts

## Idee

> Ein langer Kontext wird in einen sehr kleinen Vektor-Raum (Soft Prompt) "eingedampft", der direkt vom LLM verarbeitet wird.

## Explanation

Statt Text als Worte zu speichern, nutzt man ein neuronales Modell (Encoder), um den gesamten Sinn eines Dokuments in wenige "Gedächtnis-Slots" (latente Vektoren) umzuwandeln.
- **Kompression:** Bis zu 20x effizienter als normaler Text.
- **Vorteil:** Das LLM "liest" die Absicht (Intent) statt der Rohworte.
- **Beispiel:** Ein Buch wird in 100 Vektoren komprimiert. Das LLM greift dann auf diese 100 Vektoren zu, um Fragen zum Buch zu beantworten.

## Connections

- **Source:** [[Resource -- Wissens-Kompression für LLMs]]
- **Related Ideas:** [[Hierarchische Retrieval Trees]]
- **Project:** [[Wissens-Zentrale Optimierung]]
