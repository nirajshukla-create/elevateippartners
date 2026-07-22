"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_NAMES = [
  "title",
  "event_date",
  "partner_name",
  "registration_url",
  "partner_logo_url",
] as const;

type FieldName = (typeof FIELD_NAMES)[number];

const FIELD_TYPES: Record<FieldName, string> = {
  title:            "text",
  event_date:       "date",
  partner_name:     "text",
  registration_url: "url",
  partner_logo_url: "url",
};

const FIELD_REQUIRED: Record<FieldName, boolean> = {
  title:            true,
  event_date:       true,
  partner_name:     true,
  registration_url: false,
  partner_logo_url: false,
};

export default function SubmitEventModal({ open, onClose }: Props) {
  const { dict } = useLanguage();
  const m = dict.submitEventModal;

  const [form, setForm]     = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const firstInputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      setTimeout(() => {
        setForm({});
        setStatus("idle");
        setErrMsg("");
      }, 0);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrMsg("");

    try {
      const res = await fetch("/api/submit-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-plum/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-plum/8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-magenta mb-0.5">
                  ElevateIP Partners
                </p>
                <h2 className="text-lg font-bold text-plum">{m.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-plum/40 hover:text-plum hover:bg-plum/6 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 overflow-y-auto max-h-[70vh]">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-plum mb-1">{m.successHeading}</h3>
                    <p className="text-sm text-plum/50 leading-6 max-w-xs mx-auto">
                      {m.successBody}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum/90 transition-colors"
                  >
                    {m.done}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {FIELD_NAMES.map((name, i) => {
                    const f = m.fields[name];
                    return (
                      <div key={name} className="flex flex-col gap-1.5">
                        <label htmlFor={name} className="text-xs font-semibold text-plum/60 uppercase tracking-wider">
                          {f.label}
                          {FIELD_REQUIRED[name] && <span className="text-magenta ml-0.5">*</span>}
                        </label>
                        <input
                          ref={i === 0 ? firstInputRef : undefined}
                          id={name}
                          name={name}
                          type={FIELD_TYPES[name]}
                          required={FIELD_REQUIRED[name]}
                          placeholder={f.placeholder}
                          value={form[name] ?? ""}
                          onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
                          className="w-full px-4 py-3 rounded-xl border border-plum/15 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
                        />
                      </div>
                    );
                  })}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-xs font-semibold text-plum/60 uppercase tracking-wider">
                      {m.fields.description.label}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      placeholder={m.fields.description.placeholder}
                      value={form["description"] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-plum/15 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all resize-none"
                    />
                  </div>

                  {/* French translation section */}
                  <div className="border-t border-plum/8 pt-4 flex flex-col gap-4">
                    <p className="text-xs text-plum/40 font-medium">{m.frenchSectionLabel}</p>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="title_fr" className="text-xs font-semibold text-plum/60 uppercase tracking-wider">
                        {m.fields.title_fr.label}
                      </label>
                      <input
                        id="title_fr"
                        name="title_fr"
                        type="text"
                        placeholder={m.fields.title_fr.placeholder}
                        value={form["title_fr"] ?? ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, title_fr: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-plum/15 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="description_fr" className="text-xs font-semibold text-plum/60 uppercase tracking-wider">
                        {m.fields.description_fr.label}
                      </label>
                      <textarea
                        id="description_fr"
                        name="description_fr"
                        rows={3}
                        placeholder={m.fields.description_fr.placeholder}
                        value={form["description_fr"] ?? ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, description_fr: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-plum/15 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <p className="text-sm text-red-600">{errMsg}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-1 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-plum text-white text-sm font-semibold hover:bg-plum/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {m.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {m.submit}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-plum/30 pb-1">
                    {m.disclaimer}
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
