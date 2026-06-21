import type { Metadata } from "next";
import { fetchApprovedEvents } from "@/lib/events";
import EventCalendar from "@/components/EventCalendar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import SubpageHeader from "@/components/SubpageHeader";
import { getDictionary, hasLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "National Event Calendar | ElevateIP Partners",
  description:
    "Upcoming IP workshops, webinars, and clinics from Canada's ElevateIP partner network — approved and curated for startup founders.",
};

export default async function EventsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const events = await fetchApprovedEvents();
  const intakeFormUrl = process.env.EVENTS_INTAKE_FORM_URL ?? "";

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      <SubpageHeader backHref={`/${locale}`} backLabel={dict.nav.backToHome} />

      <main className="flex-1">
        <PageTransition>
          <EventCalendar events={events} intakeFormUrl={intakeFormUrl} />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
