"use client";

import { useState } from "react";
import { galleryItems } from "../../lib/site-data";

const categories = ["All", "Events", "Workshop", "Competition", "Networking"];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? galleryItems : galleryItems.filter((g) => g.category === filter);

  return (
    <div className="bg-[var(--ink)] min-h-screen pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
          SECTION 002.01 / GALLERY
        </div>
        <div
          className="text-5xl md:text-7xl text-[var(--bone)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          GALLERY
        </div>
        <div className="font-jp text-lg text-[var(--signal)] mb-12">
          ギャラリー
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-mono text-[10px] tracking-[0.2em] px-4 py-2 border transition-colors duration-300 ${
                filter === cat
                  ? "bg-[var(--signal)] text-white border-[var(--signal)]"
                  : "text-[var(--bone)]/60 border-[var(--wire)] hover:border-[var(--signal)]/40"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border border-[var(--wire)] bg-[var(--ink-2)] group hover:border-[var(--signal)]/40 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-[var(--ink)] relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="text-4xl text-[var(--bone)]/10"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title.split(" ")[0].toUpperCase()}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] to-transparent opacity-60" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)]">
                    {item.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)]">
                    {item.date}
                  </span>
                </div>
                <div
                  className="text-xl text-[var(--bone)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
