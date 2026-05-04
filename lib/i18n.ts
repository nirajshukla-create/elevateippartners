import type enJson from "@/src/locales/en.json";

export type Locale = "en" | "fr";
export type Dictionary = typeof enJson;

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "ELEVATEIP_LOCALE";

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "fr") {
    return (await import("@/src/locales/fr.json")).default as Dictionary;
  }
  return (await import("@/src/locales/en.json")).default as Dictionary;
}
