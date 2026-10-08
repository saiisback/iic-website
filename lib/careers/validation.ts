import {
  CAREER_SECTIONS,
  MIN_ANSWER_LENGTH,
  ROLE_EXAMPLE_MAX_LENGTH,
} from "./questions";
import {
  CAREER_ROLE_TYPES,
  type CareerDraft,
  type CareerFieldErrors,
  type CareerRoleType,
  type ValidCareerSubmission,
  type ValidationResult,
} from "./types";

const USN_PATTERN = /^[A-Z0-9-]{6,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(input: Record<string, unknown>, key: keyof CareerDraft): string {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

function isMember<T extends readonly string[]>(
  values: T,
  value: string,
): value is T[number] {
  return values.includes(value as T[number]);
}

function hasLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

export function validateCareerSubmission(input: unknown): ValidationResult {
  const source =
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};

  const fullName = readString(source, "fullName");
  const usn = readString(source, "usn").toUpperCase();
  const email = readString(source, "email");
  const website = readString(source, "website");
  const errors: CareerFieldErrors = {};

  if (!hasLength(fullName, 2, 80)) errors.fullName = "Enter a name between 2 and 80 characters.";
  if (!USN_PATTERN.test(usn)) errors.usn = "Enter a valid USN.";
  if (!EMAIL_PATTERN.test(email) || email.length > 160) errors.email = "Enter a valid email address.";

  for (const section of CAREER_SECTIONS) {
    for (const question of section.questions) {
      if (question.variant === "role") continue;

      const value = readString(source, question.id);
      if (question.optional) {
        if (value.length > question.maxLength) {
          errors[question.id] = `Keep this under ${question.maxLength} characters.`;
        }
        continue;
      }

      if (!hasLength(value, MIN_ANSWER_LENGTH, question.maxLength)) {
        errors[question.id] = `Answer between ${MIN_ANSWER_LENGTH} and ${question.maxLength} characters.`;
      }
    }
  }

  const roleType = readString(source, "roleType");
  const roleExample = readString(source, "roleExample");
  if (!isMember(CAREER_ROLE_TYPES, roleType)) {
    errors.roleType = "Choose Idea Person, Builder, or Organizer.";
  }
  if (!hasLength(roleExample, MIN_ANSWER_LENGTH, ROLE_EXAMPLE_MAX_LENGTH)) {
    errors.roleExample = `Give an example between ${MIN_ANSWER_LENGTH} and ${ROLE_EXAMPLE_MAX_LENGTH} characters.`;
  }

  if (source.consent !== true) errors.consent = "Consent is required.";
  if (website) errors.website = "Unable to submit this form.";

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  return {
    ok: true,
    value: {
      fullName,
      usn,
      email,
      whyIic: readString(source, "whyIic"),
      innovationMeaning: readString(source, "innovationMeaning"),
      talkAbout: readString(source, "talkAbout"),
      proudWork: readString(source, "proudWork"),
      roleType: roleType as CareerRoleType,
      roleExample,
      mistakeResponse: readString(source, "mistakeResponse"),
      differentStyle: readString(source, "differentStyle"),
      learningStruggle: readString(source, "learningStruggle"),
      campusProblem: readString(source, "campusProblem"),
      unlimitedProblem: readString(source, "unlimitedProblem"),
      contribution: readString(source, "contribution"),
      rememberedFor: readString(source, "rememberedFor"),
      expectations: readString(source, "expectations"),
      consent: true,
    } satisfies ValidCareerSubmission,
  };
}
