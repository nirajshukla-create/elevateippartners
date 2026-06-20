"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const INTERVAL_MS = 7000;

/* ─── Variants ────────────────────────────────────────────── */
const textVariants = {
  enter:  { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0,  transition: { duration: 0.5, ease: "easeOut" as const } },
  exit:   { opacity: 0, y: -12, transition: { duration: 0.28, ease: "easeIn" as const } },
};

/* ─── Component ───────────────────────────────────────────── */
export default function SuccessBanner() {
  const { dict } = useLanguage();
  const ss = dict.successStories;
  const stories = ss.stories;

  const [active, setActive]     = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index === active) return;
    setActive(index);
    setTimerKey((k) => k + 1);
  }, [active]);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % stories.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [timerKey, stories.length]);

  const story = stories[active];

  return (
    <section className="py-16 md:py-28 px-6 bg-gradient-to-b from-white via-plum-50/30 to-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: text ── */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-8">
              {ss.eyebrow}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="flex flex-col gap-6"
              >
                {/* Company label */}
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-plum/35">
                  {story.company}
                </span>

                {/* Tagline */}
                <div className="pl-5 border-l-2 border-magenta/50">
                  <p className="text-2xl md:text-[1.65rem] font-bold text-plum leading-[1.32] tracking-tight">
                    {story.isQuote ? (
                      <>&ldquo;{story.tagline}&rdquo;</>
                    ) : (
                      story.tagline
                    )}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-plum/60 text-[15px] leading-[1.75]">
                  {story.summary}
                </p>

                {/* CTA */}
                {story.href !== "#" && (
                  <a
                    href={story.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 self-start text-sm font-semibold text-plum group hover:text-magenta transition-colors duration-200"
                  >
                    {ss.readFullStory}
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      aria-hidden="true"
                    />
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            {/* ── Dot indicators ── */}
            <div className="flex items-center gap-2.5 mt-10">
              {stories.map((s, i) => (
                <button
                  key={s.company}
                  onClick={() => goTo(i)}
                  aria-label={`View story: ${s.company}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-plum"
                      : "w-1.5 bg-plum/20 hover:bg-plum/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: image ── */}
          <div className="order-first lg:order-last">
            {/* padding-bottom: 75% = reliable 4:3 aspect ratio without aspect-ratio CSS */}
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-plum/10"
              style={{ paddingBottom: "75%" }}
            >
              <AnimatePresence mode="wait">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  key={active}
                  src={story.image}
                  alt={story.imageAlt}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.28, ease: "easeIn" as const } }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: story.objectPosition,
                  }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-plum/10 pointer-events-none" style={{ zIndex: 1 }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
