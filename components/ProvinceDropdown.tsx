"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, MapPin } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { PROVINCES, type Province } from "@/src/config/provinces";

export default function ProvinceDropdown() {
  const { dict } = useLanguage();
  const pd = dict.provinceDropdown as {
    placeholder: string;
    yourProgram: string;
    cta: string;
    listboxLabel: string;
  };
  const provinceNames = dict.provinceNames as Record<string, string>;

  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState<Province | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs  = useRef<(HTMLLIElement | null)[]>([]);

  const displayName = (id: string) => provinceNames[id] ?? id;

  const focusItem = (index: number) => {
    setFocusedIndex(index);
    itemRefs.current[index]?.focus();
  };

  const openList = useCallback((startIndex?: number) => {
    const idx = startIndex ?? (selected ? Math.max(0, PROVINCES.findIndex((p) => p.id === selected.id)) : 0);
    setFocusedIndex(idx);
    setOpen(true);
    requestAnimationFrame(() => { itemRefs.current[idx]?.focus(); });
  }, [selected]);

  const closeList = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => { buttonRef.current?.focus(); });
  }, []);

  const handleSelect = (p: Province) => {
    setSelected(p);
    closeList();
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      openList();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      openList(PROVINCES.length - 1);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        focusItem(Math.min(focusedIndex + 1, PROVINCES.length - 1));
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        focusItem(Math.max(focusedIndex - 1, 0));
        break;
      }
      case "Home": {
        e.preventDefault();
        focusItem(0);
        break;
      }
      case "End": {
        e.preventDefault();
        focusItem(PROVINCES.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < PROVINCES.length) {
          handleSelect(PROVINCES[focusedIndex]);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        closeList();
        break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">

      {/* ── Trigger ── */}
      <div className="relative w-full">
        <button
          ref={buttonRef}
          onClick={() => open ? closeList() : openList()}
          onKeyDown={handleButtonKeyDown}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border-2 border-plum/20 bg-white shadow-sm hover:border-plum/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-plum/30 transition-all duration-200 text-left group"
        >
          <span className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-magenta shrink-0" aria-hidden="true" />
            <span className={selected ? "text-plum font-semibold text-base" : "text-plum/50 text-base"}>
              {selected ? displayName(selected.id) : pd.placeholder}
            </span>
          </span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
            <ChevronDown className="w-5 h-5 text-plum/40 group-hover:text-plum/70 transition-colors" />
          </motion.span>
        </button>

        {/* ── List ── */}
        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              aria-label={pd.listboxLabel}
              onKeyDown={handleListKeyDown}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" as const }}
              className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-plum/10 overflow-hidden max-h-72 overflow-y-auto"
            >
              {PROVINCES.map((p, i) => {
                const isActive = selected?.id === p.id;
                return (
                  <li
                    key={p.id}
                    ref={(el) => { itemRefs.current[i] = el; }}
                    role="option"
                    aria-selected={isActive}
                    tabIndex={-1}
                    onClick={() => handleSelect(p)}
                    className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer text-sm transition-colors border-b border-plum/5 last:border-0 focus:outline-none focus:bg-plum/6 ${
                      isActive ? "bg-plum/4 text-plum font-semibold" : "text-plum/70 hover:bg-plum/3 hover:text-plum"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${isActive ? "bg-magenta" : "bg-plum/20"}`} aria-hidden="true" />
                    {displayName(p.id)}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* ── Confirmation card ── */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="w-full rounded-3xl bg-gradient-to-br from-plum-50 to-magenta-pale border border-plum/10 p-7 flex flex-col gap-5 shadow-sm"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-magenta font-semibold mb-1">
                {pd.yourProgram}
              </p>
              <h3 className="text-xl font-bold text-plum leading-snug">
                {selected.programName}
              </h3>
            </div>

            <a
              href={selected.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-plum/40 transition-all duration-200 group"
            >
              {pd.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
