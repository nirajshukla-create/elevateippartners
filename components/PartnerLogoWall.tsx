"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

const PARTNERS = [
  {
    name: "New Ventures BC",
    src: "/logos/new-ventures-bc.png",
    href: "https://www.newventuresbc.com/",
  },
  {
    name: "Innovate Calgary",
    src: "/logos/innovate-calgary.png",
    href: "https://innovatecalgary.com/",
  },
  {
    name: "North Forge",
    src: "/logos/north-forge.png",
    href: "https://www.northforge.ca/",
  },
  {
    name: "Communitech",
    src: "/logos/communitech.png",
    href: "https://communitech.ca/",
  },
  {
    name: "Invest Ottawa",
    src: "/logos/invest-ottawa.png",
    href: "https://www.investottawa.ca/",
  },
  {
    name: "MAIN",
    src: "/logos/main.png",
    href: "https://mainqc.com/",
    height: 130,
  },
  {
    name: "Springboard Atlantic",
    src: "/logos/springboard-atlantic.png",
    href: "https://springboardatlantic.ca/",
  },
];

/* Render the list twice so the marquee loops seamlessly */
const TRACK = [...PARTNERS, ...PARTNERS];

export default function PartnerLogoWall() {
  const { dict } = useLanguage();
  const pw = dict.partnerLogoWall;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-gradient-to-b from-peach-50 via-white to-peach-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
            {pw.eyebrow}
          </p>
          <h2 className="text-4xl font-bold text-plum leading-tight mb-3">
            {pw.heading}
          </h2>
          <p className="text-plum/50 text-base max-w-md mx-auto leading-7">
            {pw.body}
          </p>
        </motion.div>
      </div>

      {/* Marquee track — full bleed, no max-w constraint */}
      <div className="relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-peach-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-peach-50 to-transparent z-10" />

        {/* Scrolling row */}
        <div className="flex animate-marquee w-max gap-6 px-6">
          {TRACK.map(({ name, src, href, height }, i) => (
            <a
              key={`${name}-${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex-shrink-0 flex items-center justify-center rounded-2xl px-8 py-6 bg-white/70 border border-plum/6 hover:border-plum/14 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={name}
                style={{
                  height: `${height ?? 80}px`,
                  width: "auto",
                  mixBlendMode: "multiply",
                }}
                className="opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300 ease-out"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
