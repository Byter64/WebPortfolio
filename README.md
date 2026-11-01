# Webportfolio pflegen

Dieses Portfolio wird mit einem kleinen, abhängigenkeitsfreien Node.js-Generator vollständig statisch gebaut. Nur Dateien unter `src/` werden redaktionell gepflegt. Der Ordner `dist/` wird bei jedem Build gelöscht und neu erzeugt; Änderungen darin gehen bewusst verloren.

## Struktur

```text
src/
  content/projects/<projekt>/  Projektmetadaten und Texte pro Sprache
  data/                        Tags, Unterportfolios, Sprachen und Website-Daten
  i18n/                        Allgemeine Oberflächentexte und Bezeichnungen
  templates/                   Gemeinsame HTML-Templates
  assets/                      Bilder und Flaggen
  client/site.js               Kleine Browserfunktionen
  styles.css                   Gemeinsames Design
scripts/                       Build, Validierung und Tests
dist/                          Generierte Website, niemals manuell bearbeiten
```

## 1. Ein Projekt hinzufügen

1. Unter `src/content/projects/` einen neuen Ordner mit einem stabilen, kleingeschriebenen Namen anlegen.
2. Darin `project.json` nach einem vorhandenen Beispiel erstellen. `id` bleibt dauerhaft stabil, `slug` bestimmt bewusst die URL. `published`, `featured` und `order` steuern Veröffentlichung, Startseite und Sortierung.
3. Das Bild unter `src/assets/` ablegen und in `coverImage` relativ zu `src/` eintragen.
4. Für jede Sprache eine Datei wie `de.json`, `en.json`, `es.json` oder `ja.json` mit Titel, Kurzbeschreibung, Alternativtext, Rolle und Inhaltsabschnitten anlegen.
5. `npm test` ausführen. Übersichten und Unterportfolios werden automatisch aktualisiert.

## 2. Ein Projekt entfernen oder deaktivieren

Zum vorübergehenden Ausblenden in dessen `project.json` den Wert `published` auf `false` setzen. Beim nächsten Build wird keine Projektseite erzeugt und das Projekt verschwindet aus allen Übersichten. Zum endgültigen Entfernen kann der gesamte Projektordner gelöscht werden.

## 3. Tags vergeben

In `project.json` stehen unter `tags` ausschließlich stabile IDs aus `src/data/tags.json`. Ein Projekt darf beliebig viele Tags besitzen. Die Unterportfolio-Zuordnung wird nur aus diesen Tags und den Portfolio-Regeln berechnet.

## 4. Einen Tag anlegen

In `src/data/tags.json` einen eindeutigen Eintrag mit `id` und `order` ergänzen. Anschließend in jeder Datei unter `src/i18n/` den sichtbaren Namen unter `tags.<id>.label` eintragen. Unbekannte und doppelte Tags stoppen den Build mit einer verständlichen Fehlermeldung.

## 5. Ein Unterportfolio erstellen

In `src/data/portfolios.json` einen Eintrag anlegen:

- `id`: dauerhafte interne Kennung
- `slug`: bewusst gewählter URL-Teil
- `requiredTags`: Tags für die automatische Zuordnung
- `match`: `any` für mindestens einen oder `all` für alle genannten Tags
- `order`: Position in Navigation und Build
- `enabled`: Sichtbarkeit des Unterportfolios

Titel und Beschreibung werden anschließend in jeder Datei unter `src/i18n/` als `portfolios.<id>.title` und `portfolios.<id>.description` ergänzt.

## 6. Ein Unterportfolio entfernen oder deaktivieren

`enabled` in `src/data/portfolios.json` auf `false` setzen oder den Eintrag löschen. Projekte und Tags bleiben davon unberührt. Weil `dist/` vor jedem Build geleert wird, bleiben keine veralteten Seiten zurück.

## 7. Ein Unterportfolio umbenennen

Nur `portfolios.<id>.title` und bei Bedarf `description` in den Sprachdateien unter `src/i18n/` ändern. ID, Regeln und URL bleiben stabil.

## 8. Die URL eines Unterportfolios ändern

Den Wert `slug` in `src/data/portfolios.json` bewusst ändern. `id` nicht ändern, wenn Zuordnungen und Übersetzungsschlüssel bestehen bleiben sollen. Bei einer öffentlich verwendeten alten URL sollte zusätzlich eine gezielte Weiterleitung ergänzt werden.

## 9. Die Sortierung ändern

`order` in `src/data/tags.json`, `src/data/portfolios.json`, `src/data/languages.json` oder der jeweiligen `project.json` anpassen. Kleinere Werte erscheinen zuerst.

## 10. Übersetzungen und Sprachen ergänzen

Allgemeine Texte, Tag-Namen und Unterportfolio-Texte stehen in `src/i18n/<sprache>.json`. Lange Projekttexte stehen separat im jeweiligen Projektordner. Eine neue Sprache wird in `src/data/languages.json` registriert und erhält eine allgemeine Übersetzungsdatei sowie Projektdateien. Zunächst kann `status` auf `draft` stehen; nach vollständiger Übersetzung wird er auf `published` gesetzt. Deutsch ist die dokumentierte Standardsprache.

## 11. Lokale Vorschau starten

```powershell
npm run build
python -m http.server 8000 --directory dist
```

Danach `http://127.0.0.1:8000/index.html` öffnen. Alle internen Links zeigen explizit auf `index.html`, sodass keine Ordneransichten erscheinen.

## 12. Produktions-Build erstellen

```powershell
npm test
```

Dieser Befehl baut `dist/`, prüft Übersetzungen, das Inhaltsmodell, alle erzeugten Links, Sprachwechsel, Portfolio-Kontexte, Sitemap und SEO-Metadaten. Einzelne Schritte:

```powershell
npm run validate
npm run build
node scripts/test.mjs
```

## Validierung und Veröffentlichung

Die Validierung meldet betroffene Datei, Feld und ID bei doppelten IDs oder Slugs, unbekannten Tags, ungültigen `any`/`all`-Regeln, fehlenden Pflichtfeldern, Bildern, Übersetzungen und Sprachcodes. Projektseiten akzeptieren nur aktive, für das Projekt tatsächlich passende Unterportfolio-Kontexte.

Der Workflow `.github/workflows/pages.yml` führt `npm test` aus und veröffentlicht ausschließlich `dist/` über GitHub Pages. In den Repository-Einstellungen muss als Pages-Quelle **GitHub Actions** ausgewählt sein.
