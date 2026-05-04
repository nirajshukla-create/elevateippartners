import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { LanguageProvider } from "@/components/LanguageProvider";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fr" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <LanguageProvider>{children}</LanguageProvider>;
}
