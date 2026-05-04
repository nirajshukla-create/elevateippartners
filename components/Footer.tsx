"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const INTERVAL_MS = 6000;

const variants = {
  enter:  { opacity: 0, y: -12 },
  center: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: "easeOut" as const } },
  exit:   { opacity: 0, y: 12, transition: { duration: 0.30, ease: "easeIn"  as const } },
};

const COL_HEADER = "text-white/30 text-xs uppercase tracking-widest font-semibold mb-1";
const COL_LINK   = "block text-white/60 text-sm hover:text-white transition-colors py-3";

function Stat({ children }: { children: React.ReactNode }) {
  return <span className="text-peach font-bold">{children}</span>;
}

const REGIONAL_SITE_HREFS = [
  "https://springboardatlantic.ca/ipadvantage/",
  "https://mainqc.com/en/intellectual-property-support/",
  "https://elevate-ip.ca/",
  "https://elevateip-ab.com/",
  "https://www.accelerateip.ca/",
];

export default function Footer() {
  const { locale, dict } = useLanguage();
  const f = dict.footer;
  const l = locale;

  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey,    setTimerKey]    = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % f.ipFacts.facts.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [timerKey, f.ipFacts.facts.length]);

  const goTo = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    setTimerKey((k) => k + 1);
  };

  const navLinks = [
    { label: f.links.home,            href: `/${l}` },
    { label: f.links.regionalPrograms, href: `/${l}#find-program` },
    { label: f.links.resources,        href: `/${l}#resources` },
    { label: f.links.partners,         href: `/${l}/partners` },
    { label: f.links.events,           href: `/${l}/events` },
  ];

  const legalLinks = [
    { label: f.links.privacyPolicy, href: "#" },
    { label: f.links.accessibility,  href: "#" },
    { label: f.links.contactUs,      href: "#" },
  ];

  const regionalLabels = [
    f.links.atlantic,
    f.links.quebec,
    f.links.ontario,
    f.links.alberta,
    f.links.bc,
  ];

  const currentFact = f.ipFacts.facts[activeIndex];

  return (
    <footer className="relative bg-plum">
      {/* Peach accent rule */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-peach/60 to-transparent" />

      {/* ── Top section ──────────────────────────────────── */}
      <div className="px-6 py-12 border-b border-white/8">
        <div className="max-w-6xl mx-auto grid grid-cols-3 md:grid-cols-12 gap-y-10 gap-x-4 md:gap-6 items-start">

          {/* ── IP Facts ── */}
          <div className="col-span-3 md:col-span-6 flex flex-col gap-4 md:pr-10 md:border-r md:border-white/8">
            <p className={COL_HEADER}>{f.ipFacts.heading}</p>

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
                  {currentFact.map((seg, i) =>
                    seg.highlight ? (
                      <Stat key={i}>{seg.text}</Stat>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    )
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="pl-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {f.ipFacts.facts.map((_, i) => (
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
                0{activeIndex + 1}&nbsp;/&nbsp;0{f.ipFacts.facts.length}
              </span>
            </div>
          </div>

          {/* ── Site ── */}
          <div className="md:col-span-2 flex flex-col">
            <p className={COL_HEADER}>{f.columns.site}</p>
            {navLinks.map(({ label, href }) => (
              <a key={label} href={href} className={COL_LINK}>
                {label}
              </a>
            ))}
          </div>

          {/* ── Legal ── */}
          <div className="md:col-span-2 flex flex-col">
            <p className={COL_HEADER}>{f.columns.legal}</p>
            {legalLinks.map(({ label, href }) => (
              <a key={label} href={href} className={COL_LINK}>
                {label}
              </a>
            ))}
          </div>

          {/* ── Regional Sites ── */}
          <div className="md:col-span-2 flex flex-col">
            <p className={COL_HEADER}>{f.columns.regionalSites}</p>
            {regionalLabels.map((label, i) => (
              <a
                key={label}
                href={REGIONAL_SITE_HREFS[i]}
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
            {f.disclaimer}
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
