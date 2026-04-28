"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Shield,
  Globe,
  Users,
  BookOpen,
  Calendar,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Award,
  Layers,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import ProvinceDropdown from "@/components/ProvinceDropdown";
import Footer from "@/components/Footer";
import PartnerLogoWall from "@/components/PartnerLogoWall";
import NationalGlobe from "@/components/NationalGlobe";

/* ─── Animation helpers ──────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
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


/* ─── Value props ────────────────────────────────────── */
const VALUES = [
  {
    icon: Shield,
    title: "IP Strategy First",
    body: "We help Canadian startups understand, develop, and protect their most valuable assets: their ideas.",
  },
  {
    icon: TrendingUp,
    title: "Growth-Stage Ready",
    body: "From seed to scale, our programs align IP strategy with your funding and commercialization milestones.",
  },
  {
    icon: Globe,
    title: "Nationwide Coverage",
    body: "A unified network of regional BAIs spans every province and territory, so every founder has a local expert.",
  },
];

/* ─── Resources ──────────────────────────────────────── */
const RESOURCES = [
  {
    icon: BookOpen,
    category: "Guide",
    title: "IP Fundamentals for Startups",
    desc: "An introduction to patents, trademarks, trade secrets, and copyright for early-stage companies.",
  },
  {
    icon: Lightbulb,
    category: "Toolkit",
    title: "IP Audit Checklist",
    desc: "A self-assessment tool to identify gaps in your current IP protection strategy.",
  },
  {
    icon: Calendar,
    category: "Upcoming",
    title: "National IP Webinar Series",
    desc: "Monthly live sessions with IP professionals covering commercialization, licensing, and enforcement.",
  },
  {
    icon: Award,
    category: "Service Provider Directory",
    title: "Service Provider Directory",
    desc: "Connect with an IP advisor from our national network tailored to your sector and stage.",
    href: "/experts",
  },
];

/* ─────────────────────────────────────────────────────── */

export default function Home() {
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
            <a href="#about" className="hover:text-plum transition-colors">About</a>
            <a href="#find-program" className="hover:text-plum transition-colors">Find Your Program</a>
            <a href="#resources" className="hover:text-plum transition-colors">Resources</a>
            <a href="#partners" className="hover:text-plum transition-colors">Partners</a>
          </nav>
          <a
            href="#find-program"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum-dark transition-colors shadow-sm"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-peach-50 to-plum-50 pointer-events-none" />

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-magenta-pale/60 to-peach-pale/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-plum-pale/60 to-magenta-pale/30 blur-3xl pointer-events-none" />

        {/* Globe — right-side background, behind text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2.0, ease: "easeOut" as const }}
          className="absolute inset-y-0 right-0 w-full lg:w-[62%] z-0"
        >
          <NationalGlobe />
        </motion.div>

        {/* Content — left-aligned text column */}
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
                ElevateIP is Powered by{" "}
                <a
                  href="https://ised-isde.canada.ca/site/innovation-canada/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-magenta transition-colors"
                >
                  Innovation Canada
                </a>
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-plum leading-[1.08] tracking-tight"
            >
              Protecting Canadian
              <br />
              <span className="bg-gradient-to-r from-magenta to-peach bg-clip-text text-transparent">
                Innovation.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-2xl font-medium text-plum/50 leading-relaxed"
            >
              Supporting Startups Nationwide.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="text-base text-plum/55 leading-7 px-2 sm:px-0"
            >
              ElevateIP is a national program empowering Canada&apos;s most promising
              startups with expert intellectual property guidance delivered
              through a network of trusted regional accelerators and incubators.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center gap-3 mt-2 w-full sm:w-auto"
            >
              <a
                href="#find-program"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-plum text-white font-semibold text-sm hover:bg-plum-dark shadow-lg hover:shadow-xl transition-all duration-200 group"
              >
                Find Your Regional Program
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-plum/20 text-plum font-semibold text-sm hover:border-plum/40 hover:bg-plum/4 transition-all duration-200"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-plum/30"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
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
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
              The National Program
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-plum max-w-2xl mx-auto leading-tight">
              Where IP Strategy Meets Startup Growth
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-plum/55 max-w-xl mx-auto text-base leading-7">
              ElevateIP works with Business Accelerators and Incubators (BAIs) across Canada to deliver professional,
              stage-appropriate IP services to the startups they support.
            </motion.p>
          </InView>

          <InView className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ icon: Icon, title, body }) => (
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
            ))}
          </InView>
        </div>
      </section>

      {/* ── Regional Router ── */}
      <section
        id="find-program"
        className="py-16 md:py-28 px-6 pb-24 md:pb-40 bg-gradient-to-b from-peach-50 via-white to-plum-50 relative"
      >
        {/* Decorative ring */}
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
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
              Find Your Program
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-plum mb-4 leading-tight">
              Your Regional IP Partner Is Waiting
            </motion.h2>
            <motion.p variants={fadeUp} className="text-plum/55 text-base leading-7 mb-12 max-w-xl mx-auto">
              Select your province or territory below to be connected with your dedicated regional program and local IP specialists.
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

      {/* ── Resources & Events Hub ── */}
      <section id="resources" className="py-16 md:py-28 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <InView className="text-center mb-12 md:mb-16">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-magenta mb-3">
              Shared Resources
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-plum max-w-2xl mx-auto leading-tight">
              Nationally Available Tools &amp; Events
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-plum/55 max-w-xl mx-auto text-base leading-7">
              No matter where you are in Canada, these resources are available to every founder in the ElevateIP ecosystem.
            </motion.p>
          </InView>

          <InView className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {RESOURCES.map(({ icon: Icon, category, title, desc, href }) => (
              <motion.a
                key={title}
                href={href ?? undefined}
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
                  {href && (
                    <span className="mt-1 text-xs font-semibold text-magenta group-hover:underline">
                      Browse the directory →
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </InView>
        </div>
      </section>

      <Footer />
    </div>
  );
}
