"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, CalendarDays, Send } from "lucide-react";
import type { CalendarEvent } from "@/lib/events";
import SubmitEventModal from "@/components/SubmitEventModal";

/* ─── Static data ────────────────────────────────────── */

const PARTNER_LOGOS: Record<string, string> = {
  "Springboard Atlantic": "/logos/springboard-atlantic.png",
  "MAIN":                 "/logos/main.png",
  "Communitech":          "/logos/communitech.png",
  "Invest Ottawa":        "/logos/invest-ottawa.png",
  "North Forge":          "/logos/north-forge.png",
  "Innovate Calgary":     "/logos/innovate-calgary.png",
  "New Ventures BC":      "/logos/new-ventures-bc.png",
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/* ─── Helpers ────────────────────────────────────────── */

function parseDateParts(isoDate: string) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const jsDate = new Date(y, m - 1, d);
  return {
    day:       String(d).padStart(2, "0"),
    dayAbbr:   DAY_ABBR[jsDate.getDay()],
    monthAbbr: MONTH_NAMES[m - 1].slice(0, 3).toUpperCase(),
    monthYear: `${MONTH_NAMES[m - 1]} ${y}`,
    sortKey:   `${y}-${String(m).padStart(2, "0")}`,
  };
}

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

/* ─── Sub-components ─────────────────────────────────── */

function PartnerLogo({ name, url }: { name: string; url: string }) {
  const src = url || PARTNER_LOGOS[name] || "";
  if (src) {
    return (
      <div className="relative h-6 w-24 shrink-0">
        <Image
          src={src}
          alt={name}
          fill
          className="object-contain object-left"
          unoptimized
        />
      </div>
    );
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-plum to-magenta flex items-center justify-center shrink-0">
      <span className="text-white text-[10px] font-bold leading-none">{initials}</span>
    </div>
  );
}

function EventCard({
  event,
  index,
  isPast,
}: {
  event: CalendarEvent;
  index: number;
  isPast: boolean;
}) {
  const parts = parseDateParts(event.date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: index * 0.05, duration: 0.4, ease: "easeOut" as const },
      }}
      className={`group flex items-stretch bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
        isPast
          ? "border-plum/6 opacity-50 hover:opacity-70"
          : "border-plum/8 hover:border-plum/18 hover:shadow-lg"
      }`}
    >
      {/* Date column */}
      <div className="flex flex-col items-center justify-center gap-0.5 px-5 py-6 border-r border-plum/8 min-w-[72px] shrink-0 text-center bg-plum-50/60">
        <span className="text-2xl font-bold text-plum leading-none">{parts.day}</span>
        <span className="text-[10px] font-bold text-magenta/70 tracking-widest uppercase mt-1">
          {parts.dayAbbr}
        </span>
        <span className="text-[10px] font-semibold text-plum/40 tracking-widest uppercase">
          {parts.monthAbbr}
        </span>
        {isPast && (
          <span className="mt-2 text-[9px] font-bold uppercase tracking-widest text-plum/30 bg-plum/6 rounded-full px-1.5 py-0.5">
            Past
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1 min-w-0">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base font-bold text-plum leading-snug group-hover:text-magenta transition-colors line-clamp-2">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-sm text-plum/50 leading-6 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between gap-4 flex-wrap mt-auto pt-1">
          <div className="flex items-center gap-2 min-w-0">
            <PartnerLogo name={event.partner_name} url={event.partner_logo_url} />
            {event.partner_name && (
              <span className="text-xs text-plum/45 font-medium truncate">
                {event.partner_name}
              </span>
            )}
          </div>

          {event.registration_url && (
            <a
              href={event.registration_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum text-white text-xs font-semibold hover:bg-plum-dark transition-colors shadow-sm shrink-0"
            >
              Register
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────── */

interface Props {
  events: CalendarEvent[];
  intakeFormUrl: string;
}

export default function EventCalendar({ events, intakeFormUrl }: Props) {
  const today = todayISO();
  const [activeMonth, setActiveMonth]   = useState<string | null>(null);
  const [modalOpen, setModalOpen]       = useState(false);

  // Group events by month, preserving sort order.
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; events: CalendarEvent[] }>();
    for (const e of events) {
      const parts = parseDateParts(e.date);
      if (!map.has(parts.sortKey)) {
        map.set(parts.sortKey, { label: parts.monthYear, events: [] });
      }
      map.get(parts.sortKey)!.events.push(e);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  // Default to the first month that contains a future event; fall back to first month.
  const defaultMonth = useMemo(() => {
    const futureGroup = grouped.find(([, g]) =>
      g.events.some((e) => e.date >= today)
    );
    return futureGroup?.[0] ?? grouped[0]?.[0] ?? null;
  }, [grouped, today]);

  const currentKey   = activeMonth ?? defaultMonth;
  const currentGroup = grouped.find(([key]) => key === currentKey);

  return (
    <section className="py-16 md:py-28 px-6 bg-white">
      <div className="max-w-4xl mx-auto">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
            National Event Calendar
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-plum leading-tight mb-4">
            Upcoming IP Events
          </h1>
          <p className="text-plum/50 text-base max-w-lg mx-auto leading-7 mb-6">
            Workshops, webinars, and clinics from Canada&apos;s ElevateIP partner
            network — approved and curated for startup founders.
          </p>

          {/* Partner submission */}
          {intakeFormUrl ? (
            <a
              href={intakeFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-plum/40 hover:text-magenta transition-colors font-medium"
            >
              <Send className="w-3.5 h-3.5" />
              Are you an ElevateIP Partner? Submit an event here
            </a>
          ) : (
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm text-plum/40 hover:text-magenta transition-colors font-medium"
            >
              <Send className="w-3.5 h-3.5" />
              Are you an ElevateIP Partner? Submit an event here
            </button>
          )}

          <SubmitEventModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>

        {/* ── Empty state ── */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-plum-50 flex items-center justify-center mb-5">
              <CalendarDays className="w-7 h-7 text-plum/30" />
            </div>
            <h3 className="text-xl font-bold text-plum mb-2">No upcoming events</h3>
            <p className="text-plum/45 text-sm max-w-xs leading-6">
              There are no approved events scheduled right now. Check back soon,
              or submit yours above.
            </p>
          </div>
        ) : (
          <>
            {/* ── Month filter tabs ── */}
            {grouped.length > 1 && (
              <div className="flex gap-2 flex-wrap mb-10">
                {grouped.map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => setActiveMonth(key)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                      key === currentKey
                        ? "bg-plum text-white border-plum shadow-md"
                        : "bg-white text-plum/60 border-plum/15 hover:border-plum/30 hover:text-plum"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {/* ── Event list ── */}
            <AnimatePresence mode="wait">
              {currentGroup && (
                <motion.div
                  key={currentKey}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <h2 className="text-sm font-bold uppercase tracking-widest text-plum/30 mb-6">
                    {currentGroup[1].label}
                  </h2>
                  <div className="flex flex-col gap-4">
                    {currentGroup[1].events.map((event, i) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        index={i}
                        isPast={event.date < today}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

      </div>
    </section>
  );
}
