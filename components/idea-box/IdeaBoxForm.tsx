"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  COLLABORATOR_CHOICES,
  EMPTY_IDEA_DRAFT,
  IDEA_DOMAINS,
  PRODUCT_CATEGORIES,
  PROTOTYPE_STATUSES,
  SUPPORT_OPTIONS,
  TEAM_SIZES,
  TEAM_STATUSES,
  type IdeaDraft,
  type IdeaFieldErrors,
} from "@/lib/ideas/types";
import { validateIdeaSubmission } from "@/lib/ideas/validation";

const inputClass =
  "min-h-12 w-full border border-white/25 bg-white/[0.035] px-4 py-3 text-base text-white outline-none transition-[border-color,background-color] placeholder:text-white/38 hover:border-white/45 focus:border-emerald-400 focus:bg-white/[0.06]";
const labelClass = "text-sm font-medium tracking-[0.04em] text-white";
const hintClass = "text-sm leading-6 text-white/55";
const optionalMark = <span className="font-normal text-white/45"> (optional)</span>;

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

function SelectInput({
  id,
  label,
  placeholder,
  value,
  error,
  errorId,
  options,
  onChange,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  errorId: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        className={`${inputClass} mt-2`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        <option value="" className="bg-zinc-950">{placeholder}</option>
        {options.map((option) => <option key={option} value={option} className="bg-zinc-950">{option}</option>)}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function RadioCards({
  label,
  name,
  columns,
  value,
  error,
  errorId,
  options,
  onChange,
}: {
  label: string;
  name: string;
  columns: string;
  value: string;
  error?: string;
  errorId: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className={labelClass}>{label}</p>
      <div className={`mt-3 grid gap-2 ${columns}`} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <label key={option} className={`flex min-h-12 cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors ${value === option ? "border-emerald-400 bg-emerald-400/10 text-white" : "border-white/20 text-white/65 hover:border-white/45"}`}>
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} className="accent-emerald-400" />
            {option}
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function TextArea({
  id,
  label,
  optional = false,
  hint,
  rows,
  maxLength,
  minHeight,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  rows: number;
  maxLength: number;
  minHeight: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>{label}{optional ? optionalMark : null}</label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        maxLength={maxLength}
        className={`${inputClass} mt-2 ${minHeight} resize-y`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {hint ? <p id={`${id}-hint`} className={`${hintClass} mt-2`}>{hint}</p> : null}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function TextInput({
  id,
  label,
  optional = false,
  type = "text",
  inputMode,
  autoComplete,
  maxLength,
  placeholder,
  className = "",
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  optional?: boolean;
  type?: string;
  inputMode?: "url" | "tel" | "text";
  autoComplete?: string;
  maxLength: number;
  placeholder: string;
  className?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={id}>{label}{optional ? optionalMark : null}</label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`${inputClass} mt-2 ${className}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
      />
      <FieldError id={`${id}-error`} message={error} />
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
        <SectionHeading number="01" title="Builder information" copy="Tell us who is building and how we can reach you." />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <TextInput id="fullName" label="Full name" autoComplete="name" maxLength={80} placeholder="Your full name" value={draft.fullName} error={fieldErrors.fullName} onChange={(value) => updateField("fullName", value)} />
          </div>
          <TextInput id="usn" label="USN" autoComplete="off" maxLength={20} placeholder="1BY23CS001" className="uppercase" value={draft.usn} error={fieldErrors.usn} onChange={(value) => updateField("usn", value)} />
          <TextInput id="email" label="College email" type="email" autoComplete="email" maxLength={160} placeholder="you@college.edu" value={draft.email} error={fieldErrors.email} onChange={(value) => updateField("email", value)} />
          <TextInput id="portfolioUrl" label="LinkedIn / Portfolio URL" optional type="url" inputMode="url" maxLength={500} placeholder="https://linkedin.com/in/..." value={draft.portfolioUrl} error={fieldErrors.portfolioUrl} onChange={(value) => updateField("portfolioUrl", value)} />
          <TextInput id="phone" label="Phone number" type="tel" inputMode="tel" autoComplete="tel" maxLength={25} placeholder="+91 98765 43210" value={draft.phone} error={fieldErrors.phone} onChange={(value) => updateField("phone", value)} />
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="02" title="Project classification" copy="Tell us what you're building." />
        <div className="space-y-6">
          <TextInput id="projectName" label="Project name" maxLength={120} placeholder="Give your build a clear name" value={draft.projectName} error={fieldErrors.projectName} onChange={(value) => updateField("projectName", value)} />
          <SelectInput id="domain" label="Primary domain / sector" placeholder="Select a domain" value={draft.domain} error={fieldErrors.domain} errorId="domain-error" options={IDEA_DOMAINS} onChange={(value) => updateField("domain", value)} />
          <RadioCards label="Product category" name="productCategory" columns="grid-cols-2 sm:grid-cols-3" value={draft.productCategory} error={fieldErrors.productCategory} errorId="productCategory-error" options={PRODUCT_CATEGORIES} onChange={(value) => updateField("productCategory", value)} />
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="03" title="Problem identification" copy="What problem are you solving, and who experiences it?" />
        <TextArea
          id="problem"
          label="The problem"
          rows={5}
          maxLength={1500}
          minHeight="min-h-36"
          hint="Explain the problem, your target audience, and why existing solutions aren't sufficient."
          value={draft.problem}
          error={fieldErrors.problem}
          onChange={(value) => updateField("problem", value)}
        />
      </fieldset>

      <fieldset>
        <SectionHeading number="04" title="Product & differentiation" copy="What exactly are you building, and what makes your approach different?" />
        <TextArea
          id="solution"
          label="The product"
          rows={6}
          maxLength={2500}
          minHeight="min-h-44"
          hint="Describe how your product works, its core features, and what differentiates it from existing alternatives."
          value={draft.solution}
          error={fieldErrors.solution}
          onChange={(value) => updateField("solution", value)}
        />
      </fieldset>

      <fieldset>
        <SectionHeading number="05" title="Development & validation" copy="How far have you progressed with the build?" />
        <div className="space-y-8">
          <RadioCards label="Development stage" name="prototypeStatus" columns="grid-cols-2 sm:grid-cols-4" value={draft.prototypeStatus} error={fieldErrors.prototypeStatus} errorId="prototypeStatus-error" options={PROTOTYPE_STATUSES} onChange={(value) => updateField("prototypeStatus", value)} />
          <TextArea
            id="traction"
            label="Progress so far"
            rows={5}
            maxLength={1500}
            minHeight="min-h-36"
            hint="What have you built so far? Have you tested it with actual users? Any users, customers, pilot projects, revenue, or other traction?"
            value={draft.traction}
            error={fieldErrors.traction}
            onChange={(value) => updateField("traction", value)}
          />
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="06" title="Team & collaboration" copy="Who's building it with you?" />
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <RadioCards label="Team status" name="teamStatus" columns="grid-cols-1 sm:grid-cols-3" value={draft.teamStatus} error={fieldErrors.teamStatus} errorId="teamStatus-error" options={TEAM_STATUSES} onChange={(value) => updateField("teamStatus", value)} />
            <SelectInput id="teamSize" label="Number of team members" placeholder="Select team size" value={draft.teamSize} error={fieldErrors.teamSize} errorId="teamSize-error" options={TEAM_SIZES} onChange={(value) => updateField("teamSize", value)} />
          </div>
          <TextArea
            id="teamRoles"
            label="Current team roles and expertise"
            rows={4}
            maxLength={1500}
            minHeight="min-h-28"
            value={draft.teamRoles}
            error={fieldErrors.teamRoles}
            onChange={(value) => updateField("teamRoles", value)}
          />
          <RadioCards label="Are you looking for collaborators?" name="lookingForCollaborators" columns="grid-cols-2 sm:w-64" value={draft.lookingForCollaborators} error={fieldErrors.lookingForCollaborators} errorId="lookingForCollaborators-error" options={COLLABORATOR_CHOICES} onChange={(value) => updateField("lookingForCollaborators", value)} />
          <TextArea
            id="collaboratorNeeds"
            label="Skills or roles you need"
            optional
            rows={3}
            maxLength={800}
            minHeight="min-h-24"
            hint="If yes, tell us what skills or roles you're looking for."
            value={draft.collaboratorNeeds}
            error={fieldErrors.collaboratorNeeds}
            onChange={(value) => updateField("collaboratorNeeds", value)}
          />
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="07" title="Business & sustainability" copy="What's the long-term potential of this project?" />
        <TextArea
          id="businessPotential"
          label="Long-term potential"
          rows={5}
          maxLength={1500}
          minHeight="min-h-36"
          hint="How do you plan to sustain or monetize it? Who would pay for it, and what does the potential market or impact look like? For research or social-impact projects, describe the intended outcome instead."
          value={draft.businessPotential}
          error={fieldErrors.businessPotential}
          onChange={(value) => updateField("businessPotential", value)}
        />
      </fieldset>

      <fieldset>
        <SectionHeading number="08" title="Roadmap & support requirements" copy="What do you need to take this project to the next level?" />
        <div className="space-y-8">
          <div>
            <p className={labelClass}>Support requirements</p>
            <p className={`${hintClass} mt-2`}>Select all that apply.</p>
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
          <TextArea
            id="nextMilestone"
            label="Next milestone"
            rows={4}
            maxLength={1000}
            minHeight="min-h-28"
            hint="What is your next milestone, and what resources do you need to hit it?"
            value={draft.nextMilestone}
            error={fieldErrors.nextMilestone}
            onChange={(value) => updateField("nextMilestone", value)}
          />
          <TextInput id="fundingEstimate" label="Estimated funding requirement" optional maxLength={100} placeholder="e.g. ₹50,000 for cloud credits and hardware" value={draft.fundingEstimate} error={fieldErrors.fundingEstimate} onChange={(value) => updateField("fundingEstimate", value)} />
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="09" title="Project links" copy="Share where we can see the work." />
        <div className="grid gap-6 md:grid-cols-2">
          <TextInput id="githubUrl" label="GitHub" optional type="url" inputMode="url" maxLength={500} placeholder="https://github.com/..." value={draft.githubUrl} error={fieldErrors.githubUrl} onChange={(value) => updateField("githubUrl", value)} />
          <TextInput id="demoUrl" label="Live demo" optional type="url" inputMode="url" maxLength={500} placeholder="https://..." value={draft.demoUrl} error={fieldErrors.demoUrl} onChange={(value) => updateField("demoUrl", value)} />
          <TextInput id="websiteUrl" label="Website" optional type="url" inputMode="url" maxLength={500} placeholder="https://..." value={draft.websiteUrl} error={fieldErrors.websiteUrl} onChange={(value) => updateField("websiteUrl", value)} />
          <TextInput id="pitchDeckUrl" label="Pitch deck" optional type="url" inputMode="url" maxLength={500} placeholder="https://..." value={draft.pitchDeckUrl} error={fieldErrors.pitchDeckUrl} onChange={(value) => updateField("pitchDeckUrl", value)} />
        </div>
      </fieldset>

      <fieldset>
        <SectionHeading number="10" title="Consent" copy="Please confirm all three to submit." />
        <div className="space-y-3">
          {([
            ["consentReview", "I agree to IIC storing and reviewing my submission."],
            ["consentShare", "I consent to IIC sharing my project details with relevant mentors, potential collaborators, incubators, or investors."],
            ["consentFeature", "I agree to having my project featured publicly in the Who's Building? series."],
          ] as const).map(([field, text]) => (
            <label key={field} className={`flex cursor-pointer items-start gap-4 border p-4 transition-colors ${draft[field] ? "border-emerald-400 bg-emerald-400/10" : "border-white/20 hover:border-white/45"}`}>
              <input type="checkbox" name={field} checked={draft[field]} onChange={(event) => updateField(field, event.target.checked)} className="mt-1 accent-emerald-400" />
              <span className="text-sm leading-6 text-white/70">{text}</span>
            </label>
          ))}
          <FieldError id="consentReview-error" message={fieldErrors.consentReview} />
          <FieldError id="consentShare-error" message={fieldErrors.consentShare} />
          <FieldError id="consentFeature-error" message={fieldErrors.consentFeature} />
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
