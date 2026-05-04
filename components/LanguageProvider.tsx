"use client";

import { createContext, useContext } from "react";
import { useParams } from "next/navigation";
import type { Locale, Dictionary } from "@/lib/i18n";
import enDict from "@/src/locales/en.json";
import frDict from "@/src/locales/fr.json";

const dicts: Record<Locale, Dictionary> = {
  en: enDict as Dictionary,
  fr: frDict as Dictionary,
};

interface LanguageContextValue {
  locale: Locale;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale: Locale = params?.lang === "fr" ? "fr" : "en";
  return (
    <LanguageContext.Provider value={{ locale, dict: dicts[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
