# Portfolio

Ein mehrseitiges, vollständig statisch generiertes Portfolio für GitHub Pages – ohne Framework und ohne externe Laufzeitabhängigkeiten.

## Inhalte und Übersetzungen pflegen

Sprachunabhängige Daten stehen in `data/projects.mjs`:

- `site` enthält Eigentümer und öffentliche Basis-URL.
- `tags` enthält stabile, URL-taugliche Tag-IDs.
- `projects` enthält Projekt-ID, Slug, Tags, Bildpfad und technische Angaben.

Alle sichtbaren Texte stehen getrennt davon in `locales/<sprache>.json`. `locales/de.json` enthält die vollständigen deutschen Oberflächen-, Kategorie- und Projekttexte. Projekt-ID, Tags und Bildpfade werden deshalb nicht pro Sprache dupliziert.

Aktuell sind Deutsch (`de`), Englisch (`en`), Spanisch (`es`) und Japanisch (`ja`) vollständig übersetzt und veröffentlicht. Deutsch bleibt die Standard- und Fallback-Sprache.

Für ein neues Projekt:

1. Den sprachunabhängigen Datensatz in `data/projects.mjs` ergänzen.
2. Bilddateien unter `assets/` ablegen.
3. Unter `projects.<projekt-id>` in jeder veröffentlichten Sprachdatei Titel, Beschreibung, Alternativtext, Metadaten und Inhalt ergänzen.
4. Build und Prüfungen ausführen.

## Eine neue Sprache hinzufügen

Die unterstützten Sprachen werden zentral in `i18n/config.mjs` registriert. Eine neue Sprache erfordert keine kopierten Templates oder HTML-Dateien:

1. Einen Eintrag mit Sprachcode, Gebietsschema, lesbarem Eigennamen, dekorativer Flagge und Schreibrichtung in `i18n/config.mjs` anlegen.
2. `locales/<sprachcode>.json` nach der Struktur von `locales/de.json` erstellen und ausschließlich manuell übersetzen.
3. Die Sprache zunächst mit `status: "draft"` registrieren. Der Übersetzungscheck zeigt alle noch fehlenden Einträge an.
4. Nach vollständiger Übersetzung den Status auf `published` ändern.
5. Build und Prüfungen ausführen.

Nur veröffentlichte Sprachen erhalten Seiten, Links, Sitemap-Einträge und `hreflang`-Verweise. Entwurfssprachen erscheinen in der Sprachauswahl als „in Vorbereitung“ und verlinken nicht auf nicht vorhandene Seiten. Deutsch ist Standard- und Fallback-Sprache; rohe Übersetzungsschlüssel gelangen nicht in die fertige Website.

## Build und Prüfungen

```powershell
node scripts/build.mjs
node scripts/check-i18n.mjs
node scripts/test.mjs
```

`check-i18n.mjs` meldet fehlende sowie nicht mehr verwendete Übersetzungsschlüssel. Bei veröffentlichten Sprachen führen fehlende Pflichttexte zu einem Fehler; bei Entwurfssprachen werden sie als Arbeitsliste ausgegeben. Im Produktions-Build fällt ein einzelner optionaler Text kontrolliert auf Deutsch zurück.

Der Build erzeugt derzeit:

- `index.html` als statische, sichtbare Sprachauswahl,
- `<sprache>/index.html` als lokalisierte Startseite,
- `<sprache>/projekte/index.html` als allgemeine Übersicht,
- `<sprache>/portfolio/<tag>/index.html` für jeden Tag,
- `<sprache>/projekte/<slug>/index.html` für jedes Projekt,
- `sitemap.xml` mit ausschließlich tatsächlich veröffentlichten Seiten,
- Weiterleitungen an den bisherigen, nicht lokalisierten URLs zur deutschen Version.

Alle internen Seitenlinks verweisen explizit auf die jeweilige `index.html`. Dadurch funktionieren sie auch in Vorschauen, die Verzeichnis-URLs nicht automatisch auf eine Indexdatei auflösen.

## Templates und Lokalisierung

Der Generator verwendet kleine ES-Modul-Templates ohne Fremdpakete:

- `templates/base.mjs` enthält HTML-Rahmen, lokalisierte Metadaten, Kopfbereich, Navigation, Sprachauswahl, `hreflang` und Fußzeile.
- `templates/portfolio.mjs` erzeugt die allgemeine und die thematischen Übersichtsseiten.
- `templates/project.mjs` erzeugt Projektseiten und den lokalisierten Zurück-Button.
- `templates/components.mjs` enthält wiederverwendbare Projektkarten und Bilder.
- `templates/helpers.mjs` erzeugt kanonische und relative, sprachspezifische URLs.
- `i18n/index.mjs` lädt Übersetzungen, setzt den deutschen Fallback um und stellt Locale-Formatierung über `Intl` bereit.

Das Browser-Skript `site.js` validiert auf Projektseiten den optionalen Herkunftskontext `?portfolio=game-design`. Bei einem gültigen Tag führt der Zurück-Button innerhalb derselben Sprache zur passenden Themenübersicht. Ohne oder mit ungültigem Kontext führt er zur allgemeinen lokalisierten Projektübersicht. Beim späteren Wechsel zwischen veröffentlichten Sprachen bleibt ein gültiger Kontext erhalten.

Die Sprachauswahl ist ein natives Disclosure-Dropdown aus `<details>` und `<summary>`. Dadurch bleiben die statischen Sprachlinks auch ohne JavaScript erreichbar. `site.js` ergänzt synchronisiertes `aria-expanded`, Schließen mit Escape, Schließen bei Außenklick und den Erhalt eines gültigen Portfolio-Kontexts. Flagge, Anzeigename und regionales Locale werden ausschließlich in `i18n/config.mjs` gepflegt.

## Lokale Vorschau

Nach dem Build kann das Repository mit einem statischen Webserver ausgeliefert werden, zum Beispiel:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Die Vorschau ist danach unter `http://127.0.0.1:8000/index.html` erreichbar.

## Auf GitHub Pages veröffentlichen

1. In `data/projects.mjs` die Eigenschaft `site.canonicalOrigin` auf die endgültige Pages-URL setzen.
2. Dieses Verzeichnis in ein GitHub-Repository übertragen.
3. Im Repository **Settings → Pages** öffnen.
4. Unter **Build and deployment** die Quelle **Deploy from a branch** wählen.
5. Den Branch `main` und den Ordner `/(root)` auswählen und speichern.

Danach veröffentlicht GitHub die statischen Dateien. Vor jedem Push nach Inhalts- oder Übersetzungsänderungen Build und Prüfungen ausführen.
