export const defaultLocale = "de";

export const locales = [
  { code: "de", locale: "de-DE", nativeName: "Deutsch", flagAsset: "assets/flags/de.svg", direction: "ltr", status: "published" },
  { code: "en", locale: "en-GB", nativeName: "English", flagAsset: "assets/flags/gb.svg", direction: "ltr", status: "published" },
  { code: "es", locale: "es-ES", nativeName: "Español", flagAsset: "assets/flags/es.svg", direction: "ltr", status: "published" },
  { code: "ja", locale: "ja-JP", nativeName: "日本語", flagAsset: "assets/flags/ja.svg", direction: "ltr", status: "published" },
];

export const publishedLocales = locales.filter(
  (locale) => locale.status === "published",
);
