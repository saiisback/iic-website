import { blogPosts } from "../../lib/site-data";

export default function BlogPage() {
  return (
    <div className="bg-[var(--ink)] min-h-screen pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--muted)] mb-2">
          SECTION 006.01 / BLOG
        </div>
        <div
          className="text-5xl md:text-7xl text-[var(--bone)] mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          EVENT BLOG
        </div>
        <div className="font-jp text-lg text-[var(--signal)] mb-12">
          イベントブログ
        </div>

        <div className="space-y-6">
          {blogPosts.map((post, i) => (
            <article
              key={post.id}
              className="border border-[var(--wire)] bg-[var(--ink-2)] hover:border-[var(--signal)]/30 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-72 lg:w-80 bg-[var(--ink)] flex items-center justify-center shrink-0 aspect-[16/9] md:aspect-auto">
                  <div
                    className="text-5xl text-[var(--bone)]/10"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
                <div className="flex-1 p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)]">
                      {post.category.toUpperCase()}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)]">
                      {post.date}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--muted)]">
                      {post.readTime} READ
                    </span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl text-[var(--bone)] mb-3 group-hover:text-[var(--signal)] transition-colors"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {post.title.toUpperCase()}
                  </h2>
                  <p className="text-[var(--bone)]/50 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--signal)] group-hover:tracking-[0.3em] transition-all duration-300">
                    READ MORE ↗
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
