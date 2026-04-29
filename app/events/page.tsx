import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchApprovedEvents } from "@/lib/events";
import EventCalendar from "@/components/EventCalendar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

// Re-generate this page at most once per hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "National Event Calendar | ElevateIP Partners",
  description:
    "Upcoming IP workshops, webinars, and clinics from Canada's ElevateIP partner network — approved and curated for startup founders.",
};

export default async function EventsPage() {
  const events        = await fetchApprovedEvents();
  const intakeFormUrl = process.env.EVENTS_INTAKE_FORM_URL ?? "";

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-plum/8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-plum/60 hover:text-plum transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <span className="font-bold text-plum text-xl tracking-tight">
            ElevateIP<span className="text-magenta"> Partners</span>
          </span>
        </div>
      </header>

      <main className="flex-1">
        <PageTransition>
          <EventCalendar events={events} intakeFormUrl={intakeFormUrl} />
        </PageTransition>
      </main>

      <Footer />
    </div>
  );
}
