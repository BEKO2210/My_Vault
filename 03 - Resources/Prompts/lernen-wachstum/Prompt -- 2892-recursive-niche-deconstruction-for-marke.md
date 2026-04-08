---
type: resource
created: 2026-04-08
updated: 2026-04-08
tags:
  - #prompt
  - #lyra
  - #pkm
source: https://github.com/BEKO2210/lyra-prompts
---

---
id: "#2892"
titel: "Recursive Niche Deconstruction for Market Research"
kategorie: "Lernen & Wachstum"
unterkategorie: "Importiert"
tags: ["recursive", "niche", "deconstruction", "market", "research"]
plattformen: ["ChatGPT", "Claude", "Gemini"]
schwierigkeit: "Anfänger"
quelle: "awesome-chatgpt-prompts"
autor: "amvicioushecs"
erstellt: "2026-03-09"
---

## Prompt

```
{
  "industry": "${industry}",
  "region": "${region}",
  "tree": {
    "level": "Macro",
    "name": "...",
    "market_valuation": "$X",
    "top_players": [
      {
        "name": "Company A",
        "type": "Incumbent",
        "focus": "Broad"
      },
      {
        "name": "Company B",
        "type": "Incumbent",
        "focus": "Broad"
      }
    ],
    "children": [
      {
        "level": "Sub-Niche/Micro",
        "name": "...",
        "narrowing_variable": "...",
        "market_valuation": "$X",
        "top_players": [
          {
            "name": "Startup C",
            "type": "Specialist",
            "focus": "Verticalized"
          },
          {
            "name": "Tool D",
            "type": "Micro-SaaS",
            "focus": "Hyper-Specific"
          }
        ],
        "children": []
      }
    ]
  },
  "keyword_analysis": {
    "monthly_traffic": "{region-specific traffic data}",
    "competitiveness": "{region-specific competitiveness data}",
    "potential_keywords": [
      {
        "keyword": "...",
        "traffic": "...",
        "competition": "..."
      }
    ]
  }
}
```

## Anwendung

**Thema: Industry, Region** — Unterstuetzt bei der Geschaeftsplanung und Unternehmensgruendung. Die KI liefert strukturierte Analysen und Strategievorschlaege.

Kopiere den Prompt und fuege ihn in ChatGPT, Claude oder Gemini ein.
Passe die Details an deine Beduerfnisse an.

## Variationen

- Beschreibe deine Branche und Zielgruppe
- Nenne dein Startkapital oder Budget
- Frage nach einer SWOT-Analyse fuer deine Idee
- Bitte um einen konkreten Aktionsplan mit Meilensteinen


## Connections
- **MOC:** [[Prompts MOC]]
- **Category:** [[lernen-wachstum]]
