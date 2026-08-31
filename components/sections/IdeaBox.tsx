"use client";

import { useState } from "react";
import { Frame } from "../primitives/Frame";

export function IdeaBox() {
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (idea.trim()) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setIdea(""); }, 3000);
    }
  };

  return (
    <Frame tone="navy" className="p-8">
      <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
        SECTION 042.01 / SUBMIT
      </div>
      <div
        className="text-3xl text-[var(--bone)] mb-1"
        style={{ fontFamily: "var(--font-display)" }}
      >
        IDEA BOX
      </div>
      <div className="font-jp text-sm text-[var(--signal)] mb-6">
        アイデアボックス
      </div>

      {submitted ? (
        <div className="border border-[var(--signal)]/40 p-6 text-center">
          <div className="text-[var(--signal)] text-lg font-medium mb-1">IDEA CAPTURED</div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--muted)]">
            YOUR INPUT HAS BEEN LOGGED // THANK YOU
          </div>
        </div>
      ) : (
        <>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Share your innovation idea..."
            className="w-full bg-[var(--ink)] border border-[var(--wire)] p-4 text-[var(--bone)] placeholder:text-[var(--muted)]/40 font-mono text-sm resize-none h-32 focus:outline-none focus:border-[var(--signal)]/40 transition-colors"
          />
          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-3 bg-[var(--signal)] text-white font-mono text-[11px] tracking-[0.2em] hover:bg-[var(--signal)]/80 transition-colors"
          >
            SUBMIT IDEA ↗
          </button>
        </>
      )}
    </Frame>
  );
}
