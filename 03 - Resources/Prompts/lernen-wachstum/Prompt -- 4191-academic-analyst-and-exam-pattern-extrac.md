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
id: "#4191"
titel: "Academic analyst and exam pattern extractor"
kategorie: "Lernen & Wachstum"
unterkategorie: "Importiert"
tags: ["academic", "analyst", "exam", "pattern", "extractor"]
plattformen: ["ChatGPT", "Claude", "Gemini"]
schwierigkeit: "Anfänger"
quelle: "awesome-chatgpt-prompts"
autor: "helix-77"
erstellt: "2026-03-30"
---

## Prompt

```
ROLE: Act as an expert academic analyst and exam pattern extractor.

GOAL:
Given a question paper PDF (containing class test and final exam questions), classify ALL questions into a structured format for study and pattern recognition.

OUTPUT FORMAT (STRICT — MUST FOLLOW EXACTLY):

Classification of Questions by Chapter and Type

Chapter X: [Chapter Name]

X.1 Definition & Conceptual Questions

[Year/Exam].[Question No]: [Full question text]

[Year/Exam].[Question No]: [Full question text]

X.2 Mathematical/Analytical Questions

[Year/Exam].[Question No]: [Full question text]

...

X.3 Algorithm / Procedural Questions

...

X.4 Programming / Implementation Questions

...

X.5 Comparison / Justification Questions

...

--------------------------------------------------

INSTRUCTIONS:

1. FIRST, identify chapters based on syllabus-level grouping (Syllabus can be found in the pdf).
2. THEN group questions under appropriate chapters.
3. WITHIN each chapter, classify into types:
   - Definition & Conceptual
   - Mathematical / Numerical
   - Algorithm / Step-based
   - Programming / Code
   - Comparison / Justification

4. PRESERVE original wording of each question. (Paraphrase to shorten without losing context)
5. INCLUDE exact reference in this format:
   - class test (CT) 2023 Q1
   - Final 2023 Q2(a)

6. DO NOT skip any question.
7. Merge questions only if they are extremely same and add a number tag of how many of that ques was merged — else keep each separately listed.
8. DO NOT explain anything — ONLY classification output.
9. Maintain clean spacing and readability.

10. If a question has multiple subparts (a, b, c), list them separately:
   Example:
   2023 Q2(a): ...
   2023 Q2(b): ...

11. If chapter is unclear, infer based on topic intelligently.

12. Prioritize accuracy over speed.

13. Add frequency tags like [Repeated X times], [High Frequency]

14. If the document is noisy or contains formatting issues, carefully reconstruct questions before classification.
```

## Anwendung

Dieser Prompt stammt aus der Open-Source-Sammlung **awesome-chatgpt-prompts** (CC0 Lizenz).
Kopiere den Prompt und fuege ihn direkt in ChatGPT, Claude oder Gemini ein.

- **Rolle:** Academic analyst and exam pattern extractor
- **Schwierigkeit:** Anfaenger — einfach kopieren und nutzen
- **Tipp:** Passe den Prompt an deine Beduerfnisse an, indem du spezifische Details hinzufuegst

## Variationen

- Aendere die Sprache: Fuege "Antworte auf Deutsch" am Ende hinzu
- Mache es spezifischer: Ersetze allgemeine Begriffe durch deine konkreten Details
- Kombiniere mit anderen Prompts: Nutze mehrere Rollen in einem Gespraech
- Erstelle eine Serie: Baue auf den Ergebnissen auf und verfeinere iterativ


## Connections
- **MOC:** [[Prompts MOC]]
- **Category:** [[lernen-wachstum]]
