"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

const FIELDS = [
  { name: "title",            label: "Event Title",         type: "text",     required: true,  placeholder: "e.g. IP Fundamentals Workshop" },
  { name: "event_date",       label: "Event Date",          type: "date",     required: true,  placeholder: "" },
  { name: "partner_name",     label: "Organization Name",   type: "text",     required: true,  placeholder: "e.g. Communitech" },
  { name: "registration_url", label: "Registration URL",    type: "url",      required: false, placeholder: "https://..." },
  { name: "partner_logo_url", label: "Organization Logo URL", type: "url",   required: false, placeholder: "https://..." },
] as const;

const TEXTAREA_FIELD = { name: "description", label: "Description", required: false, placeholder: "Brief overview of the event (optional)" };

export default function SubmitEventModal({ open, onClose }: Props) {
  const [form, setForm]     = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const firstInputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    } else {
      setForm({});
      setStatus("idle");
      setErrMsg("");
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
                <h2 className="text-lg font-bold text-plum">Submit an Event</h2>
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
                    <h3 className="text-lg font-bold text-plum mb-1">Event submitted!</h3>
                    <p className="text-sm text-plum/50 leading-6 max-w-xs mx-auto">
                      Your event has been received and is pending review. We&apos;ll approve it shortly.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-2 px-6 py-2.5 rounded-full bg-plum text-white text-sm font-semibold hover:bg-plum/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {FIELDS.map((field, i) => (
                    <div key={field.name} className="flex flex-col gap-1.5">
                      <label htmlFor={field.name} className="text-xs font-semibold text-plum/60 uppercase tracking-wider">
                        {field.label}
                        {field.required && <span className="text-magenta ml-0.5">*</span>}
                      </label>
                      <input
                        ref={i === 0 ? firstInputRef : undefined}
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={form[field.name] ?? ""}
                        onChange={(e) => setForm((f) => ({ ...f, [field.name]: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-plum/15 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
                      />
                    </div>
                  ))}

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={TEXTAREA_FIELD.name} className="text-xs font-semibold text-plum/60 uppercase tracking-wider">
                      {TEXTAREA_FIELD.label}
                    </label>
                    <textarea
                      id={TEXTAREA_FIELD.name}
                      name={TEXTAREA_FIELD.name}
                      rows={3}
                      placeholder={TEXTAREA_FIELD.placeholder}
                      value={form[TEXTAREA_FIELD.name] ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [TEXTAREA_FIELD.name]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-plum/15 text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all resize-none"
                    />
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
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Event
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-plum/30 pb-1">
                    Submitted events are reviewed before appearing on the calendar.
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
