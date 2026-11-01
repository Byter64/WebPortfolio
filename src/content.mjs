import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const sourceRoot = dirname(fileURLToPath(import.meta.url));

export function readJson(relativePath) {
  const path = resolve(sourceRoot, relativePath);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path}: ungültiges oder nicht lesbares JSON (${error.message})`);
  }
}

export const site = readJson("data/site.json");
export const languages = readJson("data/languages.json").sort(
  (a, b) => a.order - b.order,
);
export const defaultLocale = site.defaultLanguage;
export const publishedLocales = languages.filter(
  (language) => language.status === "published",
);
export const tags = readJson("data/tags.json").sort(
  (a, b) => a.order - b.order,
);
export const portfolios = readJson("data/portfolios.json").sort(
  (a, b) => a.order - b.order,
);
export const activePortfolios = portfolios.filter(
  (portfolio) => portfolio.enabled,
);

const projectsRoot = resolve(sourceRoot, "content", "projects");
export const allProjects = readdirSync(projectsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => {
    const directory = resolve(projectsRoot, entry.name);
    const metadataPath = resolve(directory, "project.json");
    let metadata;
    try {
      metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
    } catch (error) {
      throw new Error(`${metadataPath}: ungültiges oder nicht lesbares JSON (${error.message})`);
    }
    return { ...metadata, sourceDirectory: directory, sourceFile: metadataPath };
  })
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

export const projects = allProjects.filter((project) => project.published);

export function projectTranslationPath(project, localeCode) {
  return resolve(project.sourceDirectory, `${localeCode}.json`);
}

export function hasProjectTranslation(project, localeCode) {
  return existsSync(projectTranslationPath(project, localeCode));
}

export function getProjectText(project, localeCode, onFallback = () => {}) {
  const requestedPath = projectTranslationPath(project, localeCode);
  const fallbackPath = projectTranslationPath(project, defaultLocale);
  const path = existsSync(requestedPath) ? requestedPath : fallbackPath;
  if (path !== requestedPath) {
    onFallback({ projectId: project.id, locale: localeCode, path: requestedPath });
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    throw new Error(`${path}: ungültiger oder nicht lesbarer Projekttext (${error.message})`);
  }
}

export function projectMatchesPortfolio(project, portfolio) {
  if (!portfolio.enabled) return false;
  if (portfolio.match === "all") {
    return portfolio.requiredTags.every((tagId) => project.tags.includes(tagId));
  }
  return portfolio.requiredTags.some((tagId) => project.tags.includes(tagId));
}

export function portfoliosForProject(project) {
  return activePortfolios.filter((portfolio) =>
    projectMatchesPortfolio(project, portfolio),
  );
}

export function projectsForPortfolio(portfolio) {
  return projects.filter((project) =>
    projectMatchesPortfolio(project, portfolio),
  );
}
