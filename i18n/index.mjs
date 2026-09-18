import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defaultLocale, locales, publishedLocales } from "./config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const bundles = new Map(
  locales.map((locale) => {
    const path = resolve(root, "locales", `${locale.code}.json`);
    const bundle = JSON.parse(readFileSync(path, "utf8"));
    if (bundle._meta?.locale !== locale.code) {
      throw new Error(`${path}: _meta.locale muss ${locale.code} sein.`);
    }
    return [locale.code, bundle];
  }),
);

function getValue(object, key) {
  return key.split(".").reduce((value, segment) => value?.[segment], object);
}

function mergeWithFallback(fallback, localized) {
  if (Array.isArray(fallback)) {
    return Array.isArray(localized) ? localized : fallback;
  }
  if (!fallback || typeof fallback !== "object") {
    return localized ?? fallback;
  }

  const result = {};
  for (const key of new Set([
    ...Object.keys(fallback),
    ...Object.keys(localized ?? {}),
  ])) {
    result[key] = mergeWithFallback(fallback[key], localized?.[key]);
  }
  return result;
}

function interpolate(value, variables) {
  return String(value).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) =>
    variables[key] === undefined ? "" : String(variables[key]),
  );
}

export function getLocaleConfig(localeCode) {
  return locales.find((locale) => locale.code === localeCode) ?? null;
}

export function isKnownLocale(localeCode) {
  return getLocaleConfig(localeCode) !== null;
}

export function getPublishedLocaleCodes() {
  return publishedLocales.map((locale) => locale.code);
}

export function createI18n(localeCode, onFallback = () => {}) {
  const locale = getLocaleConfig(localeCode);
  if (!locale || locale.status !== "published") {
    throw new Error(`Unbekannte oder nicht veröffentlichte Sprache: ${localeCode}`);
  }

  const fallbackBundle = bundles.get(defaultLocale);
  const currentBundle = bundles.get(localeCode);

  return {
    locale,
    t(key, variables = {}) {
      const current = getValue(currentBundle, key);
      if (current !== undefined && current !== null && current !== "") {
        return interpolate(current, variables);
      }

      const fallback = getValue(fallbackBundle, key);
      if (fallback === undefined || fallback === null) {
        onFallback({ key, locale: localeCode, missingInFallback: true });
        return "";
      }

      if (localeCode !== defaultLocale) {
        onFallback({ key, locale: localeCode, missingInFallback: false });
      }
      return interpolate(fallback, variables);
    },
    object(key) {
      const fallback = getValue(fallbackBundle, key);
      const current = getValue(currentBundle, key);
      if (current === undefined && localeCode !== defaultLocale) {
        onFallback({ key, locale: localeCode, missingInFallback: false });
      }
      return mergeWithFallback(fallback, current);
    },
    hasOwnTranslation(key) {
      const value = getValue(currentBundle, key);
      return value !== undefined && value !== null && value !== "";
    },
    formatNumber(value, options = {}) {
      return new Intl.NumberFormat(locale.locale, options).format(value);
    },
  };
}

export function flattenTranslationKeys(value, prefix = "") {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) =>
      flattenTranslationKeys(entry, `${prefix}.${index}`),
    );
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, entry]) => {
      if (key.startsWith("_")) return [];
      return flattenTranslationKeys(entry, prefix ? `${prefix}.${key}` : key);
    });
  }

  return value === null || value === "" ? [] : [prefix];
}

export function getTranslationReport(localeCode) {
  const referenceKeys = new Set(
    flattenTranslationKeys(bundles.get(defaultLocale)),
  );
  const localeKeys = new Set(flattenTranslationKeys(bundles.get(localeCode)));

  return {
    missing: [...referenceKeys].filter((key) => !localeKeys.has(key)).sort(),
    unused: [...localeKeys].filter((key) => !referenceKeys.has(key)).sort(),
  };
}
