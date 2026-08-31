"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/team", label: "TEAM" },
  { href: "/events", label: "EVENTS" },
  { href: "/community", label: "COMMUNITY" },
  { href: "/blog", label: "BLOG" },
];

const teamExperts = [
  { name: "Dr. Meera S", expertise: "AI / Machine Learning", contact: "meera@iic.edu" },
  { name: "Prof. Rahul K", expertise: "IoT / Hardware", contact: "rahul@iic.edu" },
  { name: "Ananya D", expertise: "Design / UX", contact: "ananya@iic.edu" },
  { name: "Vikram P", expertise: "Blockchain / Web3", contact: "vikram@iic.edu" },
];

export function ScrollNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expertOpen, setExpertOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[var(--ink)]/95 backdrop-blur-md border-b border-[var(--wire)]">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="text-2xl text-[var(--bone)] tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                IIC
              </div>
              <div className="h-4 w-px bg-[var(--wire)]" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)]">
                INNOVATION COUNCIL
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[11px] tracking-[0.2em] text-[var(--bone)]/60 hover:text-[var(--signal)] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-4 w-px bg-[var(--wire)]" />
              <button
                onClick={() => setExpertOpen(!expertOpen)}
                className="font-mono text-[11px] tracking-[0.2em] text-[var(--signal)] hover:text-[var(--bone)] transition-colors duration-300"
              >
                CONTACT EXPERTS ↗
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-[var(--bone)] p-2"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <div className={`h-px w-6 bg-current transition-transform duration-300 ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
                <div className={`h-px w-6 bg-current transition-opacity duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <div className={`h-px w-6 bg-current transition-transform duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        {expertOpen && (
          <div className="bg-[var(--ink-2)] border-b border-[var(--wire)]">
            <div className="mx-auto max-w-7xl px-6 py-6">
              <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
                TEAM EXPERTISE — CONTACT
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamExperts.map((expert) => (
                  <div
                    key={expert.name}
                    className="border border-[var(--wire)] p-4 hover:border-[var(--signal)]/40 transition-colors duration-300"
                  >
                    <div className="text-[var(--bone)] text-sm font-medium">{expert.name}</div>
                    <div className="font-mono text-[10px] tracking-[0.15em] text-[var(--signal)] mt-1">
                      {expert.expertise}
                    </div>
                    <a
                      href={`mailto:${expert.contact}`}
                      className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)] mt-2 block hover:text-[var(--bone)] transition-colors"
                    >
                      {expert.contact}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="md:hidden bg-[var(--ink-2)] border-b border-[var(--wire)]">
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block font-mono text-[11px] tracking-[0.2em] text-[var(--bone)]/60 hover:text-[var(--signal)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-[var(--wire)]" />
              <button
                onClick={() => { setExpertOpen(!expertOpen); setMobileOpen(false); }}
                className="font-mono text-[11px] tracking-[0.2em] text-[var(--signal)]"
              >
                CONTACT EXPERTS ↗
              </button>
            </div>
          </div>
        )}
      </nav>

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="text-xl text-white tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              IIC
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/80"
            >
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--signal)]" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/60">
              SCROLL TO ENTER
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
