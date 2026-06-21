"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Shield,
  ArrowRight,
  TrendingUp,
  Globe,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import ProvinceDropdown from "@/components/ProvinceDropdown";
import Footer from "@/components/Footer";
import PartnerLogoWall from "@/components/PartnerLogoWall";
import NationalGlobe from "@/components/NationalGlobe";
import LanguageToggle from "@/components/LanguageToggle";
import SuccessBanner from "@/components/SuccessBanner";
import { useLanguage } from "@/components/LanguageProvider";

/* ─── Animation helpers ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function InView({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Icon maps (order matches locale JSON arrays) ───── */
const VALUE_ICONS = [Shield, TrendingUp, Globe];

/* ─────────────────────────────────────────────────────── */

export default function Home() {
  const { locale, dict } = useLanguage();
  const d = dict;
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: d.nav.about, href: `/${locale}#about`, external: false },
    { label: d.nav.findProgram, href: `/${locale}#find-program`, external: false },
    { label: d.nav.resources, href: `/${locale}/resources`, external: false },
    { label: d.nav.partners, href: `/${locale}/partners`, external: false },
    { label: d.nav.events, href: d.nav.eventsHref, external: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-plum">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-plum/8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-plum text-xl tracking-tight">
              ElevateIP<span className="text-magenta"> Partners</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-plum/60 font-medium">
            <a href={`/${locale}#about`} className="hover:text-plum transition-colors">
              {d.nav.about}
            </a>
            <a href={`/${locale}#find-program`} className="hover:text-plum transition-colors">
              {d.nav.findProgram}
            </a>
            <a href={`/${locale}/resources`} className="hover:text-plum transition-colors">
              {d.nav.resources}
            </a>
            <a href={`/${locale}/partners`} className="hover:text-plum transition-colors">
              {d.nav.partners}
            </a>
            <a
              href={d.nav.eventsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-plum transition-colors"
            >
              {d.nav.events}
            </a>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <a
              href={`/${locale}#find-program`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark transition-colors shadow-sm"
            >
              {d.nav.getStarted} <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="w-9 h-9 flex items-center justify-center rounded-full text-plum/70 hover:text-plum hover:bg-plum/6 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden overflow-hidden border-t border-plum/8"
            >
              <nav className="max-w-7xl mx-auto flex flex-col py-3 text-base text-plum/70 font-medium">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="px-2 py-3 hover:text-plum transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href={`/${locale}#find-program`}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark transition-colors shadow-sm"
                >
                  {d.nav.getStarted} <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-peach-50 to-plum-50 pointer-events-none" />

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-magenta-pale/60 to-peach-pale/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-plum-pale/60 to-magenta-pale/30 blur-3xl pointer-events-none" />

        {/* Globe */}
        <div
          className="absolute z-0 pointer-events-none
            top-16 right-0 w-60 h-60 opacity-50
            sm:w-80 sm:h-80 sm:opacity-60
            lg:pointer-events-auto lg:h-screen lg:top-0 lg:right-0 lg:w-[62%] lg:opacity-100"
        >
          <NationalGlobe />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center lg:items-start gap-6 text-center lg:text-left max-w-xl w-full"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-4 py-1.5 rounded-full bg-plum/8 text-plum text-xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-magenta animate-pulse shrink-0" />
                {d.hero.badge}{" "}
                <a
                  href={d.hero.badgeLinkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-magenta transition-colors"
                >
                  {d.hero.badgeLink}
                </a>
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-plum leading-[1.08] tracking-tight"
            >
              {d.hero.title}
              <br />
              <span className="bg-gradient-to-r from-magenta to-peach bg-clip-text text-transparent">
                {d.hero.titleHighlight}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-2xl font-medium text-plum/50 leading-relaxed"
            >
              {d.hero.tagline}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-plum/55 leading-7 px-2 sm:px-0"
            >
              {d.hero.body}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto"
            >
              <a
                href={`/${locale}#find-program`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-plum text-white font-semibold text-sm hover:bg-plum-dark shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                {d.hero.ctaProgram}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href={`/${locale}#about`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-plum/20 text-plum font-semibold text-sm hover:border-plum/40 hover:bg-plum/4 transition-all duration-200"
              >
                {d.hero.ctaLearnMore}
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-plum/30"
        >
          <span className="text-xs tracking-widest uppercase">{d.hero.scroll}</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Value Proposition ── */}
      <section id="about" className="py-16 md:py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <InView className="text-center mb-12 md:mb-16">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3"
            >
              {d.valueProps.eyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-plum max-w-2xl mx-auto leading-tight"
            >
              {d.valueProps.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-plum/55 max-w-xl mx-auto text-base leading-7"
            >
              {(() => {
                const extLink = "font-medium text-plum underline underline-offset-2 decoration-plum/20 hover:text-magenta hover:decoration-magenta transition-colors duration-150";
                const [pre, afterElevate = ""] = d.valueProps.body.split("{elevateip}");
                const [mid, post = ""] = afterElevate.split("{ised}");
                return (
                  <>
                    {pre}
                    <a href={d.valueProps.elevateipHref} target="_blank" rel="noopener noreferrer" className={extLink}>ElevateIP</a>
                    {mid}
                    <a href={d.valueProps.isedHref} target="_blank" rel="noopener noreferrer" className={extLink}>{d.valueProps.isedName}</a>
                    {post}
                  </>
                );
              })()}
            </motion.p>
          </InView>

          <InView className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {d.valueProps.values.map(({ title, body }, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <motion.div
                  key={title}
                  variants={fadeUp}
                  className="group rounded-3xl bg-gradient-to-br from-plum-50 to-white border border-plum/8 p-8 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-plum to-magenta flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-plum">{title}</h3>
                  <p className="text-plum/55 text-sm leading-6">{body}</p>
                </motion.div>
              );
            })}
          </InView>
        </div>
      </section>

      {/* ── Success Stories ── */}
      <SuccessBanner />

      {/* ── Regional Router ── */}
      <section
        id="find-program"
        className="py-16 md:py-28 px-6 pb-24 md:pb-40 bg-gradient-to-b from-peach-50 via-white to-plum-50 relative"
      >
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-6 hidden xl:block"
          width="440"
          height="440"
          viewBox="0 0 440 440"
          fill="none"
        >
          <circle cx="220" cy="220" r="200" stroke="#4A2040" strokeWidth="1" strokeDasharray="10 10" />
          <circle cx="220" cy="220" r="150" stroke="#B8287A" strokeWidth="1" strokeDasharray="6 14" />
        </svg>

        <div className="max-w-3xl mx-auto text-center">
          <InView>
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3"
            >
              {d.regionalRouter.eyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-plum mb-4 leading-tight"
            >
              {d.regionalRouter.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-plum/55 text-base leading-7 mb-3 max-w-xl mx-auto"
            >
              {d.regionalRouter.body}
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="text-sm text-plum/40 mb-10 max-w-xl mx-auto"
            >
              {d.regionalRouter.helperText}
            </motion.p>
            <motion.div variants={fadeUp}>
              <ProvinceDropdown />
            </motion.div>
          </InView>
        </div>
      </section>

      {/* ── Partner Logo Wall ── */}
      <div id="partners">
        <PartnerLogoWall />
      </div>

      {/* ── Resources ── */}
      <section id="resources" className="py-16 md:py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <InView className="text-center">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3"
            >
              {d.resources.eyebrow}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold text-plum max-w-2xl mx-auto leading-tight"
            >
              {d.resources.heading}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-4 text-plum/55 max-w-xl mx-auto text-base leading-7"
            >
              {d.resources.body}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10">
              <a
                href={`/${locale}/resources`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-plum text-white font-semibold text-sm hover:bg-plum-dark shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                {d.resources.exploreCta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          </InView>
        </div>
      </section>

      <Footer />
    </div>
  );
}
