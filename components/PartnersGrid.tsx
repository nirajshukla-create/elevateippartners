"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Dictionary } from "@/lib/i18n";

/* ─── Types ──────────────────────────────────────────────── */

type BadgeType    = "Federal" | "Provincial" | "Non-Profit" | "Professional";
type BadgeSubtype = "Collaboration" | "Grants" | "Marketplace";

interface Partner {
  id: string;
  name: string;
  type: BadgeType;
  subtype?: BadgeSubtype;
  description: string;
  href: string;
}

/* ─── Badges ─────────────────────────────────────────────── */

const TYPE_STYLES: Record<BadgeType, string> = {
  Federal:      "bg-plum/8 text-plum",
  Provincial:   "bg-magenta/8 text-magenta",
  "Non-Profit": "bg-peach/15 text-peach",
  Professional: "bg-plum/5 text-plum/60",
};

const SUBTYPE_STYLES: Record<BadgeSubtype, string> = {
  Collaboration: "bg-teal-50 text-teal-700",
  Grants:        "bg-amber-50 text-amber-700",
  Marketplace:   "bg-indigo-50 text-indigo-700",
};

function Badges({
  type,
  subtype,
  dict,
}: {
  type: BadgeType;
  subtype?: BadgeSubtype;
  dict: Dictionary;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${TYPE_STYLES[type]}`}>
        {dict.partners.badgeTypes[type]}
      </span>
      {subtype && (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${SUBTYPE_STYLES[subtype]}`}>
          {dict.partners.badgeSubtypes[subtype]}
        </span>
      )}
    </div>
  );
}

/* ─── Card ───────────────────────────────────────────────── */

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
};

function PartnerCard({
  partner,
  index,
  dict,
}: {
  partner: Partner;
  index: number;
  dict: Dictionary;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="group flex flex-col gap-5 rounded-3xl border border-plum/8 bg-white p-8 hover:shadow-xl hover:border-plum/16 hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-col gap-3 flex-1">
        <Badges type={partner.type} subtype={partner.subtype} dict={dict} />
        <h2 className="text-base font-bold text-plum leading-snug">
          {partner.name}
        </h2>
        <p className="text-sm text-plum/50 leading-6 flex-1">
          {partner.description}
        </p>
      </div>

      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full border-2 border-plum text-plum text-xs font-semibold hover:bg-plum hover:text-white transition-all duration-200"
      >
        {dict.partners.visitWebsite}
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </motion.div>
  );
}

/* ─── Grid ───────────────────────────────────────────────── */

export default function PartnersGrid() {
  const { dict } = useLanguage();
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const partners = dict.partners.list as Partner[];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {partners.map((partner, i) => (
        <PartnerCard key={partner.id} partner={partner} index={i} dict={dict} />
      ))}
    </motion.div>
  );
}
