"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Stat highlight sub-component ─────────────────────── */
function Stat({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-peach font-bold">{children}</span>
  );
}

/* ─── Facts data ────────────────────────────────────────── */
const FACTS: { id: number; content: React.ReactNode }[] = [
  {
    id: 0,
    content: (
      <>
        SMEs owning IP are <Stat>60% more likely</Stat> to be high-growth SMEs
        and <Stat>4 times more likely</Stat> to export.
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

/* ─── Animation variants ────────────────────────────────── */
const variants = {
  enter: {
    opacity: 0,
    y: -20,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.35, ease: "easeIn" as const },
  },
};

/* ─── Component ─────────────────────────────────────────── */
export default function IPFactCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);

  // Auto-advance — resets whenever timerKey changes (e.g. manual navigation)
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
    <section className="bg-plum px-6 py-20 md:py-28 relative overflow-hidden">
      {/* Peach accent line at top — mirrors the footer top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-peach/50 to-transparent" />

      {/* Subtle decorative background ring */}
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/4 pointer-events-none" />
      <div className="absolute -right-24 top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/4 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-10 md:gap-12">

          {/* Section label */}
          <div className="flex items-center gap-3">
            <div className="h-px w-6 bg-peach/40" />
            <p className="text-xs font-bold uppercase tracking-widest text-white/30">
              IP by the Numbers
            </p>
          </div>

          {/* Fact area — fixed min-height prevents layout shift during transition */}
          <div className="relative pl-5 md:pl-7 border-l-2 border-peach/40 min-h-[8rem] md:min-h-[7rem] flex items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeIndex}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white/85 leading-relaxed tracking-tight"
              >
                {FACTS[activeIndex].content}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Navigation row */}
          <div className="pl-5 md:pl-7 flex items-center justify-between">
            {/* Pill-style progress dots */}
            <div className="flex items-center gap-2">
              {FACTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to fact ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-peach"
                      : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <span className="text-xs font-semibold text-white/25 tabular-nums tracking-widest">
              0{activeIndex + 1} / 0{FACTS.length}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
