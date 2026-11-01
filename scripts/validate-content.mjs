import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  allProjects,
  defaultLocale,
  getProjectText,
  hasProjectTranslation,
  languages,
  portfolios,
  site,
  sourceRoot,
  tags,
} from "../src/content.mjs";

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function duplicateValues(items, field) {
  const seen = new Set();
  return items
    .map((item) => item[field])
    .filter((value) => (seen.has(value) ? true : !seen.add(value)));
}

export function collectContentErrors(model, options = {}) {
  const errors = [];
  const verifyImages = options.verifyImages ?? true;
  const tagIds = new Set(model.tags.map((tag) => tag.id));
  const languageCodes = new Set(model.languages.map((language) => language.code));

  if (typeof model.site.owner !== "string" || !model.site.owner.trim()) {
    errors.push("src/data/site.json: Pflichtfeld owner fehlt.");
  }
  try {
    const canonical = new URL(model.site.canonicalOrigin);
    if (!new Set(["http:", "https:"]).has(canonical.protocol)) throw new Error();
  } catch {
    errors.push("src/data/site.json: Feld canonicalOrigin muss eine gültige HTTP(S)-URL sein.");
  }

  for (const value of duplicateValues(model.tags, "id")) {
    errors.push(`src/data/tags.json: doppelte Tag-ID "${value}".`);
  }
  for (const tag of model.tags) {
    if (!idPattern.test(tag.id ?? "")) {
      errors.push(`src/data/tags.json: Feld id des Tags "${tag.id}" ist ungültig.`);
    }
    if (!Number.isFinite(tag.order)) {
      errors.push(`src/data/tags.json: Feld order des Tags "${tag.id}" fehlt oder ist ungültig.`);
    }
  }

  for (const field of ["id", "slug"]) {
    for (const value of duplicateValues(model.portfolios, field)) {
      errors.push(`src/data/portfolios.json: doppeltes Feld ${field} "${value}".`);
    }
  }
  for (const portfolio of model.portfolios) {
    const label = `Portfolio "${portfolio.id ?? "?"}"`;
    if (!idPattern.test(portfolio.id ?? "")) {
      errors.push(`src/data/portfolios.json: ${label}, Feld id ist ungültig.`);
    }
    if (!idPattern.test(portfolio.slug ?? "")) {
      errors.push(`src/data/portfolios.json: ${label}, Feld slug ist ungültig.`);
    }
    if (!Array.isArray(portfolio.requiredTags) || !portfolio.requiredTags.length) {
      errors.push(`src/data/portfolios.json: ${label}, Feld requiredTags muss mindestens einen Tag enthalten.`);
    } else {
      if (new Set(portfolio.requiredTags).size !== portfolio.requiredTags.length) {
        errors.push(`src/data/portfolios.json: ${label}, Feld requiredTags enthält doppelte Tags.`);
      }
      for (const tagId of portfolio.requiredTags) {
        if (!tagIds.has(tagId)) {
          errors.push(`src/data/portfolios.json: ${label} verweist in requiredTags auf den unbekannten Tag "${tagId}".`);
        }
      }
    }
    if (!new Set(["any", "all"]).has(portfolio.match)) {
      errors.push(`src/data/portfolios.json: ${label}, Feld match muss "any" oder "all" sein.`);
    }
    if (typeof portfolio.enabled !== "boolean") {
      errors.push(`src/data/portfolios.json: ${label}, Feld enabled muss true oder false sein.`);
    }
    if (!Number.isFinite(portfolio.order)) {
      errors.push(`src/data/portfolios.json: ${label}, Feld order fehlt oder ist ungültig.`);
    }
    if (verifyImages && portfolio.previewImage && !existsSync(resolve(model.sourceRoot, portfolio.previewImage))) {
      errors.push(`src/data/portfolios.json: ${label}, Bild aus Feld previewImage fehlt: ${portfolio.previewImage}.`);
    }
  }

  for (const field of ["id", "slug"]) {
    for (const value of duplicateValues(model.projects, field)) {
      errors.push(`src/content/projects: doppeltes Projektfeld ${field} "${value}".`);
    }
  }
  for (const project of model.projects) {
    const file = project.sourceFile ?? `Projekt "${project.id ?? "?"}"`;
    for (const field of ["id", "slug", "coverImage"]) {
      if (typeof project[field] !== "string" || !project[field]) {
        errors.push(`${file}: Pflichtfeld ${field} fehlt.`);
      }
    }
    if (!idPattern.test(project.id ?? "")) errors.push(`${file}: Feld id ist ungültig.`);
    if (!idPattern.test(project.slug ?? "")) errors.push(`${file}: Feld slug ist ungültig.`);
    if (!Array.isArray(project.tags) || !project.tags.length) {
      errors.push(`${file}: Feld tags muss mindestens einen Tag enthalten.`);
    } else {
      if (new Set(project.tags).size !== project.tags.length) {
        errors.push(`${file}: Feld tags enthält doppelte Tags.`);
      }
      for (const tagId of project.tags) {
        if (!tagIds.has(tagId)) errors.push(`${file}: unbekannter Tag "${tagId}" in Feld tags.`);
      }
    }
    for (const field of ["published", "featured"]) {
      if (typeof project[field] !== "boolean") errors.push(`${file}: Feld ${field} muss true oder false sein.`);
    }
    if (!Number.isFinite(project.order)) errors.push(`${file}: Feld order fehlt oder ist ungültig.`);
    if (!Number.isFinite(project.year)) errors.push(`${file}: Feld year fehlt oder ist ungültig.`);
    if (verifyImages && project.coverImage && !existsSync(resolve(model.sourceRoot, project.coverImage))) {
      errors.push(`${file}: Bild aus Feld coverImage fehlt: ${project.coverImage}.`);
    }
    if (project.published && !hasProjectTranslation(project, model.defaultLocale)) {
      errors.push(`${file}: deutsche Projektübersetzung ${model.defaultLocale}.json fehlt.`);
    }
  }

  for (const field of ["code", "locale"]) {
    for (const value of duplicateValues(model.languages, field)) {
      errors.push(`src/data/languages.json: doppeltes Feld ${field} "${value}".`);
    }
  }
  for (const language of model.languages) {
    if (!/^[a-z]{2,3}$/.test(language.code ?? "")) {
      errors.push(`src/data/languages.json: Sprachcode "${language.code}" ist ungültig.`);
    }
    try {
      Intl.getCanonicalLocales(language.locale);
    } catch {
      errors.push(`src/data/languages.json: Gebietsschema "${language.locale}" ist ungültig.`);
    }
    if (!new Set(["published", "draft"]).has(language.status)) {
      errors.push(`src/data/languages.json: Sprache "${language.code}", Feld status ist ungültig.`);
    }
    if (!new Set(["ltr", "rtl"]).has(language.direction)) {
      errors.push(`src/data/languages.json: Sprache "${language.code}", Feld direction ist ungültig.`);
    }
    for (const field of ["nativeName", "flagAsset"]) {
      if (typeof language[field] !== "string" || !language[field]) {
        errors.push(`src/data/languages.json: Sprache "${language.code}", Pflichtfeld ${field} fehlt.`);
      }
    }
    if (!Number.isFinite(language.order)) {
      errors.push(`src/data/languages.json: Sprache "${language.code}", Feld order fehlt oder ist ungültig.`);
    }
    if (verifyImages && language.flagAsset && !existsSync(resolve(model.sourceRoot, language.flagAsset))) {
      errors.push(`src/data/languages.json: Sprache "${language.code}", Flagge fehlt: ${language.flagAsset}.`);
    }
  }
  if (!languageCodes.has(model.defaultLocale)) {
    errors.push(`src/data/site.json: defaultLanguage "${model.defaultLocale}" ist nicht registriert.`);
  } else if (
    model.languages.find((language) => language.code === model.defaultLocale)?.status
    !== "published"
  ) {
    errors.push(`src/data/site.json: defaultLanguage "${model.defaultLocale}" muss veröffentlicht sein.`);
  }
  return errors;
}

export function validateContentModel(model, options = {}) {
  const errors = collectContentErrors(model, options);
  if (errors.length) {
    throw new Error(`Inhaltsvalidierung fehlgeschlagen:\n- ${errors.join("\n- ")}`);
  }
}

export const currentModel = {
  site,
  sourceRoot,
  defaultLocale,
  languages,
  tags,
  portfolios,
  projects: allProjects,
};

export function validateProjectTranslations(projects, languageList = languages) {
  const errors = [];
  const requiredFields = ["title", "description", "imageAlt", "role", "content"];
  for (const project of projects.filter((entry) => entry.published)) {
    for (const language of languageList.filter((entry) => entry.status === "published")) {
      if (!hasProjectTranslation(project, language.code)) continue;
      const path = resolve(project.sourceDirectory, `${language.code}.json`);
      const text = getProjectText(project, language.code);
      for (const field of requiredFields) {
        if (text[field] === undefined || text[field] === "") {
          errors.push(`${path}: Pflichtfeld ${field} fehlt.`);
        }
      }
      if (!Array.isArray(text.content) || !text.content.length) {
        errors.push(`${path}: Feld content muss mindestens einen Abschnitt enthalten.`);
      }
    }
  }
  if (errors.length) {
    throw new Error(`Projekttext-Validierung fehlgeschlagen:\n- ${errors.join("\n- ")}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateContentModel(currentModel);
  validateProjectTranslations(allProjects);
  console.log("Inhaltsmodell und Projektübersetzungen sind gültig.");
}
