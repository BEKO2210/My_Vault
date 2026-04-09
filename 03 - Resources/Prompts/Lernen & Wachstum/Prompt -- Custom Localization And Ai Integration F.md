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
id: "#2377"
titel: "Custom Localization and AI Integration for Apps"
kategorie: "Lernen & Wachstum"
unterkategorie: "Importiert"
tags: ["custom", "localization", "integration", "apps", "expert"]
plattformen: ["ChatGPT", "Claude", "Gemini"]
schwierigkeit: "Anfänger"
quelle: "awesome-chatgpt-prompts"
autor: "ahmettzorlutuna"
erstellt: "2026-03-09"
---

## Prompt

```
Act as an App Localization Expert. You are tasked with setting up a user-preference-based localization architecture in an application independent of the phone's system language.

Your task includes:
1. **LanguageManager Class**: Create a `LanguageManager` class using the `ObservableObject` protocol. Store the user's selected language in `UserDefaults`, with the default language set to 'en' (English). Display a selection screen on the first launch.
2. **Global Locale Override**: Wrap the entire `ContentView` structure in your SwiftUI app with `.environment(\.locale, .init(identifier: languageManager.selectedLanguage))` to trigger translations based on the selected language in `LanguageManager`.
3. **Onboarding Language Selection**: If no language has been selected previously, show a stylish 'Language Selection' screen with English and Turkish options on app launch. Save the selection immediately and transition to the main screen.
4. **AI (LLM) Integration**: Add the user's selected language as a parameter in AI requests (API calls). Update the system prompt to: 'User's preferred language: ${selected_language}. Respond in this language.'
5. **String Catalogs**: Integrate `.stringxcatalog` into your project and add all existing hardcoded strings in English (base) and Turkish.
6. **Dynamic Update**: Ensure that changing the language in settings updates the UI without restarting the app.
7. **User Language Change**: Allow users to change the app's language dynamically at any time.

Rules:
- Ensure seamless user experience during language selection and updates.
- Test functionality for both English and Turkish languages.
```

## Anwendung

**Thema: App Localization, You Are** — Hilft beim Sprachenlernen und Uebersetzen. Die KI erklaert Grammatikregeln, uebersetzt Texte und gibt Uebungen.

Kopiere den Prompt und fuege ihn in ChatGPT, Claude oder Gemini ein.
Passe die Details an deine Beduerfnisse an.

## Variationen

- Nenne dein aktuelles Sprachniveau (A1-C2)
- Frage nach Beispielsaetzen fuer den Alltag
- Bitte um Erklaerungen von Redewendungen
- Frage nach Uebungen mit steigendem Schwierigkeitsgrad


## Connections
- **MOC:** [[Prompts MOC]]
- **Category:** [[lernen-wachstum]]
