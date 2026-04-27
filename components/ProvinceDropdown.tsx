"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, MapPin } from "lucide-react";

interface Region {
  label: string;
  partner: string;
  tagline: string;
  url: string;
  provinces: string[];
}

const REGIONS: Region[] = [
  {
    label: "Atlantic Canada",
    partner: "Springboard Atlantic – IP Advantage",
    tagline: "Supporting innovation across the Atlantic provinces.",
    url: "https://springboardatlantic.ca/ipadvantage/",
    provinces: [
      "Nova Scotia",
      "New Brunswick",
      "Prince Edward Island",
      "Newfoundland and Labrador",
    ],
  },
  {
    label: "Quebec",
    partner: "MAIN – Intellectual Property Support",
    tagline: "Guiding Québec startups through their IP journey.",
    url: "https://mainqc.com/en/intellectual-property-support/",
    provinces: ["Quebec"],
  },
  {
    label: "Ontario & Prairies",
    partner: "ElevateIP",
    tagline: "Serving Ontario, Manitoba, Ottawa, and Saskatchewan.",
    url: "https://elevate-ip.ca/",
    provinces: ["Ontario", "Manitoba", "Ottawa", "Saskatchewan"],
  },
  {
    label: "Alberta",
    partner: "ElevateIP Alberta",
    tagline: "Accelerating IP strategy for Alberta's startup ecosystem.",
    url: "https://elevateip-ab.com/",
    provinces: ["Alberta"],
  },
  {
    label: "BC & Territories",
    partner: "AccelerateIP",
    tagline: "Serving BC, Yukon, Nunavut, and the Northwest Territories.",
    url: "https://www.accelerateip.ca/",
    provinces: [
      "British Columbia",
      "Yukon",
      "Nunavut",
      "Northwest Territories",
    ],
  },
];

const ALL_OPTIONS = REGIONS.flatMap((r) =>
  r.provinces.map((p) => ({ province: p, region: r }))
).sort((a, b) => a.province.localeCompare(b.province));

export default function ProvinceDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof ALL_OPTIONS)[0] | null>(
    null
  );

  const handleSelect = (option: (typeof ALL_OPTIONS)[0]) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      {/* Dropdown trigger */}
      <div className="relative w-full">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border-2 border-plum/20 bg-white shadow-sm hover:border-plum/40 hover:shadow-md transition-all duration-200 text-left group"
        >
          <span className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-magenta shrink-0" />
            <span
              className={
                selected
                  ? "text-plum font-semibold text-base"
                  : "text-plum/50 text-base"
              }
            >
              {selected ? selected.province : "Select your province or territory…"}
            </span>
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-plum/40 group-hover:text-plum/70 transition-colors" />
          </motion.span>
        </button>

        {/* Dropdown list */}
        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" as const }}
              className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-plum/10 overflow-hidden max-h-72 overflow-y-auto"
            >
              {ALL_OPTIONS.map((opt) => (
                <li
                  key={opt.province}
                  role="option"
                  aria-selected={selected?.province === opt.province}
                  onClick={() => handleSelect(opt)}
                  className="flex items-center gap-3 px-5 py-3.5 cursor-pointer text-plum text-sm hover:bg-plum-50 transition-colors border-b border-plum/5 last:border-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-magenta/40 shrink-0" />
                  <span className="font-medium">{opt.province}</span>
                  <span className="ml-auto text-plum/40 text-xs">
                    {opt.region.label}
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Selected region card */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.province}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="w-full rounded-3xl bg-gradient-to-br from-plum-50 to-magenta-pale border border-plum/10 p-7 flex flex-col gap-5 shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-magenta font-semibold mb-1">
                Your Regional Partner
              </p>
              <h3 className="text-xl font-bold text-plum leading-snug">
                {selected.region.partner}
              </h3>
              <p className="text-plum/60 text-sm mt-1">
                {selected.region.tagline}
              </p>
            </div>

            <a
              href={selected.region.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              Continue to Regional Site
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
