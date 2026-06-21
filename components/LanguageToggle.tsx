"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export default function LanguageToggle() {
  const { locale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(next: Locale) {
    if (next === locale) return;
    document.cookie = `ELEVATEIP_LOCALE=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.push(pathname.replace(/^\/(en|fr)/, `/${next}`));
  }

  return (
    <div
      className="flex items-center border border-plum/15 rounded-full overflow-hidden shrink-0"
      role="group"
      aria-label="Language selector"
    >
      {(["en", "fr"] as Locale[]).map((lng, i) => (
        <button
          key={lng}
          onClick={() => switchLocale(lng)}
          aria-pressed={locale === lng}
          aria-label={lng === "en" ? "Switch to English" : "Passer au français"}
          className={[
            "px-3 py-1.5 text-[11px] font-bold tracking-widest uppercase transition-all",
            i === 0 ? "" : "border-l border-plum/15",
            locale === lng
              ? "bg-plum text-white"
              : "text-plum/35 hover:text-plum/70 hover:bg-plum/4",
          ].join(" ")}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
