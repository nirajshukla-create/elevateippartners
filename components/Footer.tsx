"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Link data ──────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Home",              href: "/" },
  { label: "Regional Programs", href: "/#find-program" },
  { label: "Resources",         href: "/#resources" },
  { label: "Partners",          href: "/partners" },
  { label: "Events",            href: "/events" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Accessibility",  href: "#" },
  { label: "Contact Us",     href: "#" },
];

const REGIONAL_SITES = [
  { label: "Atlantic",           href: "https://springboardatlantic.ca/ipadvantage/" },
  { label: "Quebec",             href: "https://mainqc.com/en/intellectual-property-support/" },
  { label: "Ontario & Prairies", href: "https://elevate-ip.ca/" },
  { label: "Alberta",            href: "https://elevateip-ab.com/" },
  { label: "BC & Territories",   href: "https://www.accelerateip.ca/" },
];

/* ─── IP Facts carousel data ─────────────────────────────── */
function Stat({ children }: { children: React.ReactNode }) {
  return <span className="text-peach font-bold">{children}</span>;
}

const FACTS: { id: number; content: React.ReactNode }[] = [
  {
    id: 0,
    content: (
      <>
        SMEs owning IP are <Stat>60% more likely</Stat> to be high-growth
        SMEs and <Stat>4 times more likely</Stat> to export.
      </>
    ),
  },
  {
    id: 1,
    content: (
      <>
        Canadian SMEs holding registered IP rights are{" "}
        <Stat>3 times more likely</Stat> to have expanded domestically and{" "}
        <Stat>4.3 times more likely</Stat> to have expanded internationally.
      </>
    ),
  },
];

const INTERVAL_MS = 6000;

const variants = {
  enter:  { opacity: 0, y: -12 },
  center: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: "easeOut"  as const } },
  exit:   { opacity: 0, y: 12, transition: { duration: 0.30, ease: "easeIn"   as const } },
};

/* ─── Shared class strings ───────────────────────────────── */
const COL_HEADER = "text-white/30 text-xs uppercase tracking-widest font-semibold mb-1";
// py-3 = 24px padding + ~20px text = 44px touch target
const COL_LINK   = "block text-white/60 text-sm hover:text-white transition-colors py-3";

/* ─── Component ──────────────────────────────────────────── */
export default function Footer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey,    setTimerKey]    = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % FACTS.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [timerKey]);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setTimerKey((k) => k + 1);
  };

  return (
    <footer className="relative bg-plum">
      {/* Peach accent rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-peach/60 to-transparent" />

      {/* ── Top section ──────────────────────────────────── */}
      <div className="px-6 py-12 border-b border-white/8">
        {/*
          Mobile:  3-col grid — IP Facts spans all 3 cols (full width),
                   then Site / Legal / Regional each take 1 col in the next row.
          Desktop: 12-col grid — IP Facts = 6, Site = 2, Legal = 2, Regional = 2.
        */}
        <div className="max-w-6xl mx-auto grid grid-cols-3 md:grid-cols-12 gap-y-10 gap-x-4 md:gap-6 items-start">

          {/* ── IP Facts (full width on mobile, 6-col on desktop) ── */}
          <div className="col-span-3 md:col-span-6 flex flex-col gap-4 md:pr-10 md:border-r md:border-white/8">
            <p className={COL_HEADER}>IP by the Numbers</p>

            <div className="relative pl-4 border-l-2 border-peach/35 min-h-[6rem] md:min-h-[5.5rem] overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={activeIndex}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-sm md:text-base text-white/75 leading-relaxed"
                >
                  {FACTS[activeIndex].content}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="pl-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {FACTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to fact ${i + 1}`}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === activeIndex ? "w-6 bg-peach" : "w-1 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-semibold text-white/20 tabular-nums tracking-widest">
                0{activeIndex + 1}&nbsp;/&nbsp;0{FACTS.length}
              </span>
            </div>
          </div>

          {/* ── Site ── */}
          <div className="md:col-span-2 flex flex-col">
            <p className={COL_HEADER}>Site</p>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className={COL_LINK}>
                {label}
              </a>
            ))}
          </div>

          {/* ── Legal ── */}
          <div className="md:col-span-2 flex flex-col">
            <p className={COL_HEADER}>Legal</p>
            {LEGAL_LINKS.map(({ label, href }) => (
              <a key={label} href={href} className={COL_LINK}>
                {label}
              </a>
            ))}
          </div>

          {/* ── Regional Sites ── */}
          <div className="md:col-span-2 flex flex-col">
            <p className={COL_HEADER}>Regional Sites</p>
            {REGIONAL_SITES.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${COL_LINK} flex items-center gap-1.5`}
              >
                {label}
                <ExternalLink className="w-3 h-3 opacity-50 shrink-0" />
              </a>
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────── */}
      <div className="bg-white/95 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-plum/50 text-xs leading-5 max-w-md text-center sm:text-left">
            Elevate IP is a federally funded, national project to help business
            accelerators and incubators (BAIs) provide the tools Canadian
            startups need to understand, strategically manage and leverage
            their intellectual property.
          </p>
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ised-logo.png"
              alt="Innovation, Science and Economic Development Canada / Innovation, Sciences et Développement économique Canada"
              style={{ height: "72px", width: "auto" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
