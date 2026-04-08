---
type: home
tags:
  - navigation
  - home
---

# 🧠 Firstbrain -- Dein KI-Wissens-Zentrum

> "Du denkst -- ich organisiere." Willkommen in deinem hochgradig vernetzten zweiten Gehirn, Belkis.

---

## ⚡ Schnell-Aktionen (New Note)

Klicke auf einen Link und nutze **Ctrl+Shift+T**, um das passende Template zu wählen.

| Ziel | Erstellen | Template |
| :--- | :--- | :--- |
| **Projekt starten** | [[New Project]] | `Project` |
| **Bereich anlegen** | [[New Area]] | `Area` |
| **Wissen sichern** | [[New Resource]] | `Resource` |
| **Tool dokumentieren** | [[New Tool]] | `Tool` |
| **Idee festhalten** | [[New Zettel]] | `Zettel` |
| **Entscheidung loggen** | [[New Decision]] | `Decision` |
| **Kontakt pflegen** | [[New Person]] | `Person` |
| **Meeting erfassen** | [[New Meeting]] | `Meeting` |
| **Code-Snippet** | [[New Snippet]] | `Code Snippet` |

---

## 🛰️ Kommando-Zentrale (MOCs)

| Bereich | Inhalt & Fokus |
| :--- | :--- |
| **[[Prompts MOC|🎯 Prompts]]** | Über 2.770 AI-Prompts (Lyra 4-D Methodik). |
| **[[Projects MOC|🚀 Projekte]]** | Aktive Pläne, Status und Meilensteine. |
| **[[Resources MOC|📚 Ressourcen]]** | Externes Wissen, APIs und Forschung. |
| **[[Areas MOC|🗺️ Bereiche]]** | Langfristige Lebensbereiche und Ziele. |
| **[[Decisions MOC|⚖️ Entscheidungen]]** | Logbuch wichtiger strategischer Wahlmöglichkeiten. |
| **[[Tools MOC|🛠️ Tools]]** | Deine Software, Dienste und Workflows. |

---

## 📊 Aktueller Status

### 🔥 Aktive Projekte
```dataview
TABLE status, priority, area
FROM "01 - Projects"
WHERE status = "active"
SORT priority ASC
```

### ✅ Offene Aufgaben
```dataview
TASK
FROM "01 - Projects" OR "00 - Inbox"
WHERE !completed
LIMIT 10
```

### 🕒 Letzte Änderungen
```dataview
TABLE file.mtime AS "Geändert", type
FROM ""
WHERE type AND type != "home" AND type != "moc"
SORT file.mtime DESC
LIMIT 8
```

---

## 🛠️ System & Hilfe
- [[START HERE|🚀 Erste Schritte]] – Onboarding-Guide.
- [[Workflow Guide|🔄 Workflow]] – Tägliche Routinen.
- [[MEMORY|🧠 Gedächtnis]] – Claudes Arbeitsstand.
- [[ARCHIVE_SUMMARY|📦 Archiv]] – Komprimiertes Wissen.

*Nutze die Graph-Ansicht (**Ctrl+G**), um die Verbindungen deines Gehirns zu sehen.*
