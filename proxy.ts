import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOCALES = ["en", "fr"] as const;
const DEFAULT_LOCALE = "en";
const LOCALE_COOKIE = "ELEVATEIP_LOCALE";

const DOMAIN_LOCALES: Record<string, (typeof LOCALES)[number]> = {
  "eleverlapicanada.ca": "fr",
  "www.eleverlapicanada.ca": "fr",
  "elevateipcanada.ca": "en",
  "www.elevateipcanada.ca": "en",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const host = request.headers.get("host")?.toLowerCase().split(":")[0] ?? "";
  const domainLocale = DOMAIN_LOCALES[host] ?? DEFAULT_LOCALE;

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && (LOCALES as readonly string[]).includes(cookieLocale)
      ? cookieLocale
      : domainLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)",
  ],
};
