import {
  allProjects,
  defaultLocale,
  hasProjectTranslation,
  languages,
  portfolios,
  tags,
} from "../src/content.mjs";
import { bundles, createI18n, getTranslationReport } from "../src/i18n.mjs";

let hasErrors = false;

for (const language of languages) {
  const bundle = bundles.get(language.code);
  if (bundle._meta?.status !== language.status) {
    console.error(
      `[i18n] src/i18n/${language.code}.json: Status ${bundle._meta?.status} stimmt nicht mit src/data/languages.json (${language.status}) überein.`,
    );
    hasErrors = true;
  }
  const report = getTranslationReport(language.code);
  if (language.status === "published" && report.missing.length) {
    console.error(
      `[i18n] src/i18n/${language.code}.json: ${report.missing.length} fehlende Schlüssel:\n- ${report.missing.join("\n- ")}`,
    );
    hasErrors = true;
  }
  if (report.unused.length) {
    console.warn(
      `[i18n] src/i18n/${language.code}.json: ${report.unused.length} nicht verwendete Schlüssel:\n- ${report.unused.join("\n- ")}`,
    );
  }
}

for (const language of languages.filter((entry) => entry.status === "published")) {
  const i18n = createI18n(language.code);
  for (const tag of tags) {
    if (!i18n.hasOwnTranslation(`tags.${tag.id}.label`)) {
      console.error(`[i18n] src/i18n/${language.code}.json: Pflichtschlüssel tags.${tag.id}.label fehlt.`);
      hasErrors = true;
    }
  }
  for (const portfolio of portfolios) {
    for (const field of ["title", "description"]) {
      if (!i18n.hasOwnTranslation(`portfolios.${portfolio.id}.${field}`)) {
        console.error(`[i18n] src/i18n/${language.code}.json: Pflichtschlüssel portfolios.${portfolio.id}.${field} fehlt.`);
        hasErrors = true;
      }
    }
  }
  for (const project of allProjects.filter((entry) => entry.published)) {
    if (!hasProjectTranslation(project, language.code)) {
      const level = language.code === defaultLocale ? "error" : "warn";
      console[level](
        `[i18n] ${project.sourceDirectory}: ${language.code}.json fehlt${level === "warn" ? "; die Projektseite wird für diese Sprache nicht erzeugt" : ""}.`,
      );
      if (level === "error") hasErrors = true;
    }
  }
}

if (hasErrors) process.exitCode = 1;
else console.log("Alle veröffentlichten Übersetzungen sind vollständig und konsistent.");
