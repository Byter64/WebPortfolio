import { projects, tags } from "../data/projects.mjs";
import { defaultLocale, locales } from "../i18n/config.mjs";
import {
  bundles,
  createI18n,
  getTranslationReport,
} from "../i18n/index.mjs";

let hasErrors = false;

for (const locale of locales) {
  const bundle = bundles.get(locale.code);
  if (bundle._meta?.status !== locale.status) {
    console.error(
      `[i18n] ${locale.code}: Status in JSON (${bundle._meta?.status}) und Registry (${locale.status}) stimmen nicht überein.`,
    );
    hasErrors = true;
  }

  const report = getTranslationReport(locale.code);
  if (locale.status === "published" && report.missing.length) {
    console.error(
      `[i18n] ${locale.code}: ${report.missing.length} fehlende Schlüssel:\n- ${report.missing.join("\n- ")}`,
    );
    hasErrors = true;
  } else if (locale.status === "draft") {
    console.log(
      `[i18n] ${locale.code}: Entwurf, ${report.missing.length} Übersetzungen noch offen.`,
    );
  }

  if (report.unused.length) {
    console.warn(
      `[i18n] ${locale.code}: ${report.unused.length} nicht verwendete Schlüssel:\n- ${report.unused.join("\n- ")}`,
    );
  }
}

const defaultI18n = createI18n(defaultLocale);
for (const tag of tags) {
  for (const field of ["label", "description"]) {
    const key = `portfolio.tags.${tag.id}.${field}`;
    if (!defaultI18n.hasOwnTranslation(key)) {
      console.error(`[i18n] ${defaultLocale}: Pflichtschlüssel fehlt: ${key}`);
      hasErrors = true;
    }
  }
}

for (const project of projects) {
  for (const field of ["title", "description", "imageAlt", "role", "content"]) {
    const key = `projects.${project.id}.${field}`;
    if (!defaultI18n.hasOwnTranslation(key)) {
      console.error(`[i18n] ${defaultLocale}: Pflichtschlüssel fehlt: ${key}`);
      hasErrors = true;
    }
  }
}

if (hasErrors) process.exitCode = 1;
else console.log("Alle veröffentlichten Übersetzungen sind vollständig und konsistent.");
