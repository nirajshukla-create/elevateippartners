import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LanguageToggle from "@/components/LanguageToggle";

export default function SubpageHeader({
  backHref,
  backLabel,
}: {
  backHref: string;
  backLabel: string;
}) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-plum/8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-3">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="inline-flex items-center gap-2 text-sm font-semibold text-plum/60 hover:text-plum transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">{backLabel}</span>
        </Link>
        <span className="font-bold text-plum text-sm sm:text-xl tracking-tight truncate">
          ElevateIP<span className="text-magenta"> Partners</span>
        </span>
        <LanguageToggle />
      </div>
    </header>
  );
}
