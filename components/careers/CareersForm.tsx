"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  CAREER_ROLE_TYPES,
  EMPTY_CAREER_DRAFT,
  type CareerDraft,
  type CareerFieldErrors,
} from "@/lib/careers/types";
import {
  CAREER_SECTIONS,
  ROLE_EXAMPLE_MAX_LENGTH,
  getSectionFieldIds,
  type CareerQuestion,
} from "@/lib/careers/questions";
import { validateCareerSubmission } from "@/lib/careers/validation";

const inputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-base leading-7 text-white outline-none transition-[border-color,background-color,box-shadow] placeholder:text-white/30 hover:border-white/35 focus:border-emerald-400 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(52,211,153,0.12)]";
const inputHeightClass = "min-h-[3.25rem]";
const textareaClass = "min-h-[7rem] resize-y";
const labelClass = "block text-lg font-medium leading-snug tracking-[-0.01em] text-white md:text-xl";
const hintClass = "mt-2 text-sm leading-6 text-white/45";

type FormStatus = "idle" | "submitting" | "success" | "error";

const ABOUT_SECTION = {
  id: "about",
  number: "01",
  title: "About you",
  copy: "Tell us who is applying and how we can reach you.",
};

const FORM_SECTIONS = [
  ABOUT_SECTION,
  ...CAREER_SECTIONS.map(({ id, number, title, copy }) => ({ id, number, title, copy })),
];

const QUESTIONS_BY_SECTION = new Map(CAREER_SECTIONS.map((section) => [section.id, section.questions]));

const SECTION_FIELD_IDS: Record<string, (keyof CareerDraft)[]> = {
  about: ["fullName", "usn", "email", "consent"],
};
for (const section of CAREER_SECTIONS) {
  SECTION_FIELD_IDS[section.id] = getSectionFieldIds(section);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-3 text-sm font-medium text-rose-300">
      {message}
    </p>
  );
}

export function CareersForm() {
  const [draft, setDraft] = useState<CareerDraft>(() => ({ ...EMPTY_CAREER_DRAFT }));
  const [fieldErrors, setFieldErrors] = useState<CareerFieldErrors>({});
  const [openSection, setOpenSection] = useState<string>(ABOUT_SECTION.id);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formError, setFormError] = useState("");

  const liveErrors = useMemo<CareerFieldErrors>(() => {
    const result = validateCareerSubmission(draft);
    return result.ok ? {} : result.fieldErrors;
  }, [draft]);

  const isSectionComplete = (sectionId: string) =>
    (SECTION_FIELD_IDS[sectionId] ?? []).every((field) => !liveErrors[field]);

  const completedCount = FORM_SECTIONS.filter((section) => isSectionComplete(section.id)).length;

  const clearError = (field: keyof CareerDraft) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateField = <K extends keyof CareerDraft>(field: K, value: CareerDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    clearError(field);
    setFormError("");
  };

  const focusField = (name: string) => {
    requestAnimationFrame(() => {
      const control = document.querySelector<HTMLElement>(`[name="${name}"]`);
      control?.focus();
    });
  };

  const scrollToSection = (sectionId: string) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.getElementById(`career-section-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const toggleSection = (sectionId: string) => {
    const willOpen = openSection !== sectionId;
    setOpenSection(willOpen ? sectionId : "");
    if (willOpen) scrollToSection(sectionId);
  };

  const handleContinue = (sectionId: string, index: number) => {
    const ids = SECTION_FIELD_IDS[sectionId] ?? [];
    const sectionErrors: CareerFieldErrors = {};
    for (const id of ids) {
      if (liveErrors[id]) sectionErrors[id] = liveErrors[id];
    }

    if (Object.keys(sectionErrors).length > 0) {
      setFieldErrors((current) => ({ ...current, ...sectionErrors }));
      setFormError("Finish this section before moving on.");
      const firstField = ids.find((id) => sectionErrors[id]);
      if (firstField) focusField(firstField);
      return;
    }

    setFieldErrors((current) => {
      const next = { ...current };
      for (const id of ids) delete next[id];
      return next;
    });
    setFormError("");

    const nextSection = FORM_SECTIONS[index + 1];
    if (nextSection) {
      setOpenSection(nextSection.id);
      scrollToSection(nextSection.id);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const validation = validateCareerSubmission(draft);
    if (!validation.ok) {
      setFieldErrors(validation.fieldErrors);
      setStatus("error");
      setFormError("Check the highlighted fields and try again.");
      const firstField = Object.keys(validation.fieldErrors)[0];
      const firstSection = FORM_SECTIONS.find((section) =>
        (SECTION_FIELD_IDS[section.id] ?? []).includes(firstField as keyof CareerDraft),
      );
      if (firstSection) {
        setOpenSection(firstSection.id);
        scrollToSection(firstSection.id);
      }
      if (firstField) focusField(firstField);
      return;
    }

    setStatus("submitting");
    setFieldErrors({});
    setFormError("");

    try {
      const response = await fetch("/api/careers", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(draft),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        submissionId?: unknown;
        error?: string;
        fieldErrors?: CareerFieldErrors;
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
        setDraft({ ...EMPTY_CAREER_DRAFT });
        setStatus("success");
        return;
      }

      throw new Error("Submission failed");
    } catch {
      setStatus("error");
      setFormError("We could not save your application. Your answers are still here, so please try again.");
    }
  };

  if (status === "success") {
    return (
      <section className="border border-emerald-400/70 bg-emerald-400/[0.06] p-7 text-white md:p-12" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">Application received</p>
        <h2 className="mt-6 font-display text-5xl leading-[0.9] tracking-tight md:text-6xl">THANK YOU.</h2>
        <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
          The IIC team will review your answers and reach out to you on your college email.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-14 items-center justify-center bg-emerald-400 px-7 text-sm font-bold tracking-[0.14em] text-[#07110d] transition-transform hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:translate-y-px"
        >
          BACK HOME
        </Link>
      </section>
    );
  }

  const renderTextarea = (question: CareerQuestion) => {
    const error = fieldErrors[question.id];
    const describedBy = error ? `${question.id}-error` : question.hint ? `${question.id}-hint` : undefined;
    return (
      <div key={question.id}>
        <label className={labelClass} htmlFor={question.id}>
          {question.label}
          {question.optional ? <span className="ml-2 text-base font-normal text-white/40">(optional)</span> : null}
        </label>
        {question.hint ? <p id={`${question.id}-hint`} className={hintClass}>{question.hint}</p> : null}
        <textarea
          id={question.id}
          name={question.id}
          rows={4}
          maxLength={question.maxLength}
          className={`${inputClass} ${textareaClass} mt-5`}
          value={draft[question.id] as string}
          onChange={(event) => updateField(question.id, event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
        />
        <FieldError id={`${question.id}-error`} message={error} />
      </div>
    );
  };

  const renderRole = (question: CareerQuestion) => (
    <div key={question.id}>
      <p className={labelClass}>{question.label}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={question.label}>
        {CAREER_ROLE_TYPES.map((option) => (
          <label
            key={option}
            className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border px-5 py-4 text-base transition-colors ${
              draft.roleType === option
                ? "border-emerald-400 bg-emerald-400/10 text-white"
                : "border-white/20 text-white/70 hover:border-white/45"
            }`}
          >
            <input
              type="radio"
              name="roleType"
              value={option}
              checked={draft.roleType === option}
              onChange={() => updateField("roleType", option)}
              className="h-5 w-5 accent-emerald-400"
            />
            {option}
          </label>
        ))}
      </div>
      <FieldError id="roleType-error" message={fieldErrors.roleType} />
      <div className="mt-10">
        <label className={labelClass} htmlFor="roleExample">
          {question.exampleLabel ?? "Example"}
        </label>
        {question.exampleHint ? <p id="roleExample-hint" className={hintClass}>{question.exampleHint}</p> : null}
        <textarea
          id="roleExample"
          name="roleExample"
          rows={3}
          maxLength={question.exampleMaxLength ?? ROLE_EXAMPLE_MAX_LENGTH}
          className={`${inputClass} ${textareaClass} mt-5`}
          value={draft.roleExample}
          onChange={(event) => updateField("roleExample", event.target.value)}
          aria-invalid={Boolean(fieldErrors.roleExample)}
          aria-describedby={fieldErrors.roleExample ? "roleExample-error" : "roleExample-hint"}
        />
        <FieldError id="roleExample-error" message={fieldErrors.roleExample} />
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-14 md:space-y-20">
      <div>
        <label className={labelClass} htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          maxLength={80}
          className={`${inputClass} ${inputHeightClass} mt-5`}
          value={draft.fullName}
          onChange={(event) => updateField("fullName", event.target.value)}
          aria-invalid={Boolean(fieldErrors.fullName)}
          aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
          placeholder="Your full name"
        />
        <FieldError id="fullName-error" message={fieldErrors.fullName} />
      </div>
      <div>
        <label className={labelClass} htmlFor="usn">USN</label>
        <p id="usn-hint" className={hintClass}>Letters, numbers, and hyphens only.</p>
        <input
          id="usn"
          name="usn"
          autoComplete="off"
          maxLength={20}
          className={`${inputClass} ${inputHeightClass} mt-5 uppercase`}
          value={draft.usn}
          onChange={(event) => updateField("usn", event.target.value)}
          aria-invalid={Boolean(fieldErrors.usn)}
          aria-describedby={fieldErrors.usn ? "usn-error" : "usn-hint"}
          placeholder="1BY23CS001"
        />
        <FieldError id="usn-error" message={fieldErrors.usn} />
      </div>
      <div>
        <label className={labelClass} htmlFor="email">College email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          className={`${inputClass} ${inputHeightClass} mt-5`}
          value={draft.email}
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          placeholder="you@college.edu"
        />
        <FieldError id="email-error" message={fieldErrors.email} />
      </div>
      <div>
        <label
          className={`flex min-h-14 cursor-pointer items-start gap-4 rounded-xl border p-5 transition-colors ${
            draft.consent ? "border-emerald-400 bg-emerald-400/10" : "border-white/20 hover:border-white/45"
          }`}
        >
          <input
            type="checkbox"
            name="consent"
            checked={draft.consent}
            onChange={(event) => updateField("consent", event.target.checked)}
            className="mt-1 h-5 w-5 accent-emerald-400"
          />
          <span className="text-base leading-7 text-white/70">
            I consent to IIC BMSIT storing this application and contacting me about it.
          </span>
        </label>
        <FieldError id="consent-error" message={fieldErrors.consent} />
      </div>
    </div>
  );

  return (
    <form noValidate onSubmit={handleSubmit}>
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

      <div className="sticky top-0 z-20 mb-12 border-b border-white/12 bg-[#050706]/95 py-5 backdrop-blur md:py-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-emerald-300">IIC Careers</span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/60">
            {String(completedCount).padStart(2, "0")} / {String(FORM_SECTIONS.length).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden="true">
          {FORM_SECTIONS.map((section) => (
            <span
              key={section.id}
              className={`h-1 flex-1 transition-colors ${
                isSectionComplete(section.id) ? "bg-emerald-400" : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        {FORM_SECTIONS.map((section, index) => {
          const isOpen = openSection === section.id;
          const isComplete = isSectionComplete(section.id);
          const questions = QUESTIONS_BY_SECTION.get(section.id) ?? [];

          return (
            <section
              key={section.id}
              id={`career-section-${section.id}`}
              className="scroll-mt-28 border-b border-white/12"
            >
              <h2>
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={`career-panel-${section.id}`}
                  className="group flex w-full items-start gap-4 py-8 text-left md:gap-6 md:py-10"
                >
                  <span
                    className={`mt-1.5 shrink-0 font-mono text-sm transition-colors ${
                      isComplete ? "text-emerald-400" : isOpen ? "text-emerald-300" : "text-white/35"
                    }`}
                  >
                    {section.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-3xl font-medium tracking-[-0.025em] transition-colors md:text-4xl ${
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white"
                      }`}
                    >
                      {section.title}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 shrink-0 font-mono text-base transition-colors ${
                      isComplete ? "text-emerald-400" : "text-white/35 group-hover:text-white/70"
                    }`}
                  >
                    {isComplete ? "✓" : isOpen ? "–" : "↓"}
                  </span>
                </button>
              </h2>

              {isOpen ? (
                <div id={`career-panel-${section.id}`} className="pb-16 md:pb-20">
                  <p className="mb-12 max-w-xl text-base leading-7 text-white/55 md:mb-16 md:text-lg md:leading-8">
                    {section.copy}
                  </p>
                  {section.id === "about" ? renderAbout() : (
                    <div className="space-y-14 md:space-y-20">
                      {questions.map((question) =>
                        question.variant === "role" ? renderRole(question) : renderTextarea(question),
                      )}
                    </div>
                  )}

                  {index < FORM_SECTIONS.length - 1 ? (
                    <div className="mt-14 md:mt-16">
                      <button
                        type="button"
                        onClick={() => handleContinue(section.id, index)}
                        className="group inline-flex min-h-12 items-center gap-3 rounded-lg border border-white/25 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-emerald-400 hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
                      >
                        Continue
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <div className="pt-14 md:pt-16">
        <div aria-live="polite" className="mb-4 min-h-6 text-sm text-rose-300">{formError}</div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="flex min-h-14 w-full items-center justify-between rounded-xl bg-emerald-400 px-6 text-sm font-bold tracking-[0.16em] text-[#07110d] transition-[transform,background-color] hover:-translate-y-px hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 active:translate-y-px disabled:cursor-wait disabled:opacity-65"
        >
          <span>{status === "submitting" ? "SUBMITTING..." : "SUBMIT APPLICATION"}</span>
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
