"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const DISMISS_KEY = "iic-recruitment-popup-dismissed";
const SHOW_DELAY_MS = 900;

export function RecruitmentDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="recruitment-popup-title"
        className="recruitment-popup-panel relative w-full max-w-md border border-white/15 bg-[#050706] p-8 text-white shadow-[0_40px_80px_rgba(0,0,0,0.6)] md:p-10"
        onClick={(event) => event.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-emerald-400" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close recruitment announcement"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        >
          <span aria-hidden="true">×</span>
        </button>

        <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-emerald-300">
          IIC BMSIT — Now recruiting
        </p>
        <h2
          id="recruitment-popup-title"
          className="mt-4 font-display text-5xl leading-[0.9] tracking-tight md:text-6xl"
        >
          RECRUITMENT STARTED
        </h2>
        <p className="mt-5 text-sm leading-6 text-white/65 md:text-base md:leading-7">
          We are looking for idea people, builders, and organizers. Tell us why
          you belong in the room — applications are open now.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/careers"
            autoFocus
            onClick={onClose}
            className="inline-flex min-h-12 flex-1 items-center justify-center bg-emerald-400 px-6 text-xs font-bold uppercase tracking-[0.18em] text-[#07110d] transition-[transform,background-color] hover:-translate-y-px hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:translate-y-px"
          >
            Apply now
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center border border-white/25 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}

export function RecruitmentPopup() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage unavailable: the popup simply reappears on the next visit.
    }
  }, []);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      // Storage unavailable: treat as not dismissed.
    }
    if (dismissed) return;
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, dismiss]);

  if (!open) return null;
  return <RecruitmentDialog onClose={dismiss} />;
}
