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
id: "#3527"
titel: "You will be given a definition of a task first, then an example"
kategorie: "Kreativitaet & Freizeit"
unterkategorie: "Importiert"
tags: ["given", "definition", "task", "follow", "solve"]
plattformen: ["ChatGPT", "Claude", "Gemini"]
schwierigkeit: "Anfänger"
quelle: "openrlhf-UltraFeedback"
erstellt: "2026-03-10"
---

## Prompt

```
You will be given a definition of a task first, then an example. Follow the example to solve a new instance of the task.
The input is taken from a negotiation between two participants who take the role of campsite neighbors and negotiate for Food, Water, and Firewood packages, based on their individual preferences and requirements. Given an utterance and recent dialogue context containing past 3 utterances (wherever available), output Yes if the utterance contains the small-talk strategy, otherwise output No. small-talk is a cooperative negotiation strategy. It is used for discussing topics apart from the negotiation, in an attempt to build a rapport with the opponent. For example, discussing how the opponent is doing during the pandemic or sharing excitement for the camping trip.

Context: 'Great!  So looks like all the water goes to you.  I will take all the food if that is ok and we can split the wood.  ' 'Well i would need one food and one wood' 'OK.  I think that will work out for me.  You get 3 water, 1 wood and 1 food.  I will take the rest.'
Utterance: 'Great that's an agreement for me'
Solution: No
Why? The participant does not engage in any small talk in this utterance and primarily refers to the negotiation itself.

New input: Context: 'Hello!' 'Hello, how are you doing today?'
Utterance: 'i am doing great! how about you?'
Solution:
```

## Anwendung

Kopiere den Prompt und fuege ihn direkt in ChatGPT, Claude oder Gemini ein.
Passe die Platzhalter und Details an deine Situation an.

- **Kategorie:** Kreativitaet & Freizeit
- **Schwierigkeit:** Anfaenger — einfach kopieren und anpassen
- **Tipp:** Fuer bessere Ergebnisse, fuege spezifische Details zu deiner Situation hinzu

## Variationen

- Aendere die Sprache: Fuege "Antworte auf Deutsch" am Ende hinzu
- Mache es spezifischer: Ersetze allgemeine Begriffe durch deine konkreten Details
- Aendere die Laenge: "Kurz und knapp" oder "Ausfuehrlich mit Beispielen"
- Aendere den Ton: "Formell", "Locker", "Professionell", "Freundlich"


## Connections
- **MOC:** [[Prompts MOC]]
- **Category:** [[kreativitaet-freizeit]]
