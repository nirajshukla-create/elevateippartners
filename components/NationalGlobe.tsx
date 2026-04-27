"use client";

import dynamic from "next/dynamic";

const GlobeClient = dynamic(() => import("./GlobeClient"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64">
        <div className="absolute inset-0 rounded-full border border-plum/15 animate-pulse" />
        <div className="absolute inset-4 rounded-full border border-magenta/10 animate-pulse" style={{ animationDelay: "0.3s" }} />
        <div className="absolute inset-8 rounded-full border border-peach/10 animate-pulse" style={{ animationDelay: "0.6s" }} />
      </div>
    </div>
  ),
});

export default function NationalGlobe() {
  return <GlobeClient />;
}
