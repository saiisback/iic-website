"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { CAREER_SECTIONS } from "@/lib/careers/questions";
import { CAREER_ROLE_TYPES } from "@/lib/careers/types";
import { COMMENTERS, type Application, type ApplicationReview, type ReviewStatus } from "@/lib/admin/applications";
import styles from "./admin.module.css";

const labels: Record<ReviewStatus, string> = { new: "Pending", accepted: "Accepted", rejected: "Rejected" };
const date = (value: string) => new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

function Stars({ value, label }: { value: number; label?: string }) {
  const filled = Math.max(0, Math.min(5, Math.round(value)));
  return <span className={styles.stars} role="img" aria-label={label ?? `${filled} out of 5 stars`}><span aria-hidden="true">{"★".repeat(filled)}</span><span className={styles.starsEmpty} aria-hidden="true">{"★".repeat(5 - filled)}</span></span>;
}

function sortApplications(items: Application[], sort: string, reviewer: string, reviewsByApp: Map<string, ApplicationReview[]>) {
  const reviewedBy = (item: Application) => reviewer !== "all" && (reviewsByApp.get(item.id) ?? []).some((review) => review.commenter === reviewer);
  const average = (id: string) => {
    const list = reviewsByApp.get(id) ?? [];
    return list.length ? list.reduce((sum, review) => sum + review.rating, 0) / list.length : null;
  };
  const time = (item: Application) => new Date(item.createdAt).getTime();
  return [...items].sort((a, b) => {
    if (reviewedBy(a) !== reviewedBy(b)) return reviewedBy(a) ? -1 : 1;
    switch (sort) {
      case "name": return a.fullName.localeCompare(b.fullName) || time(b) - time(a);
      case "oldest": return time(a) - time(b);
      case "rating-desc": return (average(b.id) ?? -1) - (average(a.id) ?? -1) || time(b) - time(a);
      case "rating-asc": return (average(a.id) ?? 6) - (average(b.id) ?? 6) || time(b) - time(a);
      default: return time(b) - time(a);
    }
  });
}

export default function AdminDashboard({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<ApplicationReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState("all");
  const [reviewer, setReviewer] = useState("all");
  const [sort, setSort] = useState("newest");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [reviewName, setReviewName] = useState<string>(COMMENTERS[0]);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = applications.find((item) => item.id === selectedId);

  const reviewsByApp = new Map<string, ApplicationReview[]>();
  for (const review of reviews) {
    const list = reviewsByApp.get(review.applicationId);
    if (list) list.push(review);
    else reviewsByApp.set(review.applicationId, [review]);
  }

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/applications", { cache: "no-store" });
      const data = await response.json();
      if (response.status === 401) { setAuthenticated(false); setApplications([]); setReviews([]); setSelectedId(null); }
      if (!response.ok) throw new Error(data.error);
      setApplications(data.applications);
      setReviews(data.reviews ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to load applications."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [authenticated, load]);
  useEffect(() => {
    const node = dialog.current;
    if (selectedId && node && !node.open) node.showModal();
    else if (!selectedId && node?.open) node.close();
  }, [selectedId]);

  async function login(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setPassword(""); setAuthenticated(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in."); }
    finally { setLoading(false); }
  }

  async function exportExcel() {
    setError("");
    try {
      const response = await fetch("/api/admin/applications/export", { cache: "no-store" });
      if (response.status === 401) { setAuthenticated(false); setApplications([]); setReviews([]); setSelectedId(null); }
      if (!response.ok) throw new Error((await response.json()).error);
      const name = /filename="([^"]+)"/.exec(response.headers.get("Content-Disposition") ?? "")?.[1] ?? "iic-career-applications.xlsx";
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url; link.download = name; link.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to export applications."); }
  }

  async function logout() {
    setError("");
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) throw new Error("Unable to sign out. Please try again.");
      setAuthenticated(false); setApplications([]); setReviews([]); setSelectedId(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign out."); }
  }

  function openApplication(id: string) {
    setError(""); setSelectedId(id);
    setReviewName(COMMENTERS[0]); setReviewRating(0); setReviewComment("");
  }

  async function decide(nextStatus: ReviewStatus) {
    if (!selected || saving) return;
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, status: nextStatus }) });
      const data = await response.json();
      if (response.status === 401) { setAuthenticated(false); setApplications([]); setReviews([]); setSelectedId(null); }
      if (!response.ok) throw new Error(data.error);
      setApplications((items) => items.map((item) => item.id === selected.id ? { ...item, reviewStatus: nextStatus } : item));
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save decision."); }
    finally { setSaving(false); }
  }

  function pickReviewer(name: string) {
    setReviewName(name);
    const existing = selected && reviews.find((review) => review.applicationId === selected.id && review.commenter === name);
    setReviewRating(existing?.rating ?? 0);
    setReviewComment(existing?.comment ?? "");
  }

  async function saveReview(event: FormEvent) {
    event.preventDefault();
    if (!selected || !reviewRating || savingReview) return;
    setSavingReview(true); setError("");
    try {
      const response = await fetch("/api/admin/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: selected.id, commenter: reviewName, rating: reviewRating, comment: reviewComment }) });
      const data = await response.json();
      if (response.status === 401) { setAuthenticated(false); setApplications([]); setReviews([]); setSelectedId(null); }
      if (!response.ok) throw new Error(data.error);
      const review = data.review as ApplicationReview;
      setReviews((items) => [...items.filter((item) => !(item.applicationId === review.applicationId && item.commenter === review.commenter)), review]);
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to save the review."); }
    finally { setSavingReview(false); }
  }

  const query = search.trim().toLowerCase();
  const matches = (item: Application) =>
    (status === "all" || item.reviewStatus === status) &&
    (role === "all" || item.roleType === role) &&
    `${item.fullName} ${item.email} ${item.usn} ${(reviewsByApp.get(item.id) ?? []).map((review) => `${review.commenter} ${review.comment}`).join(" ")}`.toLowerCase().includes(query);
  const visible = sortApplications(applications.filter(matches), sort, reviewer, reviewsByApp);
  const averageRating = (id: string) => {
    const list = reviewsByApp.get(id) ?? [];
    return list.length ? list.reduce((sum, review) => sum + review.rating, 0) / list.length : null;
  };
  const selectedReviews = selected ? reviewsByApp.get(selected.id) ?? [] : [];

  return <main className={styles.shell}>
    <header className={styles.header}><Link href="/" className={styles.brand}>IIC<span>BMSIT</span></Link><span className={styles.private}>Recruitment desk</span>{authenticated && <button onClick={logout}>Sign out</button>}</header>
    {!authenticated ? <section className={styles.login}>
      <div className={styles.loginMark} aria-hidden="true">IIC</div>
      <h1>Good people.<br />Great possibilities.</h1><p>Sign in to review your next team.</p>
      <form onSubmit={login}><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={(event) => setPassword(event.target.value)} /><button className={styles.primary} disabled={loading}>{loading ? "Signing in…" : "Open applications"}</button></form>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.note}>Private access for the IIC recruitment team.</p>
    </section> : <section className={styles.workspace}>
      <div className={styles.titleRow}><div><h1>Applications<span>.</span></h1><p>The next generation of ideas, builders, and organizers.</p></div><div className={styles.actions}><button disabled={loading} onClick={exportExcel}>Download as Excel</button><button disabled={loading} onClick={load}>{loading ? "Refreshing…" : "Refresh applications"}</button></div></div>
      <div className={styles.tabs} aria-label="Filter by review status">{(["all", "new", "accepted", "rejected"] as const).map((value) => <button key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{value === "all" ? "All applications" : labels[value]}<span>{applications.filter((item) => value === "all" || item.reviewStatus === value).length}</span></button>)}</div>
      <div className={styles.filters}><label className={styles.search}>Search applicants<input type="search" placeholder="Name, USN, email, reviewer, or comment" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label>Role<select value={role} onChange={(event) => setRole(event.target.value)}><option value="all">All roles</option>{CAREER_ROLE_TYPES.map((value) => <option key={value}>{value}</option>)}</select></label><label>Reviewer<select value={reviewer} onChange={(event) => setReviewer(event.target.value)}><option value="all">All reviewers</option>{COMMENTERS.map((name) => <option key={name}>{name}</option>)}</select></label><label>Sort by<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="name">Name A–Z</option><option value="rating-desc">Highest rating</option><option value="rating-asc">Lowest rating</option></select></label></div>
      {error && <p className={styles.error} role="alert">{error}</p>}
      <p className={styles.result} aria-live="polite">{loading ? "Loading applications…" : `${visible.length} ${visible.length === 1 ? "application" : "applications"} shown`}</p>
      <div className={styles.tableWrap}><table><thead><tr><th>Applicant</th><th>Role</th><th>Applied · IST</th><th>Rating</th><th>Status</th><th><span className={styles.srOnly}>Details</span></th></tr></thead><tbody>{visible.map((item) => {
        const reviewerReview = reviewer === "all" ? undefined : (reviewsByApp.get(item.id) ?? []).find((review) => review.commenter === reviewer);
        const average = averageRating(item.id);
        const count = (reviewsByApp.get(item.id) ?? []).length;
        return <tr key={item.id}><td><button className={styles.applicant} onClick={() => openApplication(item.id)}>{item.fullName}<span>{item.usn} · {item.email}</span></button></td><td>{item.roleType}</td><td>{date(item.createdAt)}</td><td className={styles.ratingCell}>{reviewerReview ? <Stars value={reviewerReview.rating} label={`${reviewer} rated ${reviewerReview.rating} out of 5`} /> : average !== null ? <span className={styles.ratingAverage}><Stars value={average} /><span>{average.toFixed(1)} · {count} {count === 1 ? "review" : "reviews"}</span></span> : <span className={styles.noRating}>—</span>}</td><td><span className={styles.badge} data-status={item.reviewStatus}>{labels[item.reviewStatus] ?? item.reviewStatus}</span></td><td><button onClick={() => openApplication(item.id)} aria-label={`Review ${item.fullName}`}>Review</button></td></tr>;
      })}</tbody></table>{!loading && visible.length === 0 && <div className={styles.empty}><h2>{applications.length ? "No matching applications" : "Your next team starts here"}</h2><p>{applications.length ? "Try another search or change your filters." : "Submitted career applications will appear here."}</p></div>}</div>
    </section>}
    <dialog ref={dialog} className={styles.dialog} onCancel={() => setSelectedId(null)} onClose={() => setSelectedId(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }} aria-labelledby="application-title">
      {selected && <><div className={styles.modalHeader}><div><h2 id="application-title">{selected.fullName}</h2><p>{selected.usn} · <a href={`mailto:${selected.email}`}>{selected.email}</a></p><p>{selected.roleType} · Applied {date(selected.createdAt)} IST</p></div><button autoFocus onClick={() => setSelectedId(null)}>Close</button></div>
        <div className={styles.answers}>{CAREER_SECTIONS.map((section) => <section key={section.id}><h3>{section.title}</h3>{section.questions.map((question) => <div className={styles.answer} key={question.id}><h4>{question.label}</h4><p>{String(selected[question.id as keyof Application] ?? "") || "Not provided"}</p>{question.variant === "role" && <><h4>{question.exampleLabel}</h4><p>{selected.roleExample}</p></>}</div>)}</section>)}<p className={styles.note}>Consent to application: {selected.consent ? "Yes" : "No"}</p></div>
        <section className={styles.reviewPanel} aria-label="Reviewer ratings">
          <h3>Reviewer ratings</h3>
          {selectedReviews.length === 0 ? <p className={styles.reviewEmpty}>No ratings yet. Pick a reviewer below to add the first one.</p> : <ul className={styles.reviewList}>{selectedReviews.map((review) => <li className={styles.reviewItem} key={review.id}><div className={styles.reviewItemHead}><strong>{review.commenter}</strong><Stars value={review.rating} /><time dateTime={review.updatedAt}>{date(review.updatedAt)}</time></div>{review.comment && <p>{review.comment}</p>}</li>)}</ul>}
          <form className={styles.reviewForm} onSubmit={saveReview}>
            <div className={styles.reviewFields}>
              <label>Reviewer
                <select value={reviewName} onChange={(event) => pickReviewer(event.target.value)}>
                  {COMMENTERS.map((name) => <option key={name}>{name}</option>)}
                </select>
              </label>
              <fieldset className={styles.starFieldset}>
                <legend>Star rating</legend>
                <div className={styles.starRow} role="radiogroup" aria-label="Star rating">
                  {[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} className={styles.star} data-filled={value <= reviewRating} aria-pressed={reviewRating === value} aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`} onClick={() => setReviewRating(value)}>★</button>)}
                </div>
              </fieldset>
            </div>
            <label>Comment
              <textarea rows={3} maxLength={2000} placeholder="Write your feedback about this applicant…" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} />
            </label>
            <div className={styles.reviewActions}>
              <button type="submit" className={styles.primary} disabled={savingReview || !reviewRating}>{savingReview ? "Saving…" : "Save review"}</button>
              {reviewRating > 0 && (reviewsByApp.get(selected.id) ?? []).some((review) => review.commenter === reviewName) && <span className={styles.reviewHint}>Updating {reviewName}&apos;s existing review.</span>}
            </div>
          </form>
        </section>
        <footer className={styles.modalFooter}><span className={styles.badge} data-status={selected.reviewStatus}>{labels[selected.reviewStatus]}</span><div><button disabled={saving || selected.reviewStatus === "new"} onClick={() => decide("new")}>Reset to pending</button><button className={styles.reject} disabled={saving || selected.reviewStatus === "rejected"} onClick={() => decide("rejected")}>Reject</button><button className={styles.primary} disabled={saving || selected.reviewStatus === "accepted"} onClick={() => decide("accepted")}>{saving ? "Saving…" : "Accept"}</button></div>{error && <p className={styles.error} role="alert">{error}</p>}</footer></>}
    </dialog>
  </main>;
}
