"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  EMPTY_IDEA_DRAFT,
  IDEA_DOMAINS,
  PROTOTYPE_STATUSES,
  SUPPORT_OPTIONS,
  TEAM_STATUSES,
  type IdeaDraft,
  type IdeaFieldErrors,
} from "@/lib/ideas/types";
import { validateIdeaSubmission } from "@/lib/ideas/validation";

const inputClass =
  "min-h-12 w-full border border-white/25 bg-white/[0.035] px-4 py-3 text-base text-white outline-none transition-[border-color,background-color] placeholder:text-white/38 hover:border-white/45 focus:border-emerald-400 focus:bg-white/[0.06]";
const labelClass = "text-sm font-medium tracking-[0.04em] text-white";
const hintClass = "text-sm leading-6 text-white/55";

type FormStatus = "idle" | "submitting" | "success" | "error";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-rose-300">
      {message}
    </p>
  );
}

function SectionHeading({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <div className="mb-8 grid grid-cols-[2.75rem_1fr] gap-4 border-b border-white/20 pb-5">
      <span className="font-mono text-sm text-emerald-300">{number}</span>
      <div>
        <h2 className="text-2xl font-medium tracking-tight text-white">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">{copy}</p>
      </div>
    </div>
  );
}

export function IdeaBoxForm() {
  const [draft, setDraft] = useState<IdeaDraft>(() => ({
    ...EMPTY_IDEA_DRAFT,
    supportNeeds: [],
  }));
  const [fieldErrors, setFieldErrors] = useState<IdeaFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");

  const clearError = (field: keyof IdeaDraft) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateField = <K extends keyof IdeaDraft>(field: K, value: IdeaDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    clearError(field);
    setFormError("");
  };

  const toggleSupport = (option: string) => {
    const supportNeeds = draft.supportNeeds.includes(option)
      ? draft.supportNeeds.filter((item) => item !== option)
      : [...draft.supportNeeds, option];
    updateField("supportNeeds", supportNeeds);
  };

  const focusField = (name: string) => {
    requestAnimationFrame(() => {
      const control = document.querySelector<HTMLElement>(`[name="${name}"]`);
      control?.focus();
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const validation = validateIdeaSubmission(draft);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      setStatus("error");
      setFormError("Check the highlighted fields and try again.");
      const firstField = Object.keys(validation.fieldErrors)[0];
      if (firstField) focusField(firstField);
      return;
    }

    setStatus("submitting");
    setFieldErrors({});
    setFormError("");

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        submissionId?: unknown;
        error?: string;
        fieldErrors?: IdeaFieldErrors;
      };

      if (response.status === 400 && payload.error === "validation_failed") {
        const errors = payload.fieldErrors ?? {};
        setFieldErrors(errors);
        setStatus("error");
        setFormError("Check the highlighted fields and try again.");
        const firstField = Object.keys(errors)[0];
        if (firstField) focusField(firstField);
        return;
      }

      if (response.ok && payload.ok && typeof payload.submissionId === "string") {
        setDraft({ ...EMPTY_IDEA_DRAFT, supportNeeds: [] });
        setStatus("success");
        return;
      }

      throw new Error("Submission failed");
    } catch {
      setStatus("error");
      setFormError("We could not save your idea. Your answers are still here, so please try again.");
    }
  };

  if (status === "success") {
    return (
      <section className="border border-emerald-400/70 bg-emerald-400/[0.06] p-7 text-white md:p-10" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-300">Idea received</p>
        <h2 className="mt-5 text-4xl font-medium tracking-tight">Thanks for sharing your build.</h2>
        <p className="mt-4 max-w-lg text-base leading-7 text-white/65">
          The IIC team will review your idea and reach out to you on your college email.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center bg-emerald-400 px-6 text-sm font-bold tracking-[0.14em] text-[#07110d] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:translate-y-px"
        >
          BACK HOME
        </Link>
      </section>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-16">
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={draft.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>

      <fieldset>
        <SectionHeading number="01" title="Builder identity" copy="Tell us who is leading the build and how we can reach you." />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" autoComplete="name" maxLength={80} className={`${inputClass} mt-2`} value={draft.fullName} onChange={(event) => updateField("fullName", event.target.value)} aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined} placeholder="Your full name" />
            <FieldError id="fullName-error" message={fieldErrors.fullName} />
          </div>
          <div>
            <label className={labelClass} htmlFor="usn">USN</label>
            <input id="usn" name="usn" autoComplete="off" maxLength={20} className={`${inputClass} mt-2 uppercase`} value={draft.usn} onChange={(event) => updateField("usn", event.target.value)} aria-invalid={Boolean(fieldErrors.usn)} aria-describedby={fieldErrors.usn ? "usn-error" : "usn-hint"} placeholder="1BY23CS001" />
            <p id="usn-hint" className={`${hintClass} mt-2`}>Letters, numbers, and hyphens only.</p>
            <FieldError id="usn-error" message={fieldErrors.usn} />
          </div>
          <div>
            <label className={labelClass} htmlFor="email">College email</label>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={160} className={`${inputClass} mt-2`} value={draft.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(fieldErrors.email)} aria-describedby={fieldErrors.email ? "email-error" : undefined} placeholder="you@college.edu" />
            <FieldError id="email-error" message={fieldErrors.email} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="02" title="Build brief" copy="Explain the problem clearly, then show us what you are making to solve it." />
        <div className="space-y-6">
          <div>
            <label className={labelClass} htmlFor="projectName">Project name</label>
            <input id="projectName" name="projectName" maxLength={120} className={`${inputClass} mt-2`} value={draft.projectName} onChange={(event) => updateField("projectName", event.target.value)} aria-invalid={Boolean(fieldErrors.projectName)} aria-describedby={fieldErrors.projectName ? "projectName-error" : undefined} placeholder="Give your build a clear name" />
            <FieldError id="projectName-error" message={fieldErrors.projectName} />
          </div>
          <div>
            <label className={labelClass} htmlFor="summary">One-line summary</label>
            <textarea id="summary" name="summary" rows={2} maxLength={180} className={`${inputClass} mt-2 min-h-24 resize-y`} value={draft.summary} onChange={(event) => updateField("summary", event.target.value)} aria-invalid={Boolean(fieldErrors.summary)} aria-describedby={fieldErrors.summary ? "summary-error" : "summary-hint"} placeholder="What does it do, in one sentence?" />
            <p id="summary-hint" className={`${hintClass} mt-2`}>10-180 characters.</p>
            <FieldError id="summary-error" message={fieldErrors.summary} />
          </div>
          <div>
            <label className={labelClass} htmlFor="problem">What problem are you solving?</label>
            <textarea id="problem" name="problem" rows={5} maxLength={1500} className={`${inputClass} mt-2 min-h-36 resize-y`} value={draft.problem} onChange={(event) => updateField("problem", event.target.value)} aria-invalid={Boolean(fieldErrors.problem)} aria-describedby={fieldErrors.problem ? "problem-error" : undefined} placeholder="Who has this problem, and why does it matter?" />
            <FieldError id="problem-error" message={fieldErrors.problem} />
          </div>
          <div>
            <label className={labelClass} htmlFor="solution">What are you building?</label>
            <textarea id="solution" name="solution" rows={6} maxLength={2500} className={`${inputClass} mt-2 min-h-44 resize-y`} value={draft.solution} onChange={(event) => updateField("solution", event.target.value)} aria-invalid={Boolean(fieldErrors.solution)} aria-describedby={fieldErrors.solution ? "solution-error" : "solution-hint"} placeholder="Describe the product, prototype, or experiment." />
            <p id="solution-hint" className={`${hintClass} mt-2`}>Include the core idea, how it works, and what you have made so far.</p>
            <FieldError id="solution-error" message={fieldErrors.solution} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="03" title="Prototype state" copy="Place the build in context so we can understand its current stage." />
        <div className="space-y-8">
          <div>
            <label className={labelClass} htmlFor="domain">Domain</label>
            <select id="domain" name="domain" className={`${inputClass} mt-2`} value={draft.domain} onChange={(event) => updateField("domain", event.target.value)} aria-invalid={Boolean(fieldErrors.domain)} aria-describedby={fieldErrors.domain ? "domain-error" : undefined}>
              <option value="" className="bg-zinc-950">Select a domain</option>
              {IDEA_DOMAINS.map((option) => <option key={option} value={option} className="bg-zinc-950">{option}</option>)}
            </select>
            <FieldError id="domain-error" message={fieldErrors.domain} />
          </div>
          <div>
            <p className={labelClass}>Prototype status</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Prototype status">
              {PROTOTYPE_STATUSES.map((option) => (
                <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${draft.prototypeStatus === option ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-white/20 text-white/65 hover:border-white/45"}`}>
                  <input type="radio" name="prototypeStatus" value={option} checked={draft.prototypeStatus === option} onChange={() => updateField("prototypeStatus", option)} className="accent-emerald-400" />
                  {option}
                </label>
              ))}
            </div>
            <FieldError id="prototypeStatus-error" message={fieldErrors.prototypeStatus} />
          </div>
          <div>
            <p className={labelClass}>Team status</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Team status">
              {TEAM_STATUSES.map((option) => (
                <label key={option} className={`flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${draft.teamStatus === option ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-white/20 text-white/65 hover:border-white/45"}`}>
                  <input type="radio" name="teamStatus" value={option} checked={draft.teamStatus === option} onChange={() => updateField("teamStatus", option)} className="accent-emerald-400" />
                  {option}
                </label>
              ))}
            </div>
            <FieldError id="teamStatus-error" message={fieldErrors.teamStatus} />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="04" title="Support request" copy="Tell us what would help you make the next meaningful step." />
        <div className="space-y-8">
          <div>
            <p className={labelClass}>What support do you need?</p>
            <p className={`${hintClass} mt-2`}>Choose all that apply.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {SUPPORT_OPTIONS.map((option) => (
                <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${draft.supportNeeds.includes(option) ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-white/20 text-white/65 hover:border-white/45"}`}>
                  <input type="checkbox" name="supportNeeds" value={option} checked={draft.supportNeeds.includes(option)} onChange={() => toggleSupport(option)} className="accent-emerald-400" />
                  {option}
                </label>
              ))}
            </div>
            <FieldError id="supportNeeds-error" message={fieldErrors.supportNeeds} />
          </div>
          <div>
            <label className={labelClass} htmlFor="projectUrl">Demo or GitHub URL <span className="font-normal text-white/45">(optional)</span></label>
            <input id="projectUrl" name="projectUrl" type="url" inputMode="url" maxLength={500} className={`${inputClass} mt-2`} value={draft.projectUrl} onChange={(event) => updateField("projectUrl", event.target.value)} aria-invalid={Boolean(fieldErrors.projectUrl)} aria-describedby={fieldErrors.projectUrl ? "projectUrl-error" : undefined} placeholder="https://" />
            <FieldError id="projectUrl-error" message={fieldErrors.projectUrl} />
          </div>
          <div>
            <label className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${draft.consent ? "border-emerald-400 bg-emerald-400/10" : "border-white/20 hover:border-white/45"}`}>
              <input type="checkbox" name="consent" checked={draft.consent} onChange={(event) => updateField("consent", event.target.checked)} className="mt-1 accent-emerald-400" />
              <span className="text-sm leading-6 text-white/70">I consent to IIC BMSIT storing this submission and contacting me about the project.</span>
            </label>
            <FieldError id="consent-error" message={fieldErrors.consent} />
          </div>
        </div>
      </fieldset>

      <div className="border-t border-white/20 pt-8">
        <div aria-live="polite" className="mb-4 min-h-6 text-sm text-rose-300">{formError}</div>
        <button type="submit" disabled={status === "submitting"} className="flex min-h-14 w-full items-center justify-between bg-emerald-400 px-5 text-sm font-bold tracking-[0.14em] text-[#07110d] transition-[transform,background-color] hover:-translate-y-px hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:translate-y-px disabled:cursor-wait disabled:opacity-65">
          <span>{status === "submitting" ? "SUBMITTING..." : "SUBMIT IDEA"}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
