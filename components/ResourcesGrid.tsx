"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Lightbulb, Calendar, Award } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const ICONS = [BookOpen, Lightbulb, Calendar, Award];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function ResourcesGrid() {
  const { locale, dict } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {dict.resources.items.map(({ category, title, desc, href, cta }, i) => {
        const Icon = ICONS[i];
        const isExternal = !!href && href.startsWith("http");
        const resolvedHref = href
          ? isExternal ? href : `/${locale}${href}`
          : undefined;
        return (
          <motion.a
            key={title}
            href={resolvedHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            variants={fadeUp}
            className="group flex gap-5 rounded-3xl border border-plum/8 bg-white p-7 hover:shadow-lg hover:border-plum/16 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-peach-pale to-magenta-pale flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-magenta" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-peach">
                {category}
              </span>
              <h3 className="text-base font-bold text-plum leading-snug">{title}</h3>
              <p className="text-plum/50 text-sm leading-6">{desc}</p>
              {cta && (
                <span className="mt-1 text-xs font-semibold text-magenta group-hover:underline">
                  {cta}
                </span>
              )}
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
